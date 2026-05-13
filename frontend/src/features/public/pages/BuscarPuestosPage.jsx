import { useCallback, useEffect, useState } from "react";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { ArbolCaracteristicas } from "../../../shared/components/ArbolCaracteristicas.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { buscarPuestos, getCaracteristicasArbol } from "../services/publicService.js";
import { PuestoCard } from "../components/PuestoCard.jsx";

export function BuscarPuestosPage() {
  const [arbol, setArbol] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState({});
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);

  useEffect(() => {
    getCaracteristicasArbol().then(setArbol).catch(console.error);
    // Cargar todos los puestos al inicio
    setLoading(true);
    buscarPuestos()
      .then((data) => { setResultados(data); setBuscado(true); })
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  function toggleCarac(id) {
    setSeleccionadas((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = { nivel: 1 };
      return next;
    });
  }

  function setNivel(id, nivel) {
    setSeleccionadas((prev) => ({ ...prev, [id]: { nivel } }));
  }

  async function handleBuscar(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ids = Object.keys(seleccionadas).map(Number);
      const data = await buscarPuestos(ids);
      setResultados(data);
      setBuscado(true);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>Buscar Puestos</h1>

      <div className="grid-sidebar">
        {/* Panel de filtros */}
        <aside>
          <form className="card" onSubmit={handleBuscar}>
            <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Características</h2>
            <ArbolCaracteristicas
              nodos={arbol}
              seleccionadas={seleccionadas}
              onToggle={toggleCarac}
              onNivel={setNivel}
              modoSeleccion={true}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "1rem", width: "100%" }}
              disabled={loading}
            >
              {loading ? "Buscando…" : "Buscar"}
            </button>
          </form>
        </aside>

        {/* Resultados */}
        <section>
          <header className="page-header">
            <h2 style={{ margin: 0 }}>
              Resultados{" "}
              {buscado && (
                <span className="muted" style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                  ({resultados.length} encontrados)
                </span>
              )}
            </h2>
          </header>

          <Alert type="error">{error}</Alert>

          {loading ? (
            <Loading message="Buscando puestos…" />
          ) : (
            <>
              {buscado && resultados.length === 0 && (
                <p className="empty-state">No se encontraron puestos con esos criterios.</p>
              )}
              <div className="puestos-grid">
                {resultados.map((p) => (
                  <PuestoCard key={p.id} puesto={p} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
