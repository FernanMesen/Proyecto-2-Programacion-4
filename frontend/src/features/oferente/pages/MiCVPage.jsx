import { useEffect, useState } from "react";
import { Alert } from "../../../shared/components/Alert.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getPerfilOferente, subirCV } from "../services/oferenteService.js";

export function MiCVPage() {
  const [perfil, setPerfil] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargarPerfil = () => getPerfilOferente().then(setPerfil).catch(console.error);

  useEffect(() => { cargarPerfil(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!archivo) return;
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("archivo", archivo);
      await subirCV(form);
      setSuccess("CV subido exitosamente.");
      setArchivo(null);
      e.target.reset();
      cargarPerfil();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 520 }}>
      <h1>📄 Mi CV</h1>

      <section className="card">
        <Alert type="success">{success}</Alert>
        <Alert type="error">{error}</Alert>

        {perfil?.cvPath && (
          <div style={{ marginBottom: "1rem" }}>
            <Alert type="info">
              Tenés un CV cargado.{" "}
              <a
                href={`/api/cv/${perfil.cvPath}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 700 }}
              >
                Ver CV actual (PDF)
              </a>
            </Alert>
          </div>
        )}

        <form className="form-layout" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="archivo">
              {perfil?.cvPath ? "Reemplazar CV" : "Subir CV"} (PDF, máx. 5 MB)
            </label>
            <input
              id="archivo"
              type="file"
              accept="application/pdf"
              onChange={(e) => setArchivo(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Subiendo…" : "⬆️ Subir CV"}
          </button>
        </form>
      </section>
    </main>
  );
}
