import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, FileText, Calendar, Home, PawPrint, User, Mail, Phone, MapPin } from "lucide-react";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Asegúrate de tener tu configuración de Firebase

const AdopcionesAdmin = () => {
  const [activeTab, setActiveTab] = useState("solicitudes");
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de Firestore
  useEffect(() => {
    const fetchAdopciones = async () => {
      try {
        const q = query(collection(db, "solicitudesAdopcion"), orderBy("fechaSolicitud", "desc"));
        const querySnapshot = await getDocs(q);
        const adopcionesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaAdopcion: doc.data().fechaAdopcion?.toDate() || null,
          formulario: {
            ...doc.data().formulario,
            fechaEnvio: doc.data().formulario?.fechaEnvio?.toDate() || null,
            fechaRevision: doc.data().formulario?.fechaRevision?.toDate() || null
          },
          seguimiento: doc.data().seguimiento?.map(seg => ({
            ...seg,
            fecha: seg.fecha?.toDate() || null
          })) || []
        }));
        setAdopciones(adopcionesData);
      } catch (error) {
        console.error("Error fetching adopciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdopciones();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("es-ES");
  };

  const filteredAdopciones = adopciones.filter((adopcion) => {
    const matchesSearch = adopcion.nombreCompleto.toLowerCase().includes(search.toLowerCase());
    const matchesState = filterState === "" || adopcion.estado.toLowerCase() === filterState.toLowerCase();
    return matchesSearch && matchesState;
  });

  // Obtener todos los eventos de historial
  const historialEvents = adopciones.flatMap(adopcion => {
    const events = [];
    
    // Evento de solicitud (formulario enviado)
    if (adopcion.formulario?.fechaEnvio) {
      events.push({
        type: "solicitud",
        fecha: adopcion.formulario.fechaEnvio,
        title: `${adopcion.nombreCompleto} solicitó adoptar a ${adopcion.nombreAnimal}`,
        adopcionId: adopcion.id,
        estado: "pendiente" 
      });
    }
    
    // Evento de aprobación/rechazo
    if (adopcion.formulario?.fechaRevision) {
      events.push({
        type: "revision",
        fecha: adopcion.formulario.fechaRevision,
        title: `Solicitud de ${adopcion.nombreCompleto} fue ${adopcion.estado}`,
        adopcionId: adopcion.id,
        estado: adopcion.formulario.estadoFormulario 
      });
    }
    
    // Evento de adopción
    if (adopcion.fechaAdopcion) {
      events.push({
        type: "adopcion",
        fecha: adopcion.fechaAdopcion,
        title: `${adopcion.nombreCompleto} adoptó a ${adopcion.nombreAnimal}`,
        adopcionId: adopcion.id,
        estado: adopcion.estado
      });
    }
    
    // Eventos de seguimiento
    adopcion.seguimiento.forEach((seg, index) => {
      events.push({
        type: "seguimiento",
        fecha: seg.fecha,
        title: `Seguimiento ${index + 1} para ${adopcion.nombreAnimal}`,
        detalles: seg.tipo,
        adopcionId: adopcion.id,
        estado: adopcion.estado
      });
    });
    
    return events;
  });

  // Ordenar eventos de historial por fecha
  const sortedHistorial = [...historialEvents].sort((a, b) => b.fecha - a.fecha);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isCollapsed={isCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
          <AdminHeader title="Adopciones" toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
          <div className="p-6 bg-gray-100 min-h-screen" style={{ paddingTop: "80px" }}>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        {/* Header */}
        <AdminHeader
          title="Adopciones"
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Content Area */}
        <div className="p-6 bg-gray-100 min-h-screen" style={{ paddingTop: "80px" }}>
          {/* Search and Filter */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Adopciones</h1>
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center">
              <Link to="/admin/adopciones/nueva" className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Nueva Solicitud
              </Link>
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
            />
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
            >
              <option value="">Todos los estados</option>
              <option value="aprobada">Aprobada</option>
              <option value="pendiente">Pendiente</option>
              <option value="rechazada">Rechazada</option>
              <option value="en proceso">En proceso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            {["Solicitudes", "Seguimiento", "Historial"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 -mb-px font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? "border-b-2 border-emerald-600 text-emerald-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "solicitudes" && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Solicitante
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Animal
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Fecha Solicitud
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Estado
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Formulario
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdopciones.map((adopcion) => (
                    <tr key={adopcion.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {adopcion.nombreCompleto}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {adopcion.correoElectronico}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <PawPrint className="h-4 w-4 text-gray-500" />
                          {adopcion.nombreAnimal}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatDate(adopcion.formulario?.fechaEnvio)}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs ${
                            adopcion.estado === "aprobada"
                              ? "bg-green-500"
                              : adopcion.estado === "pendiente"
                              ? "bg-yellow-500"
                              : adopcion.estado === "en proceso"
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                        >
                          {adopcion.estado.charAt(0).toUpperCase() + adopcion.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            adopcion.formulario?.estadoFormulario === "aprobado"
                              ? "bg-green-300 text-green-800"
                              : adopcion.formulario?.estadoFormulario === "pendiente"
                              ? "bg-yellow-300 text-yellow-800"
                              : "bg-gray-300 text-gray-800"
                          }`}
                        >
                          {adopcion.formulario?.estadoFormulario || "No enviado"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex justify-center gap-2">
                          <Link to={`/admin/adopciones/editar/${adopcion.id}`}>
                            <button
                              className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                              title="Editar"
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "seguimiento" && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Animal
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Adoptante
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Tipo
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Comentario
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Estado Animal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adopciones.flatMap(adopcion => 
                    adopcion.seguimiento.map((seg, index) => (
                      <tr key={`${adopcion.id}-${index}`} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            {formatDate(seg.fecha)}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <PawPrint className="h-4 w-4 text-gray-500" />
                            {adopcion.nombreAnimal}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            {adopcion.nombreCompleto}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">{seg.tipo}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{seg.comentario}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {seg.estadoGeneralAnimal || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                  {adopciones.every(adopcion => !adopcion.seguimiento || adopcion.seguimiento.length === 0) && (
                    <tr>
                      <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                        No hay registros de seguimiento disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "historial" && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Evento
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistorial.map((event, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatDate(event.fecha)}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {event.title}
                        {event.detalles && (
                          <div className="text-xs text-gray-500 mt-1">{event.detalles}</div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-xs ${
                            event.estado === "aprobada"
                              ? "bg-green-500"
                              : event.estado === "pendiente"
                              ? "bg-yellow-500"
                              : event.estado === "en proceso"
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                        >
                          {event.estado.charAt(0).toUpperCase() + event.estado.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdopcionesAdmin;