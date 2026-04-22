const rawBase = import.meta.env.VITE_API_URL || "";
const base = typeof rawBase === "string" ? rawBase.replace(/\/$/, "") : "";

function url(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

async function request(path, options = {}) {
  const res = await fetch(url(path), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || res.statusText || "Request failed");
  }
  return data;
}

export function getChallenge() {
  return request("/api/auth/challenge");
}

export function postVerify(body) {
  return request("/api/auth/verify", { method: "POST", body: JSON.stringify(body) });
}

export function postName(name) {
  return request("/api/session/name", { method: "POST", body: JSON.stringify({ name }) });
}

export function getProgress() {
  return request("/api/progress");
}

export function getAdminProgress() {
  return request("/api/admin/progress");
}

export function getLevels() {
  return request("/api/levels");
}

export function getProblems(level) {
  return request(`/api/problems?level=${encodeURIComponent(level)}`);
}

export function getProblemById(id) {
  return request(`/api/problems/${encodeURIComponent(id)}`);
}

export function postSubmission(body) {
  return request("/api/submissions", { method: "POST", body: JSON.stringify(body) });
}
