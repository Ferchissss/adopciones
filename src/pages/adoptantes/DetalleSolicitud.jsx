import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdoptSlideHeader from "../../components/adoptantescompon/AdoptSlideHeader";
import AdoptSlidebar from "../../components/adoptantescompon/AdopSlidebar";

const DetalleSolicitud = ({ user }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener datos de la solicitud desde la ubicación
  const solicitud = location.state?.solicitud;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleBackClick = () => {
    navigate(-1); // Regresa a la página anterior
  };

  // Función para obtener el color según el estado
  const getEstadoColor = (estado) => {
    switch(estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "aprobada":
        return "bg-emerald-100 text-emerald-800";
      case "completada":
        return "bg-blue-100 text-blue-800";
      case "rechazada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para formatear el estado para mostrar
  const formatEstado = (estado) => {
    switch(estado) {
      case "pendiente":
        return "En revisión";
      case "aprobada":
        return "Aprobada";
      case "completada":
        return "Completada";
      case "rechazada":
        return "Rechazada";
      default:
        return estado;
    }
  };

  if (!solicitud) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdoptSlidebar isCollapsed={isSidebarCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "pl-20" : "pl-64"}`}>
          <AdoptSlideHeader
            title="Detalles no disponibles"
            toggleSidebar={toggleSidebar}
            isCollapsed={isSidebarCollapsed}
            user={user}
          />
          <div className="container mx-auto p-6 mt-16 max-w-4xl text-center">
            <p>No se encontró información de la solicitud. Por favor, regresa a la lista.</p>
            <button
              onClick={handleBackClick}
              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdoptSlidebar isCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "pl-20" : "pl-64"}`}>
        {/* Header */}
        <AdoptSlideHeader
          title={`Detalles de Solicitud`}
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
          user={user}
        />

        {/* Main Content */}
        <div className="container mx-auto p-6 mt-16 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Información de la solicitud */}
            <div className="p-6">
              {/* Título y estado */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Solicitud #{solicitud.numeroSolicitud}</h1>
                  <p className="text-xl text-gray-600">Para adoptar a {solicitud.nombreAnimal}</p>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${getEstadoColor(solicitud.estado)}`}>
                  {formatEstado(solicitud.estado)}
                </span>
              </div>

              {/* Datos básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Fecha de solicitud</p>
                  <p className="font-medium">{solicitud.fechaEnvio || "No disponible"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Tipo de animal</p>
                  <p className="font-medium">{solicitud.tipo || "No especificado"}</p>
                </div>
              </div>

              {/* Sección Información del Adoptante */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Información del Adoptante</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="font-medium">{solicitud.nombreCompleto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="font-medium">{solicitud.correoElectronico}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{solicitud.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium">{solicitud.direccion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ciudad</p>
                    <p className="font-medium">{solicitud.ciudad}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Código Postal</p>
                    <p className="font-medium">{solicitud.codigoPostal || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Sección Información del Hogar */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Información del Hogar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tipo de vivienda</p>
                    <p className="font-medium">{solicitud.formulario?.tipoVivienda || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">¿Tiene patio/jardín?</p>
                    <p className="font-medium">{solicitud.formulario?.tienePatio ? "Sí" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horas solo al día</p>
                    <p className="font-medium">{solicitud.formulario?.horasSolo || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">¿Tiene otras mascotas?</p>
                    <p className="font-medium">{solicitud.formulario?.tieneOtrosAnimales ? "Sí" : "No"}</p>
                  </div>
                  {solicitud.formulario?.tieneOtrosAnimales && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Detalles de otras mascotas</p>
                      <p className="font-medium">{solicitud.formulario?.detallesOtrosAnimales || "No especificado"}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección Motivación y Experiencia */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Motivación y Experiencia</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Experiencia previa con mascotas</p>
                    <p className="font-medium">{solicitud.formulario?.experienciaPrevia || "No especificado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Motivación para adoptar</p>
                    <p className="font-medium">{solicitud.formulario?.motivacion || "No especificado"}</p>
                  </div>
                </div>
              </div>

              {/* Sección Proceso de Adopción */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Proceso de Adopción</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Estado actual</p>
                    <p className="font-medium">{formatEstado(solicitud.estado)}</p>
                  </div>
                  {solicitud.notas && (
                    <div>
                      <p className="text-sm text-gray-500">Notas del proceso</p>
                      <p className="font-medium">{solicitud.notas}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBackClick}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Volver
                </button>
                
                {solicitud.estado === "rechazada" && (
                  <button
                    onClick={() => navigate("/adoptante/animales")}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
                  >
                    Explorar otros animales
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleSolicitud;