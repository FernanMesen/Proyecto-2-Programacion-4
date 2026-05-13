import { useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Alert } from "../../../shared/components/Alert.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";

export function LoginPage() {
  const [form, setForm] = useState({ correo: "", clave: "", rememberMe: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin, isEmpresa, isOferente } = useAuth();

  function getDefaultPath() {
    if (isAdmin) return "/admin/dashboard";
    if (isEmpresa) return "/empresa/dashboard";
    if (isOferente) return "/oferente/dashboard";
    return "/";
  }

  const from = location.state?.from?.pathname || getDefaultPath();

  if (isAuthenticated) return <Navigate to={getDefaultPath()} replace />;

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(form);
      // Redirect based on role
      const dest =
        result.rol === "ADMIN"    ? "/admin/dashboard" :
        result.rol === "EMPRESA"  ? "/empresa/dashboard" :
        result.rol === "OFERENTE" ? "/oferente/dashboard" : "/";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container auth-container">
      <section className="card auth-card">
        <h1>Iniciar sesión</h1>

        {searchParams.get("logout")  && <Alert type="success">Sesión cerrada correctamente.</Alert>}
        {searchParams.get("expired") && <Alert type="error">Tu sesión expiró. Iniciá sesión nuevamente.</Alert>}
        {searchParams.get("registro") && <Alert type="success">Registro exitoso. Esperá la aprobación del administrador.</Alert>}
        <Alert type="error">{error}</Alert>

        <form className="form-layout" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo" type="email" name="correo"
              value={form.correo} onChange={handleChange}
              required autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="clave">Contraseña</label>
            <input
              id="clave" type="password" name="clave"
              value={form.clave} onChange={handleChange}
              required autoComplete="current-password"
            />
          </div>

          <label className="check">
            <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange} />
            <span>Recordarme</span>
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <hr />
        <p className="muted" style={{ fontSize: "0.9rem" }}>
          ¿No tenés cuenta?{" "}
          <a href="/registro/empresa">Registrar empresa</a> /{" "}
          <a href="/registro/oferente">Registrar oferente</a>
        </p>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          Admin inicial: <strong>admin@bolsaempleo.local</strong> / <strong>admin123</strong>
        </p>
      </section>
    </main>
  );
}
