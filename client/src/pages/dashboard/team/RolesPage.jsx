// Dashboard page: /dashboard/roles — roles and their permissions.
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus, FaLock, FaTrash, FaSave } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { can } from "../../../context/permissions";
import { adminRequest } from "../site/cmsApi";
import { Alert, Badge, Btn, Field, Loading, Modal, PageHeader, Panel, Select, TextArea, TextInput } from "../site/ui";

const permsOf = (role, all) => (role.permissions.includes("*") ? all : role.permissions);

export default function RolesPage() {
  const { user } = useAuth();
  const canManage = can(user, "roles.manage");
  const [roles, setRoles] = useState(null);
  const [groups, setGroups] = useState([]);
  const [all, setAll] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [draft, setDraft] = useState(null); // { name, description, permissions: Set }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async (keepKey) => {
    setError("");
    try {
      const [r, p] = await Promise.all([adminRequest("GET", "/roles"), adminRequest("GET", "/permissions")]);
      setRoles(r.roles);
      setGroups(p.groups);
      setAll(p.all);
      setSelectedKey((k) => keepKey || k || r.roles[0]?.key || null);
    } catch (e) {
      setError(e.message);
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const role = roles?.find((r) => r.key === selectedKey) || null;

  useEffect(() => {
    if (role) {
      setDraft({ name: role.name, description: role.description, permissions: new Set(permsOf(role, all)) });
    }
  }, [role, all]);

  const dirty = useMemo(() => {
    if (!role || !draft) return false;
    const current = new Set(permsOf(role, all));
    return (
      draft.name !== role.name ||
      draft.description !== role.description ||
      draft.permissions.size !== current.size ||
      [...draft.permissions].some((p) => !current.has(p))
    );
  }, [role, draft, all]);

  const editable = canManage && role && !role.locked;

  const toggle = (perm) =>
    setDraft((d) => {
      const next = new Set(d.permissions);
      if (next.has(perm)) next.delete(perm);
      else next.add(perm);
      return { ...d, permissions: next };
    });

  const toggleGroup = (group, on) =>
    setDraft((d) => {
      const next = new Set(d.permissions);
      group.permissions.forEach((p) => {
        if (!can(user, p.key)) return;
        if (on) next.add(p.key);
        else next.delete(p.key);
      });
      return { ...d, permissions: next };
    });

  const save = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await adminRequest("PUT", `/roles/${role.key}`, {
        name: draft.name,
        description: draft.description,
        permissions: [...draft.permissions],
      });
      setNotice(`"${draft.name}" saved. Members with this role get the new access immediately.`);
      await load(role.key);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the role "${role.name}"?`)) return;
    setBusy(true);
    setError("");
    try {
      await adminRequest("DELETE", `/roles/${role.key}`);
      setNotice("Role deleted.");
      setSelectedKey(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (!roles) return <Loading />;

  return (
    <div className="pb-16 space-y-5">
      <PageHeader
        title="Roles & permissions"
        subtitle="A role is a set of permissions. Give each team member the role that matches their job."
        actions={
          canManage && (
            <Btn variant="primary" onClick={() => setCreating(true)}>
              <FaPlus /> New role
            </Btn>
          )
        }
      />
      {error && <Alert>{error}</Alert>}
      {notice && <Alert color="blue">{notice}</Alert>}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {roles.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => {
                if (dirty && !window.confirm("Discard unsaved changes to this role?")) return;
                setSelectedKey(r.key);
                setNotice("");
              }}
              className={`w-full text-left rounded-lg border px-4 py-3 transition cursor-pointer ${
                r.key === selectedKey ? "border-primary-500 bg-primary-500/10" : "border-white/10 bg-[#121212] hover:border-white/25"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-100">{r.name}</span>
                {r.locked && <FaLock className="text-[10px] text-gray-500" />}
                {r.system && !r.locked && <Badge>Built-in</Badge>}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {r.userCount} member{r.userCount === 1 ? "" : "s"} ·{" "}
                {r.permissions.includes("*") ? "all permissions" : `${r.permissions.length} permissions`}
              </span>
            </button>
          ))}
        </div>

        {role && draft && (
          <Panel className="p-5 sm:p-6 space-y-6 min-w-0">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Role name">
                <TextInput value={draft.name} disabled={!editable} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </Field>
              <Field label="Description">
                <TextInput
                  value={draft.description}
                  disabled={!editable}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </Field>
            </div>

            {role.locked && (
              <Alert color="blue">The {role.name} role always has every permission, including new ones added later. It can't be changed.</Alert>
            )}
            {!canManage && <Alert color="blue">You can view roles but not change them.</Alert>}

            <div className="space-y-5">
              {groups.map((g) => {
                const checked = g.permissions.filter((p) => draft.permissions.has(p.key)).length;
                return (
                  <div key={g.key} className="rounded-lg border border-white/10">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/10">
                      <span className="text-sm font-semibold text-gray-200">{g.label}</span>
                      {editable && (
                        <button
                          type="button"
                          className="text-xs text-gray-400 hover:text-white cursor-pointer"
                          onClick={() => toggleGroup(g, checked < g.permissions.length)}
                        >
                          {checked < g.permissions.length ? "Select all" : "Clear"}
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-white/5">
                      {g.permissions.map((p) => {
                        const grantable = can(user, p.key);
                        return (
                          <label
                            key={p.key}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                              editable && grantable ? "cursor-pointer hover:bg-white/[0.03]" : "cursor-default"
                            }`}
                            title={editable && !grantable ? "You can't grant a permission you don't have." : undefined}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-[#ec1c24]"
                              checked={draft.permissions.has(p.key)}
                              disabled={!editable || !grantable}
                              onChange={() => toggle(p.key)}
                            />
                            <span className="text-gray-200">{p.label}</span>
                            <code className="ml-auto text-[11px] text-gray-600">{p.key}</code>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {editable && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Btn variant="primary" disabled={!dirty || busy || !draft.name.trim()} onClick={save}>
                  <FaSave /> {busy ? "Saving…" : "Save role"}
                </Btn>
                {dirty && (
                  <Btn variant="ghost" onClick={() => setDraft({ name: role.name, description: role.description, permissions: new Set(permsOf(role, all)) })}>
                    Undo changes
                  </Btn>
                )}
                {!role.system && (
                  <Btn variant="danger" className="ml-auto" disabled={busy || role.userCount > 0} onClick={remove} title={role.userCount ? "Move its members to another role first." : undefined}>
                    <FaTrash /> Delete role
                  </Btn>
                )}
              </div>
            )}
          </Panel>
        )}
      </div>

      <NewRoleModal
        open={creating}
        roles={roles}
        all={all}
        user={user}
        onClose={() => setCreating(false)}
        onCreated={async (created) => {
          setCreating(false);
          setNotice(`"${created.name}" created. Tick the permissions it should have, then save.`);
          await load(created.key);
        }}
      />
    </div>
  );
}

function NewRoleModal({ open, roles, all, user, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [copyFrom, setCopyFrom] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setCopyFrom("");
      setError("");
    }
  }, [open]);

  const create = async () => {
    setBusy(true);
    setError("");
    try {
      const source = roles.find((r) => r.key === copyFrom);
      // Only copy permissions this user is allowed to grant.
      const permissions = source ? permsOf(source, all).filter((p) => can(user, p)) : [];
      const res = await adminRequest("POST", "/roles", { name, description, permissions });
      onCreated(res.role);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New role"
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn variant="primary" disabled={!name.trim() || busy} onClick={create}>
            {busy ? "Creating…" : "Create role"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Role name">
          <TextInput autoFocus value={name} placeholder="e.g. Content Writer, Realtor Support" onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Description (optional)">
          <TextArea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Start from">
          <Select
            options={[{ value: "", label: "No permissions" }, ...roles.map((r) => ({ value: r.key, label: `Copy of ${r.name}` }))]}
            value={copyFrom}
            onChange={(e) => setCopyFrom(e.target.value)}
          />
        </Field>
        {error && <Alert>{error}</Alert>}
      </div>
    </Modal>
  );
}
