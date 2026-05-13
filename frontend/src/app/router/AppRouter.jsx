import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../features/auth/context/AuthContext.jsx";
import { MainLayout } from "../../shared/layout/MainLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

import { LoginPage } from "../../features/auth/pages/LoginPage.jsx";
import { AccessDeniedPage } from "../../features/auth/pages/AccessDeniedPage.jsx";

import { InicioPage } from "../../features/public/pages/InicioPage.jsx";
import { BuscarPuestosPage } from "../../features/public/pages/BuscarPuestosPage.jsx";
import { DetallePuestoPage } from "../../features/public/pages/DetallePuestoPage.jsx";

import { RegistroEmpresaPage } from "../../features/registro/pages/RegistroEmpresaPage.jsx";
import { RegistroOferentePage } from "../../features/registro/pages/RegistroOferentePage.jsx";

import { EmpresaDashboardPage } from "../../features/empresa/pages/EmpresaDashboardPage.jsx";
import { MisPuestosPage } from "../../features/empresa/pages/MisPuestosPage.jsx";
import { NuevoPuestoPage } from "../../features/empresa/pages/NuevoPuestoPage.jsx";
import { BuscarCandidatosPage } from "../../features/empresa/pages/BuscarCandidatosPage.jsx";
import { AplicacionesPuestoPage } from "../../features/empresa/pages/AplicacionesPuestoPage.jsx";

import { OferenteDashboardPage } from "../../features/oferente/pages/OferenteDashboardPage.jsx";
import { MisHabilidadesPage } from "../../features/oferente/pages/MisHabilidadesPage.jsx";
import { MiCVPage } from "../../features/oferente/pages/MiCVPage.jsx";

import { AdminDashboardPage } from "../../features/admin/pages/AdminDashboardPage.jsx";
import { AdminEmpresasPage } from "../../features/admin/pages/AdminEmpresasPage.jsx";
import { AdminOferentesPage } from "../../features/admin/pages/AdminOferentesPage.jsx";
import { AdminCaracteristicasPage } from "../../features/admin/pages/AdminCaracteristicasPage.jsx";

export function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/access-denied" element={<AccessDeniedPage />} />

                    <Route element={<MainLayout />}>
                        {/* Públicas — acceso libre */}
                        <Route path="/" element={<InicioPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/buscar" element={<BuscarPuestosPage />} />
                        <Route path="/puesto/:id" element={<DetallePuestoPage />} />
                        <Route path="/registro/empresa" element={<RegistroEmpresaPage />} />
                        <Route path="/registro/oferente" element={<RegistroOferentePage />} />

                        <Route element={<ProtectedRoute role="EMPRESA" />}>
                            <Route path="/empresa/dashboard"       element={<EmpresaDashboardPage />} />
                            <Route path="/empresa/puestos"          element={<MisPuestosPage />} />
                            <Route path="/empresa/puestos/nuevo"    element={<NuevoPuestoPage />} />
                            <Route path="/empresa/candidatos"       element={<BuscarCandidatosPage />} />
                            <Route path="/empresa/aplicaciones/:id" element={<AplicacionesPuestoPage />} />
                        </Route>

                        <Route element={<ProtectedRoute role="OFERENTE" />}>
                            <Route path="/oferente/dashboard"   element={<OferenteDashboardPage />} />
                            <Route path="/oferente/habilidades" element={<MisHabilidadesPage />} />
                            <Route path="/oferente/cv"          element={<MiCVPage />} />
                        </Route>

                        <Route element={<ProtectedRoute role="ADMIN" />}>
                            <Route path="/admin/dashboard"       element={<AdminDashboardPage />} />
                            <Route path="/admin/empresas"        element={<AdminEmpresasPage />} />
                            <Route path="/admin/oferentes"       element={<AdminOferentesPage />} />
                            <Route path="/admin/caracteristicas" element={<AdminCaracteristicasPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}