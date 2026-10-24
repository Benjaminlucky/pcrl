// Formatting helpers for the CMS screens.
export function timeAgo(date) {
  if (!date) return "";
  const s = Math.round((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(date).toLocaleString();
}
