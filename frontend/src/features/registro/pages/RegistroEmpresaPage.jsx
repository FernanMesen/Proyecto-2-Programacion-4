import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../../../shared/components/Alert.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { registrarEmpresa } from "../services/registroService.js";

export function RegistroEmpresaPage() {
  const [form, setForm] = useState({
    correo: "", clave: "", nombre: "", localizacion: "", telefono: "", descripcion: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registrarEmpresa(form);
      navigate("/login?registro=true");
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 580 }}>
      <section className="card">
        <h1>🏢 Registro de Empresa</h1>

        <Alert type="error">{error}</Alert>

        <form className="form-layout" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="correo">Correo electrónico *</label>
              <input id="correo" type="email" name="correo" value={form.correo} onChange={handleChange} required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="clave">Contraseña * (mín. 6 caracteres)</label>
              <input id="clave" type="password" name="clave" value={form.clave} onChange={handleChange} required minLength={6} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="nombre">Nombre de la empresa *</label>
            <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="localizacion">Localización</label>
              <input id="localizacion" name="localizacion" value={form.localizacion} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="telefono">Teléfono</label>
              <input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registrando…" : "Registrarse"}
          </button>
        </form>

        <hr style={{ margin: "1.25rem 0", border: "none", borderTop: "1px solid #dbe3ee" }} />
        <p className="muted" style={{ fontSize: "0.9rem" }}>
          ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
}
