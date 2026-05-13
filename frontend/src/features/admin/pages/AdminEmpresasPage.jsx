import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { formatFecha } from "../../../shared/utils/formatters.js";
import { getEmpresasPendientes, aprobarEmpresa } from "../services/adminService.js";

export function AdminEmpresasPage() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const cargar = useCallback(() => {
        setLoading(true);
        getEmpresasPendientes()
            .then(setEmpresas)
            .catch((err) => setError(getFriendlyErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    async function handleAprobar(empresa) {
        setError(""); setSuccess("");
        try {
            await aprobarEmpresa(empresa.id);
            setSuccess(`Empresa "${empresa.nombre}" aprobada correctamente.`);
            cargar();
        } catch (err) {
            setError(getFriendlyErrorMessage(err));
        }
    }

    return (
        <main className="container">
            <p><Link to="/admin/dashboard" className="btn btn-secondary btn-sm">← Volver al panel</Link></p>
            <h1>🏢 Empresas pendientes de aprobación</h1>

            <Alert type="success">{success}</Alert>
            <Alert type="error">{error}</Alert>

            {loading ? (
                <Loading message="Cargando empresas…" />
            ) : empresas.length === 0 ? (
                <p className="empty-state">No hay empresas pendientes de aprobación.</p>
            ) : (
                <section className="card">
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Localización</th>
                                <th>Teléfono</th>
                                <th>Registrada</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {empresas.map((e) => (
                                <tr key={e.id}>
                                    <td><strong>{e.nombre}</strong></td>
                                    <td>{e.correo}</td>
                                    <td>{e.localizacion || <span className="muted">—</span>}</td>
                                    <td>{e.telefono || <span className="muted">—</span>}</td>
                                    <td>{formatFecha(e.fechaRegistro)}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleAprobar(e)}
                                        >
                                            ✅ Aprobar
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