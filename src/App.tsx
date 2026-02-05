import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MainLayout } from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import DiagnosticoInicial from "./pages/diagnostico/DiagnosticoInicial";
import MejoraPage from "./pages/mejora/MejoraPage";
import PlanDetailPage from "./pages/mejora/PlanDetailPage";
import RolesPage from "./pages/roles/RolesPage";
import 'leaflet/dist/leaflet.css';



export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnostico" element={<DiagnosticoInicial />} />
          <Route path="/mejora" element={<MejoraPage />} />
          <Route path="/mejora/plan/:planId" element={<PlanDetailPage />} />
          <Route path="/liderazgo/roles" element={<RolesPage />} />
          {/* ...Other routes... */}
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}
