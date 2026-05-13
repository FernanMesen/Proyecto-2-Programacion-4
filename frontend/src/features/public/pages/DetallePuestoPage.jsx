import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { formatFecha, formatSalario } from "../../../shared/utils/formatters.js";
import { getDetallePuesto } from "../services/publicService.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";
import { aplicarPuesto } from "../../oferente/services/oferenteService.js";

export function DetallePuestoPage() {
  const { id } = useParams();
  const { isAuthenticated, isOferente } = useAuth();

  const [puesto, setPuesto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [aplicando, setAplicando] = useState(false);
  const [aplicacionExito, setAplicacionExito] = useState("");
  const [aplicacionError, setAplicacionError] = useState("");

  useEffect(() => {
    getDetallePuesto(id)
      .then(setPuesto)
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAplicar(e) {
    e.preventDefault();
    setAplicacionError("");
    setAplicacionExito("");
    setAplicando(true);
    try {
      await aplicarPuesto(id, mensaje);
      setAplicacionExito("¡Aplicación enviada exitosamente!");
      setMensaje("");
    } catch (err) {
      setAplicacionError(getFriendlyErrorMessage(err));
    } finally {
      setAplicando(false);
    }
  }

  if (loading) return <main className="container"><Loading message="Cargando puesto…" /></main>;

  if (error) {
    return (
      <main className="container">
        <Alert type="error">{error}</Alert>
        <Link className="btn btn-secondary" to="/buscar">← Volver</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <p>
        <Link to="/buscar" style={{ color: "#4771a3", fontSize: "0.9rem" }}>
          ← Volver a búsqueda
        </Link>
      </p>

      <div className="grid-2">
        <div>
          <section className="card">
            <h1 style={{ marginTop: 0 }}>{puesto.descripcion}</h1>
            <div className="detail-grid">
              <p><strong>Empresa:</strong> {puesto.empresa?.nombre}</p>
              <p><strong>Ubicación:</strong> {puesto.empresa?.localizacion || "N/D"}</p>
              <p><strong>Salario:</strong> {formatSalario(puesto.salario)}</p>
              <p>
                <strong>Tipo:</strong>{" "}
                <span className={`badge badge-${puesto.tipo?.toLowerCase()}`}>{puesto.tipo}</span>
              </p>
              <p><strong>Publicado:</strong> {formatFecha(puesto.fechaRegistro)}</p>
            </div>
          </section>

          {puesto.caracteristicas?.length > 0 && (
            <section className="card">
              <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Características requeridas</h2>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Habilidad</th>
                      <th>Nivel mínimo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {puesto.caracteristicas.map((c) => (
                      <tr key={c.id}>
                        <td>{c.rutaCompleta}</td>
                        <td>{c.nivelMinimo} / 5</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        <aside>
          <section className="card">
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Aplicar a este puesto</h2>

            <Alert type="success">{aplicacionExito}</Alert>
            <Alert type="error">{aplicacionError}</Alert>

            {isOferente ? (
              <form className="form-layout" onSubmit={handleAplicar}>
                <div className="field">
                  <label htmlFor="mensaje">Mensaje (opcional)</label>
                  <textarea
                    id="mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Presentate brevemente o dejá un comentario…"
                  />
                </div>
                <button type="submit" className="btn btn-success" disabled={aplicando}>
                  {aplicando ? "Enviando…" : "📤 Enviar aplicación"}
                </button>
              </form>
            ) : isAuthenticated ? (
              <Alert type="info">Solo los oferentes pueden aplicar a puestos.</Alert>
            ) : (
              <Alert type="info">
                Debés <Link to="/login">iniciar sesión</Link> como oferente para aplicar.
              </Alert>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
