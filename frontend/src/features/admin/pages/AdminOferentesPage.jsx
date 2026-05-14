import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { formatFecha } from "../../../shared/utils/formatters.js";
import { getOferentesPendientes, aprobarOferente } from "../services/adminService.js";

export function AdminOferentesPage() {
    const [oferentes, setOferentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const cargar = useCallback(() => {
        setLoading(true);
        getOferentesPendientes()
            .then(setOferentes)
            .catch((err) => setError(getFriendlyErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    async function handleAprobar(oferente) {
        setError(""); setSuccess("");
        try {
            await aprobarOferente(oferente.id);
            setSuccess(`Oferente "${oferente.nombre}" aprobado correctamente.`);
            cargar();
        } catch (err) {
            setError(getFriendlyErrorMessage(err));
        }
    }

    return (
        <main className="container">
            <p><Link to="/admin/dashboard" className="btn btn-secondary btn-sm">← Volver al panel</Link></p>
            <h1>👤 Oferentes pendientes de aprobación</h1>

            <Alert type="success">{success}</Alert>
            <Alert type="error">{error}</Alert>

            {loading ? (
                <Loading message="Cargando oferentes…" />
            ) : oferentes.length === 0 ? (
                <p className="empty-state">No hay oferentes pendientes de aprobación.</p>
            ) : (
                <section className="card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Identificación</th>
                                <th>Nacionalidad</th>
                                <th>Registrado</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {oferentes.map((o) => (
                                <tr key={o.id}>
                                    <td><strong>{o.nombre}</strong></td>
                                    <td>{o.correo}</td>
                                    <td>{o.identificacion}</td>
                                    <td>{o.nacionalidad || <span className="muted">—</span>}</td>
                                    <td>{formatFecha(o.fechaRegistro)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleAprobar(o)}
                                        >
                                            Aprobar
                                        </button>
                                    </td>
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