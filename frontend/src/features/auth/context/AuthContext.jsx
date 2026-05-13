import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "../services/authService.js";
import { clearStoredToken, getStoredToken, saveToken } from "../utils/storage.js";
import { getRolesFromToken, getUsernameFromToken, isTokenExpired } from "../utils/jwtUtils.js";

const AuthContext = createContext(null);

function buildAuthState(token) {
  if (!token || isTokenExpired(token)) {
    return { token: null, username: null, roles: [], isAuthenticated: false };
  }
  return {
    token,
    username: getUsernameFromToken(token),
    roles: getRolesFromToken(token),
    isAuthenticated: true,
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => buildAuthState(getStoredToken()));

  useEffect(() => {
    if (!authState.token) clearStoredToken();
  }, [authState.token]);

  const login = useCallback(async ({ correo, clave, rememberMe }) => {
    const response = await loginRequest({ correo, clave });
    saveToken(response.token, rememberMe);
    setAuthState(buildAuthState(response.token));
    return response;
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setAuthState(buildAuthState(null));
  }, []);

  const hasRole = useCallback(
    (role) => authState.roles.includes(role),
    [authState.roles]
  );

  const isAdmin    = useMemo(() => hasRole("ROLE_ADMIN"),    [hasRole]);
  const isEmpresa  = useMemo(() => hasRole("ROLE_EMPRESA"),  [hasRole]);
  const isOferente = useMemo(() => hasRole("ROLE_OFERENTE"), [hasRole]);

  const value = useMemo(
    () => ({ ...authState, login, logout, hasRole, isAdmin, isEmpresa, isOferente }),
    [authState, login, logout, hasRole, isAdmin, isEmpresa, isOferente]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
