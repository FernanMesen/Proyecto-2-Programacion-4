import { useEffect, useState } from "react";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getUltimosPuestos } from "../services/publicService.js";
import { PuestoCard } from "../components/PuestoCard.jsx";

export function InicioPage() {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUltimosPuestos()
      .then(setPuestos)
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>Bolsa de Empleo</h1>
          <p className="muted">Últimos 5 puestos públicos disponibles</p>
        </div>
      </header>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <Loading message="Cargando puestos recientes…" />
      ) : (
        <>
          {puestos.length === 0 && !error && (
            <p className="empty-state">No hay puestos públicos registrados aún.</p>
          )}
          <div className="puestos-grid">
            {puestos.map((p) => (
              <PuestoCard key={p.id} puesto={p} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
