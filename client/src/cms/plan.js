// src/cms/plan.js
// Decides which sections a page renders, in what order: the CMS order when
// published, plus any built-in sections the CMS doesn't list yet.
export function buildPlan(builtIn, cmsSections) {
  if (!Array.isArray(cmsSections) || cmsSections.length === 0) {
    return builtIn.map((b) => ({ ...b, visible: true, content: null, style: null }));
  }
  const plan = cmsSections.map((sec) => ({ ...sec }));
  const ids = new Set(plan.map((p) => p.id));
  // Re-insert built-in sections the CMS doesn't know about, right after
  // their built-in predecessor.
  builtIn.forEach((b, i) => {
    if (ids.has(b.id)) return;
    const prevId = builtIn[i - 1]?.id;
    const at = prevId ? plan.findIndex((p) => p.id === prevId) + 1 : 0;
    plan.splice(at, 0, { ...b, visible: true, content: null, style: null });
    ids.add(b.id);
  });
  return plan
    .filter((p) => p.visible !== false)
    .map((p) => {
      const meta =
        builtIn.find((b) => b.id === p.id && b.type === p.type) ||
        builtIn.find((b) => b.type === p.type);
      return { ...p, className: meta?.className, wrapperId: meta?.id === p.id ? meta?.wrapperId : undefined };
    });
}
