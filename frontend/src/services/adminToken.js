
const ADMIN_TOKEN_KEY = "stylerent.admin.token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || window.sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function saveAdminToken(token, remember) {
  clearAdminToken();
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(ADMIN_TOKEN_KEY, token);
}
