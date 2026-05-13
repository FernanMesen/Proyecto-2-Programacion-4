const TOKEN_KEY = "bolsa-empleo-token";
const STORAGE_MODE_KEY = "bolsa-empleo-storage-mode";

export function saveToken(token, rememberMe) {
  const preferred = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;
  preferred.setItem(TOKEN_KEY, token);
  other.removeItem(TOKEN_KEY);
  localStorage.setItem(STORAGE_MODE_KEY, rememberMe ? "local" : "session");
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STORAGE_MODE_KEY);
}
