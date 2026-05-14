import { useCallback, useEffect, useState } from "react";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getCaracteristicasArbol } from "../../public/services/publicService.js";
import { getMisHabilidades, guardarHabilidad, eliminarHabilidad } from "../services/oferenteService.js";

function aplanar(nodos, prefix = "") {
  let res = [];
  for (const n of nodos) {
    if (n.esHoja) res.push({ id: n.id, nombre: prefix + n.nombre });
    else if (n.hijos) res = res.concat(aplanar(n.hijos, prefix + n.nombre + " / "));
  }
  return res;
}

export function MisHabilidadesPage() {
  const [habilidades, setHabilidades] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [form, setForm] = useState({ caracteristicaId: "", nivel: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargar = useCallback(() => {
    getMisHabilidades()
      .then(setHabilidades)
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getCaracteristicasArbol()
      .then((arbol) => setCaracteristicas(aplanar(arbol)))
      .catch(console.error);
    cargar();
  }, [cargar]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await guardarHabilidad(Number(form.caracteristicaId), Number(form.nivel));
      setSuccess("Habilidad guardada correctamente.");
      setForm({ caracteristicaId: "", nivel: 1 });
      cargar();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar esta habilidad?")) return;
    setError(""); setSuccess("");
    try {
      await eliminarHabilidad(id);
      setSuccess("Habilidad eliminada.");
      cargar();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  }

  return (
    <main className="container">
      <h1>Mis Habilidades</h1>

      <div className="grid-2">
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Agregar / Actualizar habilidad</h2>
          <Alert type="success">{success}</Alert>
          <Alert type="error">{error}</Alert>

          <form className="form-layout" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="caracteristicaId">Característica</label>
              <select
                id="caracteristicaId" name="caracteristicaId"
                value={form.caracteristicaId} onChange={handleChange} required
              >
                <option value="">— Seleccioná —</option>
                {caracteristicas.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="nivel">Nivel (1 = básico, 5 = experto)</label>
              <select id="nivel" name="nivel" value={form.nivel} onChange={handleChange}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={v}>Nivel {v}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-success">Guardar habilidad</button>
          </form>
        </section>

        <section>
          <h2 style={{ marginTop: 0 }}>
            Habilidades registradas{" "}
            <span className="muted" style={{ fontSize: "0.9rem", fontWeight: 400 }}>
              ({habilidades.length})
            </span>
          </h2>

          {loading ? (
            <Loading message="Cargando habilidades…" />
          ) : habilidades.length === 0 ? (
            <p className="empty-state">No tenés habilidades registradas aún.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Habilidad</th>
                    <th>Nivel</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {habilidades.map((h) => (
                    <tr key={h.id}>
                      <td>{h.rutaCompleta}</td>
                      <td>{"⭐".repeat(h.nivel)} ({h.nivel}/5)</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminar(h.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
