// Dashboard page: /dashboard/activity — security activity log.
import React, { useCallback, useEffect, useState } from "react";
import { adminRequest } from "../site/cmsApi";
import { timeAgo } from "../site/format";
import { Alert, Badge, Btn, Loading, PageHeader, Panel, Select } from "../site/ui";

const ACTIONS = {
  "staff.login": { label: "Signed in", color: "green" },
  "staff.login_failed": { label: "Failed sign-in", color: "red" },
  "staff.login_blocked": { label: "Blocked sign-in (deactivated)", color: "red" },
  "staff.signup": { label: "First admin account created", color: "blue" },
  "staff.create": { label: "Added team member", color: "blue" },
  "staff.update": { label: "Changed team member", color: "amber" },
  "staff.delete": { label: "Removed team member", color: "red" },
  "staff.password_set": { label: "Set a password", color: "amber" },
  "staff.password_reset_sent": { label: "Sent password reset", color: "gray" },
  "staff.invite_resent": { label: "Re-sent invitation", color: "gray" },
  "role.create": { label: "Created role", color: "blue" },
  "role.update": { label: "Changed role", color: "amber" },
  "role.delete": { label: "Deleted role", color: "red" },
};

const FILTERS = [
  { value: "", label: "All activity" },
  { value: "staff.login", label: "Sign-ins" },
  { value: "staff.", label: "Team changes" },
  { value: "role.", label: "Role changes" },
];

function describe(e) {
  const d = e.details || {};
  if (e.action === "staff.update" && d.changes) {
    const parts = [];
    if (d.changes.role) parts.push(`role ${d.before?.role} → ${d.changes.role}`);
    if (d.changes.isActive !== undefined) parts.push(d.changes.isActive ? "reactivated" : "deactivated");
    if (d.changes.firstName !== undefined || d.changes.lastName !== undefined) parts.push("name");
    return parts.join(", ");
  }
  if (e.action === "staff.create") return `role ${d.role}${d.invited ? (d.inviteSent ? ", invitation emailed" : ", invitation NOT emailed") : ""}`;
  if (e.action === "role.update" && d.before && d.after) {
    const added = d.after.permissions.filter((p) => !d.before.permissions.includes(p));
    const removed = d.before.permissions.filter((p) => !d.after.permissions.includes(p));
    return [added.length && `+ ${added.join(", ")}`, removed.length && `− ${removed.join(", ")}`].filter(Boolean).join("  ");
  }
  return "";
}

export default function ActivityPage() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const qs = new URLSearchParams({ page: String(page), limit: "50" });
      if (filter) qs.set("action", filter);
      setData(await adminRequest("GET", `/audit?${qs}`));
    } catch (e) {
      setError(e.message);
      setData({ entries: [], pages: 1, total: 0 });
    }
  }, [page, filter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="pb-16 space-y-5">
      <PageHeader title="Activity" subtitle="Sign-ins and changes to team members and roles (kept for one year)." />
      <div className="flex items-center gap-2">
        <Select
          className="!w-auto"
          options={FILTERS}
          value={filter}
          onChange={(e) => {
            setPage(1);
            setFilter(e.target.value);
          }}
        />
      </div>
      {error && <Alert>{error}</Alert>}
      {!data ? (
        <Loading />
      ) : data.entries.length === 0 ? (
        <Panel className="p-10 text-center text-sm text-gray-400">No activity yet.</Panel>
      ) : (
        <Panel className="divide-y divide-white/5">
          {data.entries.map((e) => {
            const meta = ACTIONS[e.action] || { label: e.action, color: "gray" };
            const detail = describe(e);
            return (
              <div key={e._id} className="px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <Badge color={meta.color}>{meta.label}</Badge>
                <span className="text-gray-200">{e.target?.label}</span>
                {detail && <span className="text-xs text-gray-500">{detail}</span>}
                <span className="ml-auto text-xs text-gray-500 text-right">
                  {e.actor?.email && e.actor.email !== e.target?.label ? `by ${e.actor.email} · ` : ""}
                  <span title={new Date(e.createdAt).toLocaleString()}>{timeAgo(e.createdAt)}</span>
                  {e.ip ? ` · ${e.ip}` : ""}
                </span>
              </div>
            );
          })}
        </Panel>
      )}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Page {data.page} of {data.pages} · {data.total} entries
          </span>
          <div className="flex gap-2">
            <Btn size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Btn>
            <Btn size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
