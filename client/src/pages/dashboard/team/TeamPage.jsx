// Dashboard page: /dashboard/team — staff accounts and their roles.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaUserPlus, FaEdit, FaKey, FaTrash, FaCopy } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { can } from "../../../context/permissions";
import { adminRequest } from "../site/cmsApi";
import { timeAgo } from "../site/format";
import { Alert, Badge, Btn, Field, IconBtn, Loading, Modal, PageHeader, Panel, Select, TextInput, Toggle } from "../site/ui";

const fullName = (s) => [s.firstName, s.lastName].filter(Boolean).join(" ");

export default function TeamPage() {
  const { user } = useAuth();
  const canManage = can(user, "staff.manage");
  const [staff, setStaff] = useState(null);
  const [roles, setRoles] = useState([]);
  const [allPerms, setAllPerms] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null); // { text, link? }
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const [s, r, p] = await Promise.all([
        adminRequest("GET", "/staff"),
        adminRequest("GET", "/roles"),
        adminRequest("GET", "/permissions"),
      ]);
      setStaff(s.staff);
      setRoles(r.roles);
      setAllPerms(p.all);
    } catch (e) {
      setError(e.message);
      setStaff([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Roles this user may hand out: never more access than their own
  // (the server enforces the same rule).
  const grantable = useMemo(
    () =>
      roles.filter((r) =>
        (r.permissions.includes("*") ? allPerms : r.permissions).every((p) => can(user, p)),
      ),
    [roles, allPerms, user],
  );

  const act = async (fn) => {
    setError("");
    setNotice(null);
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    }
  };

  const resetPassword = (member) =>
    act(async () => {
      if (!window.confirm(`Email ${member.email} a link to set a new password?`)) return;
      const res = await adminRequest("POST", `/staff/${member.id}/password`, {});
      setNotice({ text: res.message, link: res.link });
    });

  const remove = (member) =>
    act(async () => {
      if (!window.confirm(`Remove ${member.email} from the team? They will lose access immediately.`)) return;
      await adminRequest("DELETE", `/staff/${member.id}`);
      setNotice({ text: "Team member removed." });
      load();
    });

  if (!staff) return <Loading />;

  return (
    <div className="pb-16 space-y-5">
      <PageHeader
        title="Team"
        subtitle="Everyone who can sign in to this dashboard, and what their role lets them do."
        actions={
          canManage && (
            <Btn variant="primary" onClick={() => setAdding(true)}>
              <FaUserPlus /> Add team member
            </Btn>
          )
        }
      />

      {error && <Alert>{error}</Alert>}
      {notice && (
        <Alert color="blue">
          {notice.text}
          {notice.link && <CopyLink link={notice.link} />}
        </Alert>
      )}

      <Panel className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-white/10">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Last sign-in</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {staff.map((m) => {
              const isMe = String(m.id) === String(user?.id);
              return (
                <tr key={m.id} className={m.isActive ? "" : "opacity-60"}>
                  <td className="px-4 py-3">
                    <span className="block text-gray-100 font-medium">
                      {fullName(m) || m.email}
                      {isMe && <span className="text-xs text-gray-500 font-normal"> (you)</span>}
                    </span>
                    {fullName(m) && <span className="block text-xs text-gray-500">{m.email}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={m.role === "admin" ? "red" : "blue"}>{m.roleName}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {!m.isActive ? (
                      <Badge>Deactivated</Badge>
                    ) : m.invitePending ? (
                      <Badge color="amber">Invite pending</Badge>
                    ) : (
                      <Badge color="green">Active</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {m.lastLoginAt ? timeAgo(m.lastLoginAt) : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    {canManage && (
                      <div className="flex justify-end gap-0.5">
                        <IconBtn title="Edit" onClick={() => setEditing(m)}>
                          <FaEdit className="text-xs" />
                        </IconBtn>
                        <IconBtn
                          title={m.lastLoginAt ? "Send password reset" : "Re-send invitation"}
                          onClick={() => resetPassword(m)}
                        >
                          <FaKey className="text-xs" />
                        </IconBtn>
                        {!isMe && (
                          <IconBtn title="Remove" className="hover:!text-red-300" onClick={() => remove(m)}>
                            <FaTrash className="text-xs" />
                          </IconBtn>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <AddMemberModal
        open={adding}
        roles={grantable}
        onClose={() => setAdding(false)}
        onDone={(res) => {
          setAdding(false);
          setNotice({ text: res.message, link: res.inviteUrl });
          load();
        }}
      />
      <EditMemberModal
        member={editing}
        roles={grantable}
        isMe={editing && String(editing.id) === String(user?.id)}
        onClose={() => setEditing(null)}
        onDone={(msg) => {
          setEditing(null);
          setNotice({ text: msg });
          load();
        }}
      />
    </div>
  );
}

function CopyLink({ link }) {
  const [copied, setCopied] = useState(false);
  return (
    <span className="mt-2 flex gap-2 items-center">
      <TextInput readOnly value={link} onFocus={(e) => e.target.select()} className="!text-xs" />
      <Btn
        size="sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
          } catch {
            /* select + copy manually */
          }
        }}
      >
        <FaCopy /> {copied ? "Copied" : "Copy"}
      </Btn>
    </span>
  );
}

function AddMemberModal({ open, roles, onClose, onDone }) {
  const empty = { email: "", firstName: "", lastName: "", role: "", password: "" };
  const [form, setForm] = useState(empty);
  const [mode, setMode] = useState("invite");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ ...empty, role: roles.find((r) => r.key === "editor")?.key || roles[0]?.key || "" });
      setMode("invite");
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      const body = { email: form.email, firstName: form.firstName, lastName: form.lastName, role: form.role };
      if (mode === "password") body.password = form.password;
      onDone(await adminRequest("POST", "/staff", body));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const valid = /\S+@\S+\.\S+/.test(form.email) && form.role && (mode === "invite" || form.password.length >= 8);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add team member"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" disabled={!valid || busy} onClick={submit}>
            {busy ? "Adding…" : mode === "invite" ? "Send invitation" : "Add member"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Email">
          <TextInput type="email" autoFocus value={form.email} onChange={set("email")} placeholder="name@pcrginitiative.com" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name">
            <TextInput value={form.firstName} onChange={set("firstName")} />
          </Field>
          <Field label="Last name">
            <TextInput value={form.lastName} onChange={set("lastName")} />
          </Field>
        </div>
        <Field label="Role" hint={roles.find((r) => r.key === form.role)?.description}>
          <Select options={roles.map((r) => ({ value: r.key, label: r.name }))} value={form.role} onChange={set("role")} />
        </Field>
        <Field label="How will they sign in?">
          <Select
            options={[
              { value: "invite", label: "Email them an invitation to set their own password" },
              { value: "password", label: "Set a password now and share it with them" },
            ]}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          />
        </Field>
        {mode === "password" && (
          <Field label="Password" hint="At least 8 characters. Ask them to change it after signing in.">
            <TextInput type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
          </Field>
        )}
        {error && <Alert>{error}</Alert>}
      </div>
    </Modal>
  );
}

function EditMemberModal({ member, roles, isMe, onClose, onDone }) {
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (member) {
      setForm({ firstName: member.firstName, lastName: member.lastName, role: member.role, isActive: member.isActive });
      setError("");
    }
  }, [member]);

  if (!member || !form) return null;

  // Show the member's current role even if this user couldn't grant it.
  const options = roles.some((r) => r.key === member.role)
    ? roles
    : [{ key: member.role, name: member.roleName }, ...roles];

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const body = {};
      if (form.firstName !== member.firstName) body.firstName = form.firstName;
      if (form.lastName !== member.lastName) body.lastName = form.lastName;
      if (form.role !== member.role) body.role = form.role;
      if (form.isActive !== member.isActive) body.isActive = form.isActive;
      if (!Object.keys(body).length) return onClose();
      const res = await adminRequest("PUT", `/staff/${member.id}`, body);
      onDone(res.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit ${member.email}`}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" disabled={busy} onClick={save}>
            {busy ? "Saving…" : "Save"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name">
            <TextInput value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </Field>
          <Field label="Last name">
            <TextInput value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </Field>
        </div>
        <Field label="Role" hint={isMe ? "You can't change your own role." : options.find((r) => r.key === form.role)?.description}>
          <Select
            disabled={isMe}
            options={options.map((r) => ({ value: r.key, label: r.name }))}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </Field>
        <Field
          label="Access"
          hint={
            isMe
              ? "You can't deactivate your own account."
              : "Deactivated members can't sign in; anyone signed in is logged out on their next action."
          }
        >
          {isMe ? (
            <Badge color="green">Active</Badge>
          ) : (
            <Toggle
              checked={form.isActive}
              onChange={(v) => setForm({ ...form, isActive: v })}
              label={form.isActive ? "Active" : "Deactivated"}
            />
          )}
        </Field>
        {error && <Alert>{error}</Alert>}
      </div>
    </Modal>
  );
}
