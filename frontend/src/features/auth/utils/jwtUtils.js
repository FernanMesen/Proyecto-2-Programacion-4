function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
  } catch {
    return atob(padded);
  }
}

export function decodeJwt(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(decodeBase64Url(parts[1]));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 <= Date.now();
}

export function getRolesFromToken(token) {
  const payload = decodeJwt(token);
  return Array.isArray(payload?.roles) ? payload.roles : [];
}

export function getUsernameFromToken(token) {
  const payload = decodeJwt(token);
  return payload?.sub ?? null;
}
