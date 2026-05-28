// controllers/cms/contentController.factory.js
import {
  uniqueSlug,
  publicMatch,
  toDateOrNull,
} from "../../utils/cms/contentWorkflow.js";
import { triggerRevalidation } from "../../utils/cms/revalidate.js";

function authorFromReq(req) {
  const name =
    [req.user?.firstName, req.user?.lastName].filter(Boolean).join(" ") ||
    req.user?.email ||
    "Staff";
  return { id: String(req.user?.id || ""), name };
}

/**
 * Builds a set of Express handlers for a CMS collection.
 *
 * options:
 *   resourceName   - human label (for messages)
 *   hasSlug        - generate/maintain a unique slug from `title` (default true)
 *   titleField     - field used to derive slug (default "title")
 *   hasScheduling  - supports scheduledFor + scheduled status (default true)
 *   searchFields   - fields used by ?search= (default ["title"])
 *   adminSort      - default sort for admin list (default "-createdAt")
 *   publicSort     - default sort for public list (default "-publishedAt")
 *   editableFields - fields accepted from the request body on create/update
 *   revalidatePaths(doc) - array of site paths to revalidate on publish changes
 */
export function createContentController(Model, options) {
  const {
    resourceName = "item",
    hasSlug = true,
    titleField = "title",
    hasScheduling = true,
    searchFields = ["title"],
    adminSort = "-createdAt",
    publicSort = "-publishedAt",
    editableFields = [],
    revalidatePaths = () => [],
  } = options;

  const pickEditable = (body = {}) => {
    const out = {};
    for (const f of editableFields) {
      if (body[f] !== undefined) out[f] = body[f];
    }
    return out;
  };

  const revalidate = (doc) => {
    try {
      const paths = revalidatePaths(doc) || [];
      if (paths.length) triggerRevalidation(paths);
    } catch (e) {
      console.error("revalidate paths error:", e?.message || e);
    }
  };

  return {
    // ---- ADMIN: list everything, any status ----
    async adminList(req, res) {
      try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(
          Math.max(parseInt(req.query.limit, 10) || 20, 1),
          100,
        );
        const sort = req.query.sort || adminSort;
        const search = (req.query.search || "").trim();
        const status = req.query.status;

        const filter = {};
        if (status) filter.status = status;
        if (search) {
          filter.$or = searchFields.map((f) => ({
            [f]: { $regex: search, $options: "i" },
          }));
        }

        const total = await Model.countDocuments(filter);
        const docs = await Model.find(filter)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        return res.json({
          docs,
          total,
          page,
          pages: Math.max(Math.ceil(total / limit), 1),
          limit,
        });
      } catch (err) {
        console.error(`${resourceName} adminList error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to load ${resourceName}s` });
      }
    },

    // ---- ADMIN: single by id ----
    async adminGet(req, res) {
      try {
        const doc = await Model.findById(req.params.id).lean();
        if (!doc)
          return res.status(404).json({ message: `${resourceName} not found` });
        return res.json(doc);
      } catch (err) {
        console.error(`${resourceName} adminGet error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to load ${resourceName}` });
      }
    },

    // ---- ADMIN: create (always starts as draft) ----
    async create(req, res) {
      try {
        const data = pickEditable(req.body);
        data.author = authorFromReq(req);
        data.status = "draft";
        data.publishedAt = null;
        if (hasScheduling) data.scheduledFor = null;

        if (hasSlug) {
          const base = req.body.slug || data[titleField] || resourceName;
          data.slug = await uniqueSlug(Model, base);
        }

        const doc = await Model.create(data);
        return res
          .status(201)
          .json({ message: `${resourceName} created`, doc });
      } catch (err) {
        if (err?.code === 11000) {
          return res
            .status(409)
            .json({ message: "A record with that slug/key already exists." });
        }
        console.error(`${resourceName} create error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to create ${resourceName}` });
      }
    },

    // ---- ADMIN: update (does not change status; use publish/unpublish) ----
    async update(req, res) {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc)
          return res.status(404).json({ message: `${resourceName} not found` });

        const data = pickEditable(req.body);

        // Maintain slug if the title or slug changed.
        if (hasSlug && (req.body.slug || data[titleField])) {
          const base = req.body.slug || data[titleField] || doc[titleField];
          data.slug = await uniqueSlug(Model, base, doc._id);
        }

        Object.assign(doc, data);
        await doc.save();

        // If it's already live, push a revalidation so edits appear.
        if (doc.status === "published") revalidate(doc);

        return res.json({ message: `${resourceName} updated`, doc });
      } catch (err) {
        if (err?.code === 11000) {
          return res
            .status(409)
            .json({ message: "A record with that slug/key already exists." });
        }
        console.error(`${resourceName} update error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to update ${resourceName}` });
      }
    },

    // ---- PUBLISHER: publish now ----
    async publish(req, res) {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc)
          return res.status(404).json({ message: `${resourceName} not found` });

        doc.status = "published";
        if (!doc.publishedAt) doc.publishedAt = new Date();
        if (hasScheduling) doc.scheduledFor = null;
        await doc.save();

        revalidate(doc);
        return res.json({ message: `${resourceName} published`, doc });
      } catch (err) {
        console.error(`${resourceName} publish error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to publish ${resourceName}` });
      }
    },

    // ---- PUBLISHER: unpublish (back to draft) ----
    async unpublish(req, res) {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc)
          return res.status(404).json({ message: `${resourceName} not found` });

        const wasLive = doc.status === "published";
        doc.status = "draft";
        await doc.save();

        if (wasLive) revalidate(doc);
        return res.json({ message: `${resourceName} unpublished`, doc });
      } catch (err) {
        console.error(`${resourceName} unpublish error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to unpublish ${resourceName}` });
      }
    },

    // ---- PUBLISHER: schedule for a future time ----
    async schedule(req, res) {
      if (!hasScheduling) {
        return res
          .status(400)
          .json({ message: `${resourceName} does not support scheduling` });
      }
      try {
        const when = toDateOrNull(req.body.scheduledFor);
        if (!when || when.getTime() <= Date.now()) {
          return res
            .status(400)
            .json({ message: "scheduledFor must be a valid future date." });
        }
        const doc = await Model.findById(req.params.id);
        if (!doc)
          return res.status(404).json({ message: `${resourceName} not found` });

        doc.status = "scheduled";
        doc.scheduledFor = when;
        await doc.save();

        return res.json({ message: `${resourceName} scheduled`, doc });
      } catch (err) {
        console.error(`${resourceName} schedule error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to schedule ${resourceName}` });
      }
    },

    // ---- ADMIN ONLY: delete ----
    async remove(req, res) {
      try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc)
          return res.status(404).json({ message: `${resourceName} not found` });
        if (doc.status === "published") revalidate(doc);
        return res.json({
          message: `${resourceName} deleted`,
          id: req.params.id,
        });
      } catch (err) {
        console.error(`${resourceName} remove error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to delete ${resourceName}` });
      }
    },

    // ---- PUBLIC: list live items ----
    async publicList(req, res) {
      try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(
          Math.max(parseInt(req.query.limit, 10) || 12, 1),
          50,
        );
        const filter = publicMatch({ hasScheduling });

        // Optional public sort override for ordered collections (team/testimonials)
        const sort = req.query.sort || publicSort;

        const total = await Model.countDocuments(filter);
        const docs = await Model.find(filter)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .select("-__v")
          .lean();

        return res.json({
          docs,
          total,
          page,
          pages: Math.max(Math.ceil(total / limit), 1),
          limit,
        });
      } catch (err) {
        console.error(`${resourceName} publicList error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to load ${resourceName}s` });
      }
    },

    // ---- PUBLIC: single live item by slug ----
    async publicGetBySlug(req, res) {
      if (!hasSlug) {
        return res.status(404).json({ message: "Not found" });
      }
      try {
        const filter = {
          slug: req.params.slug,
          ...publicMatch({ hasScheduling }),
        };
        const doc = await Model.findOne(filter).select("-__v").lean();
        if (!doc)
          return res.status(404).json({ message: `${resourceName} not found` });
        return res.json(doc);
      } catch (err) {
        console.error(`${resourceName} publicGetBySlug error:`, err);
        return res
          .status(500)
          .json({ message: `Failed to load ${resourceName}` });
      }
    },
  };
}
