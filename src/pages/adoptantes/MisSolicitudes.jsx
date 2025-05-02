import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdoptSlideHeader from "../../components/adoptantescompon/AdoptSlideHeader";
import AdoptSlidebar from "../../components/adoptantescompon/AdopSlidebar";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const MisSolicitudes = ({ user }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Obtener solicitudes de Firebase
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        setLoading(true);
        if (!uid) return;
        
        const q = query(
          collection(db, "solicitudesAdopcion"),
          where("adoptanteUid", "==", uid)
        );
        
        const querySnapshot = await getDocs(q);
        const solicitudesData = [];
        
        // Ordenar por fecha de solicitud (más reciente primero)
        const sortedDocs = querySnapshot.docs.sort((a, b) => 
          b.data().fechaSolicitud?.toMillis() - a.data().fechaSolicitud?.toMillis()
        );
        
        // Asignar número secuencial
        let contador = 1;
        sortedDocs.forEach((doc) => {
          const data = doc.data();
          solicitudesData.push({
            id: doc.id,
            numeroSolicitud: contador++,
            ...data,
            fechaEnvio: data.fechaSolicitud?.toDate().toLocaleDateString() || "Fecha no disponible",
            mascota: data.nombreAnimal,
            tipo: data.formulario?.tipoAnimal || "No especificado",
            estado: data.formulario?.estadoFormulario || "En revisión",
            descripcion: getDescripcionEstado(data.formulario?.estadoFormulario),
            proximoPaso: getProximoPaso(data.formulario?.estadoFormulario),
            completada: data.formulario?.estadoFormulario === "aprobado"
          });
        });

        setSolicitudes(solicitudesData);
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudes();
  }, [user]);

  // Función para generar descripción según estado
  const getDescripcionEstado = (estado) => {
    switch(estado) {
      case "pendiente":
        return "Tu solicitud está siendo revisada por nuestro equipo.";
      case "aprobado":
        return "¡Felicidades! Tu solicitud ha sido aprobada.";
      case "completado":
        return "Adopción finalizada con éxito.";
      case "rechazado":
        return "Lo sentimos, tu solicitud no ha sido aprobada.";
      default:
        return "Estado de solicitud no disponible.";
    }
  };

  // Función para generar el próximo paso según estado
  const getProximoPaso = (estado) => {
    switch(estado) {
      case "pendiente":
        return "Entrevista telefónica (próximamente)";
      case "aprobado":
        return "Visita para conocer al animal";
      case "completado":
        return "Seguimiento post-adopción";
      default:
        return "";
    }
  };

  // Función para obtener el color según el estado
  const getEstadoColor = (estado) => {
    switch(estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "aprobado":
        return "bg-emerald-100 text-emerald-800";
      case "completado":
        return "bg-blue-100 text-blue-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrar solicitudes según el estado seleccionado y término de búsqueda
  const filteredSolicitudes = solicitudes.filter(solicitud => {
    // Filtrado por estado (mapeando nombres para coincidir con los filtros)
    const estadoParaFiltro = solicitud.estado === "pendiente" ? "En revisión" : 
                           solicitud.estado === "aprobada" ? "Aprobadas" : 
                           solicitud.estado === "completada" ? "Completadas" : "";
    
    const matchesFilter = 
      activeFilter === "Todas" || 
      (activeFilter === "En revisión" && solicitud.estado === "pendiente") ||
      (activeFilter === "Aprobadas" && solicitud.estado === "aprobada") ||
      (activeFilter === "Completadas" && solicitud.estado === "completada");
    
    // Filtrado por búsqueda
    const matchesSearch = 
      searchTerm === "" ||
      solicitud.mascota?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      solicitud.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleVerDetalles = (solicitud) => {
    navigate("/adoptante/mis-solicitudes/detalle", { 
      state: { 
        solicitud: {
          ...solicitud,
          numeroSolicitud: solicitud.numeroSolicitud // Asegúrate de que esto está incluido
        } 
      } 
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdoptSlidebar isCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "pl-20" : "pl-64"}`}>
        {/* Header */}
        <AdoptSlideHeader
          title="Mis Solicitudes"
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
          user={user}
        />

        {/* Main Content */}
        <div className="container mx-auto p-6 mt-16">
          {/* Título y descripción */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Mis Solicitudes</h1>
            <p className="text-gray-600">Seguimiento de tus solicitudes de adopción</p>
          </div>

          {/* Filtros y buscador */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {["Todas", "En revisión", "Aprobadas", "Completadas"].map((filtro) => (
                <button
                  key={filtro}
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
                    activeFilter === filtro
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveFilter(filtro)}
                >
                  {filtro}
                </button>
              ))}
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar solicitudes..."
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Mostrar loading si está cargando */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            /* Lista de solicitudes */
            <div className="space-y-4">
              {filteredSolicitudes.length > 0 ? (
                filteredSolicitudes.map((solicitud) => (
                  <div 
                    key={solicitud.id} 
                    className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleVerDetalles(solicitud)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          Solicitud para adoptar a {solicitud.mascota}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {solicitud.tipo} • Solicitud #{solicitud.numeroSolicitud}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getEstadoColor(solicitud.estado)}`}>
                        {solicitud.estado === "pendiente" ? "En revisión" : 
                         solicitud.estado === "aprobada" ? "Aprobada" : 
                         solicitud.estado === "completada" ? "Completada" : 
                         solicitud.estado === "rechazada" ? "Rechazada" : solicitud.estado}
                      </span>
                    </div>

                    <p className="text-gray-700 my-3">{solicitud.descripcion}</p>

                    {solicitud.proximoPaso && (
                      <div className="my-3">
                        <p className="font-medium text-gray-800">Próximo paso:</p>
                        <p className="text-gray-700">{solicitud.proximoPaso}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-gray-500">Enviada el {solicitud.fechaEnvio}</p>
                      <button 
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalles(solicitud);
                        }}
                      >
                        Ver detalles →   
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                  <p className="text-gray-500">
                    {solicitudes.length === 0 ? 
                      "No tienes solicitudes de adopción registradas." : 
                      "No se encontraron solicitudes que coincidan con tu búsqueda."}
                  </p>
                  <button 
                    className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
                    onClick={() => {
                      setActiveFilter("Todas");
                      setSearchTerm("");
                    }}
                  >
                    {solicitudes.length === 0 ? 
                      "Explorar animales para adoptar" : 
                      "Mostrar todas"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisSolicitudes;