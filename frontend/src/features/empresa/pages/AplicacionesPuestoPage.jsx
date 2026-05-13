import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { formatFecha } from "../../../shared/utils/formatters.js";
import { getAplicacionesPuesto, getMisPuestos } from "../services/empresaService.js";

export function AplicacionesPuestoPage() {
  const { id } = useParams();
  const [aplicaciones, setAplicaciones] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAplicacionesPuesto(id), getMisPuestos()])
      .then(([apps, puestos]) => {
        setAplicaciones(apps);
        const p = puestos.find((x) => String(x.id) === String(id));
        if (p) setTitulo(p.descripcion);
      })
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="container">
      <p>
        <Link to="/empresa/puestos" style={{ color: "#4771a3", fontSize: "0.9rem" }}>
          ← Volver a mis puestos
        </Link>
      </p>

      <header className="page-header">
        <div>
          <h1>📩 Aplicaciones recibidas</h1>
          {titulo && <p className="muted">Puesto: {titulo}</p>}
        </div>
      </header>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <Loading message="Cargando aplicaciones…" />
      ) : aplicaciones.length === 0 ? (
        <p className="empty-state">Este puesto no ha recibido aplicaciones aún.</p>
      ) : (
        <section className="card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Tipo</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {aplicaciones.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombre}</td>
                    <td>{a.correo}</td>
                    <td>
                      <span className={`badge ${a.esOferente ? "badge-info" : "badge-inactivo"}`}>
                        {a.esOferente ? "Oferente" : "Invitado"}
                      </span>
                    </td>
                    <td>{a.mensaje || <span className="muted">—</span>}</td>
                    <td>{formatFecha(a.fechaAplicacion)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
