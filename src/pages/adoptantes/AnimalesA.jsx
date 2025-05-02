import React, { useState, useEffect } from "react";
import AdoptSlideHeader from "../../components/adoptantescompon/AdoptSlideHeader";
import AdoptSlidebar from "../../components/adoptantescompon/AdopSlidebar";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import MiniCarrusel from "../../components/administradorcompon/AdminCarrusel";

const AnimalesA = ({ user }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Cargar animales desde Firebase
  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "animales"),
          where("datosFijos.estado", "in", ["Disponible", "En adopción"])
        );
        
        const querySnapshot = await getDocs(q);
        const animalesData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          animalesData.push({
            id: doc.id,
            ...data.datosFijos,
            saludActual: data.saludActual || {},
            comportamiento: data.comportamiento || {}
          });
        });
        
        setAnimales(animalesData);
      } catch (error) {
        console.error("Error al cargar animales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimales();
  }, []);

  // Filtrar animales según el filtro activo y término de búsqueda
  const filteredAnimales = animales.filter(animal => {
    // Filtrado por especie
    const matchesFilter = 
      activeFilter === "Todos" || 
      (activeFilter === "Perros" && animal.especie === "Perro") ||
      (activeFilter === "Gatos" && animal.especie === "Gato") ||
      (activeFilter === "Otros" && animal.especie !== "Perro" && animal.especie !== "Gato");
    
    // Filtrado por búsqueda
    const matchesSearch = 
      searchTerm === "" ||
      animal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      animal.raza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.especie.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdoptSlidebar isCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "pl-20" : "pl-64"}`}>
        {/* Header */}
        <AdoptSlideHeader
          title={`Explorar Animales`}
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
          user={user}
        />

        {/* Main Content */}
        <div className="container mx-auto p-6 mt-16">
          {/* Título y descripción */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">¿Encuentra tu compañero ideal?</h1>
            <p className="text-gray-600">Descubre nuestra selección de animales disponibles para adopción y encuentra el compañero perfecto para tu hogar.</p>
          </div>
          {/* Filtros */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {["Todos", "Perros", "Gatos", "Otros"].map((filtro) => (
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
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar animales..."
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-300 w-full"
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
            /* Lista de animales */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnimales.map((animal) => (
                <div 
                  key={animal.id} 
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* MiniCarrusel para las imágenes */}
                  <div className="h-58 overflow-hidden" onClick={() => navigate("/adoptante/animales/detalle", { state: { animal } })}>
                    <MiniCarrusel images={animal.fotos || []} />
                  </div>

                  {/* Información del animal */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{animal.nombre}</h2>
                        <p className="text-sm text-gray-600">
                          {animal.raza || 'Sin raza'} • {animal.edad} {animal.unidadEdad} • {animal.sexo}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        animal.estado === "Disponible" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {animal.estado}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 my-3 line-clamp-2">
                      {animal.descripcion || 'Sin descripción disponible'}
                    </p>

                    {/* Características basadas en comportamiento */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {animal.comportamiento?.temperamento && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          {animal.comportamiento.temperamento}
                        </span>
                      )}
                      {animal.comportamiento?.compatibilidad?.perros === "Si" && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          Bueno con perros
                        </span>
                      )}
                      {animal.comportamiento?.compatibilidad?.gatos === "Si" && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          Bueno con gatos
                        </span>
                      )}
                    </div>

                    {/* Botones */}
                    <div className="flex space-x-2">
                      <button 
                        className="flex-1 bg-white border border-emerald-500 text-emerald-500 px-4 py-2 rounded hover:bg-emerald-50 transition-colors cursor-pointer"
                        onClick={() => navigate("/adoptante/animales/detalle", { state: { animal } })}
                      >
                        Ver detalles
                      </button>
                      <button 
                        className={`flex-1 px-4 py-2 rounded transition-colors cursor-pointer ${
                          animal.estado === "Disponible"
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() => navigate("/adoptante/solicitud", { state: { animal } })}
                      >
                        {animal.estado === "Disponible" ? "Adoptar" : "Solicitar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mensaje cuando no hay resultados */}
          {!loading && filteredAnimales.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No se encontraron animales disponibles que coincidan con tu búsqueda.</p>
              <button 
                className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
                onClick={() => {
                  setActiveFilter("Todos");
                  setSearchTerm("");
                }}
              >
                Mostrar todos los disponibles
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalesA;