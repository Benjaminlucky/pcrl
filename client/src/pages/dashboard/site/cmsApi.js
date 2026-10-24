// Staff-side API client for the website CMS (/api/cms/*).
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
    return new ApiError("Your session has expired. Please log in again.", status, data);
  }
  if (status === 403) {
    return new ApiError(data?.message || "Your role doesn't allow this action.", status, data);
  }
  return new ApiError(data?.message || `Request failed (${status}).`, status, data);
}

export async function cmsRequest(method, path, body) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/cms${path}`, {
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

// Staff roles: editor < publisher < admin
export function staffPermissions(user) {
  const role = user?.role;
  return {
    isStaff: ["admin", "publisher", "editor"].includes(role),
    canPublish: role === "admin" || role === "publisher",
    canDelete: role === "admin",
  };
}
