import { useEffect, useState } from "react";
import { Alert } from "../../../shared/components/Alert.jsx";
import { ArbolCaracteristicas } from "../../../shared/components/ArbolCaracteristicas.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getCaracteristicasArbol } from "../../public/services/publicService.js";
import { crearPuesto } from "../services/empresaService.js";

export function NuevoPuestoPage() {
  const [form, setForm] = useState({ descripcion: "", salario: "", tipo: "PUBLICO" });
  const [arbol, setArbol] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCaracteristicasArbol().then(setArbol).catch(console.error);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const caracteristicas = Object.entries(seleccionadas).map(([id, v]) => ({
        caracteristicaId: Number(id),
        nivelMinimo: v.nivel,
      }));
      await crearPuesto({
        descripcion: form.descripcion,
        salario: form.salario || null,
        tipo: form.tipo,
        caracteristicas,
      });
      setSuccess("¡Puesto publicado exitosamente!");
      setForm({ descripcion: "", salario: "", tipo: "PUBLICO" });
      setSeleccionadas({});
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>➕ Publicar Nuevo Puesto</h1>

      <div className="grid-2">
        <section className="card">
          <Alert type="success">{success}</Alert>
          <Alert type="error">{error}</Alert>

          <form className="form-layout" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="descripcion">Descripción del puesto *</label>
              <textarea
                id="descripcion" name="descripcion"
                value={form.descripcion} onChange={handleChange} required
                placeholder="Ej: Desarrollador Full Stack con experiencia en React y Spring…"
              />
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="salario">Salario (₡)</label>
                <input
                  id="salario" name="salario" type="number" min={0}
                  value={form.salario} onChange={handleChange}
                  placeholder="Ej: 800000"
                />
              </div>
              <div className="field">
                <label htmlFor="tipo">Tipo de publicación</label>
                <select id="tipo" name="tipo" value={form.tipo} onChange={handleChange}>
                  <option value="PUBLICO">Público</option>
                  <option value="PRIVADO">Privado (solo oferentes registrados)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Publicando…" : "📤 Publicar Puesto"}
            </button>
          </form>
        </section>

        <aside className="card">
          <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Características requeridas</h2>
          <p className="muted" style={{ fontSize: "0.85rem" }}>
            Seleccioná las habilidades requeridas y el nivel mínimo esperado (1 = básico, 5 = experto).
          </p>
          <ArbolCaracteristicas
            nodos={arbol}
            seleccionadas={seleccionadas}
            onToggle={toggleCarac}
            onNivel={setNivel}
            modoSeleccion={true}
          />
        </aside>
      </div>
    </main>
  );
}
