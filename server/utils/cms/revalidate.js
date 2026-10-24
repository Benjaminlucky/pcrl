// utils/cms/revalidate.js
// Notifies the public site to revalidate affected pages after a content change.
// In Sprint 4 the Next.js site exposes an endpoint that accepts { paths } and
// calls revalidatePath() for each. Until that exists, this safely no-ops.

export async function triggerRevalidation(paths = []) {
  const url = process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET || "";

  if (!url) {
    console.log("[revalidate] skipped (REVALIDATE_URL not set). Paths:", paths);
    return { skipped: true };
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ paths }),
    });
    console.log("[revalidate] sent", paths);
    return { ok: true };
  } catch (err) {
    // Never let a revalidation failure break the content operation.
    console.error("[revalidate] failed:", err?.message || err);
    return { ok: false, error: err?.message || String(err) };
  }
}
