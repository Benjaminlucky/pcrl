// Dashboard pages: /dashboard/blog and /dashboard/events
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import { cmsRequest } from "./cmsApi";
import { COLLECTIONS, STATUS_META } from "./collections";
import { timeAgo } from "./format";
import { formatDate } from "../../../cms/content";
import { Alert, Badge, Btn, Loading, PageHeader, Panel, TextInput } from "./ui";

const TABS = [
  { value: "", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Live" },
];

export default function CollectionList({ collection }) {
  const config = COLLECTIONS[collection];
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "20" });
      if (status) qs.set("status", status);
      if (query) qs.set("search", query);
      if (collection === "events") qs.set("sort", "-startAt");
      setResult(await cmsRequest("GET", `/${collection}?${qs}`));
    } catch (e) {
      setError(e.message);
      setResult({ docs: [], total: 0, pages: 1 });
    }
  }, [collection, page, status, query]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="pb-16 space-y-5">
      <PageHeader
        title={config.label}
        subtitle={`Write ${config.singular}s as drafts, then publish or schedule them. Live ${config.singular}s appear on the website automatically.`}
        actions={
          <Btn variant="primary" onClick={() => navigate(`/dashboard/${collection}/new`)}>
            <FaPlus /> {config.newLabel}
          </Btn>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setPage(1);
                setStatus(t.value);
              }}
              className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${
                status === t.value ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <form
          className="relative flex-1 min-w-[200px]"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setQuery(search.trim());
          }}
        >
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
          <TextInput className="pl-8" placeholder="Search by title…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
      </div>

      {error && <Alert>{error}</Alert>}
      {!result ? (
        <Loading />
      ) : result.docs.length === 0 ? (
        <Panel className="p-10 text-center text-gray-400 text-sm">
          {query || status ? "Nothing matches these filters." : `No ${config.singular}s yet. Click “${config.newLabel}” to write the first one.`}
        </Panel>
      ) : (
        <Panel className="divide-y divide-white/5 overflow-hidden">
          {result.docs.map((doc) => {
            const meta = STATUS_META[doc.status] || STATUS_META.draft;
            const date = config.dateOf(doc);
            return (
              <div key={doc._id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03]">
                <div className="w-16 h-12 shrink-0 rounded-md overflow-hidden bg-black/40">
                  {doc.coverImage?.url && <img src={doc.coverImage.url} alt="" className="w-full h-full object-cover" />}
                </div>
                <Link to={`/dashboard/${collection}/${doc._id}`} className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-gray-100 truncate">{doc.title || "(untitled)"}</span>
                  <span className="block text-xs text-gray-500 truncate">
                    {date ? `${config.dateLabel} ${formatDate(date)} · ` : ""}
                    {doc.status === "scheduled" && doc.scheduledFor ? `goes live ${new Date(doc.scheduledFor).toLocaleString()} · ` : ""}
                    edited {timeAgo(doc.updatedAt)}
                    {doc.author?.name ? ` by ${doc.author.name}` : ""}
                  </span>
                </Link>
                <Badge color={meta.color}>{meta.label}</Badge>
                {doc.status === "published" && (
                  <a
                    href={config.publicPath(doc)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white p-1"
                    title="View on website"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                )}
                <Link
                  to={`/dashboard/${collection}/${doc._id}`}
                  className="px-2.5 py-1.5 text-xs rounded-lg font-medium bg-white/10 hover:bg-white/15 text-gray-100 transition"
                >
                  Edit
                </Link>
              </div>
            );
          })}
        </Panel>
      )}

      {result && result.pages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Page {result.page} of {result.pages} · {result.total} total
          </span>
          <div className="flex gap-2">
            <Btn size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Btn>
            <Btn size="sm" disabled={page >= result.pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
