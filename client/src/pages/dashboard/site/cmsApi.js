// Staff-side API client (/api/cms/* and /api/admin/*).
import { can, isStaff } from "../../../context/permissions";

export const API_BASE = (
  import.meta.env.VITE_CMS_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ""
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body || {};
  }
}

const token = () => localStorage.getItem("token");

function errorFrom(status, data) {
  if (status === 401) {
    const msg = /deactivated/i.test(data?.message || "")
      ? data.message
      : "Your session has expired. Please log in again.";
    return new ApiError(msg, status, data);
  }
  if (status === 403) {
    return new ApiError(data?.message || "You don't have permission to do this.", status, data);
  }
  return new ApiError(data?.message || `Request failed (${status}).`, status, data);
}

async function apiRequest(prefix, method, path, body) {
  let res;
  try {
    res = await fetch(`${API_BASE}${prefix}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token()}`,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw errorFrom(res.status, data);
  return data;
}

export const cmsRequest = (method, path, body) => apiRequest("/api/cms", method, path, body);
export const adminRequest = (method, path, body) => apiRequest("/api/admin", method, path, body);

// Upload with progress (fetch has no upload progress events).
export function uploadMediaFile(file, { alt = "" } = {}, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", file);
    if (alt) form.append("alt", alt);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/api/cms/media`);
    xhr.setRequestHeader("Authorization", `Bearer ${token()}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* non-JSON error page */
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data.media);
      else reject(errorFrom(xhr.status, data));
    };
    xhr.onerror = () => reject(new ApiError("Upload failed — network error.", 0));
    xhr.send(form);
  });
}

// Website-editor permissions for the signed-in user (see context/permissions).
export function staffPermissions(user) {
  return {
    isStaff: isStaff(user),
    canEdit: can(user, "site.edit"),
    canPublish: can(user, "site.publish"),
    canDelete: can(user, "site.delete"),
  };
}
