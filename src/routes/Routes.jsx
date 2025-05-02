import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "../pages/Home";
import AnimalesP from "../pages/Animales";
import Adopciones from "../pages/Adopciones";
import SobreNosotros from "../pages/SobreNosotros";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Páginas de administrador
import Dashboard from "../pages/admin/Dashboard";
import Animales from "../pages/admin/AnimalesAdmin";
import NuevoAnimal from "../pages/admin/NuevoAnimal";
import AdopcionesAdmin from "../pages/admin/AdopcionesAdmin";
import NuevaSolicitudForm from "../pages/admin/NuevaSolicitudForm";
import VoluntariosAdmin from "../pages/admin/VoluntarioAdmin";
import HorariosVoluntarios from "../pages/admin/HorariosVoluntarios";
import NuevoVoluntario from "../pages/admin/NuevoVoluntario";
import ReportesAdmin from "../pages/admin/ReportesAdmin";

// Páginas de voluntarios
import Tarea from "../pages/voluntarios/Tarea";
import ReportesV from "../pages/voluntarios/ReportesV";

// Páginas de adoptantes
import DashboardA from "../pages/adoptantes/DashboardA";
import AnimalesA from "../pages/adoptantes/AnimalesA";
import SolicitudAdopcion from "../pages/adoptantes/SolicitudAdopcion";
import DetallesA from "../pages/adoptantes/DetallesA";
import MisSolicitudes from "../pages/adoptantes/MisSolicitudes";
import DetalleSolicitud from "../pages/adoptantes/DetalleSolicitud";
import Detalles from "../pages/Detalles";
import EditarAdmin from "../pages/admin/EditarAdmin";
import TareasAdmin from "../pages/admin/TareasAdmin";
import NuevaTarea from "../pages/admin/NuevaTarea";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/animales" element={<AnimalesP />} />
        <Route path="/animales/detalle/:id" element={<Detalles />} />
        <Route path="/adopciones" element={<Adopciones />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas de administrador */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/animales" element={<Animales />} />
        <Route path="/admin/animales/nuevo" element={<NuevoAnimal />} />
        <Route path="/admin/adopciones" element={<AdopcionesAdmin />} />
        <Route path="/admin/adopciones/editar/:id" element={<EditarAdmin />} />
        <Route path="/admin/adopciones/nueva" element={<NuevaSolicitudForm />} />
        <Route path="/admin/tareas" element={<TareasAdmin />} />
        <Route path="/admin/tareas/nueva" element={<NuevaTarea />} />
        <Route path="/admin/voluntarios" element={<VoluntariosAdmin />} />
        <Route path="/admin/voluntarios/nuevo" element={<NuevoVoluntario />} />
        <Route path="/admin/horarios" element={<HorariosVoluntarios />} />
        <Route path="/admin/reportes" element={<ReportesAdmin />} />

        {/* Rutas de voluntarios */}
        <Route path="/voluntario" element={<Tarea />} />
        <Route path="/voluntario/reportes" element={<ReportesV />} />

        {/* Rutas de adoptantes */}
        <Route path="/adoptante" element={<AnimalesA />} />
        <Route path="/adoptante/animales" element={<AnimalesA />} />
        <Route path="/adoptante/solicitud" element={<SolicitudAdopcion />} />
        <Route path="/adoptante/animales/detalle" element={<DetallesA />} />
        <Route path="/adoptante/mis-solicitudes" element={<MisSolicitudes />} />
        <Route path="/adoptante/mis-solicitudes/detalle" element={<DetalleSolicitud />} />

        {/* Ruta 404 */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;