import React, { useState, useEffect } from "react";
import AdoptSlideHeader from "../../components/adoptantescompon/AdoptSlideHeader";
import AdoptSlidebar from "../../components/adoptantescompon/AdopSlidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase"; // Asegúrate de importar tus configuraciones de Firebase
import { doc, getDoc } from "firebase/firestore";

const DashboardA = ({ user }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("recomendados");
  const [favoritos, setFavoritos] = useState(5);
  const [solicitudes, setSolicitudes] = useState(1);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async (uid) => {
      try {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No se encontraron datos del usuario");
          // Si no hay datos, redirigir a completar perfil
          navigate("/completar-perfil");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    // Verificar si hay datos en el estado de navegación (recién registrado)
    if (location.state?.user) {
      setUserData(location.state.user);
      setLoading(false);
    } else {
      // Si no, verificar el usuario autenticado
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          fetchUserData(user.uid);
        } else {
          navigate("/login");
        }
      });

      return () => unsubscribe();
    }
  }, [location.state, navigate]);


  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700">No se pudieron cargar tus datos.</p>
          <button 
            onClick={() => navigate("/completar-perfil")}
            className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
          >
            Completar Perfil
          </button>
        </div>
      </div>
    );
  }

  const nombreUsuario = userData?.nombre || "Usuario";


  // Datos de mascotas recomendadas con imágenes
  const mascotasRecomendadas = [
    {
      id: 1,
      nombre: "Luna",
      tipo: "Perro",
      raza: "Labrador",
      genero: "Hembra",
      edad: "2 años",
      descripcion: "Luna es una perrita cariñosa y juguetona que busca un hogar lleno de amor y paciencia.",
      caracteristicas: ["Bueno con niños", "Bueno con perros", "Apto para apartamento"],
      imagen: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      favorito: true
    },
    {
      id: 2,
      nombre: "Simba",
      tipo: "Gato",
      raza: "Siamés",
      genero: "Macho",
      edad: "1 año",
      descripcion: "Simba es un gato juguetón y cariñoso que se lleva bien con niños y otros animales.",
      caracteristicas: ["Bueno con niños", "Bueno con gatos", "Apto para apartamento"],
      imagen: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      favorito: false
    },
    {
      id: 3,
      nombre: "Rocky",
      tipo: "Perro",
      raza: "Pastor Alemán",
      genero: "Macho",
      edad: "3 años",
      descripcion: "Rocky es un perro leal y protector, ideal para familias activas que disfrutan de paseos al aire libre.",
      caracteristicas: ["Bueno con niños", "Bueno con perros"],
      imagen: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      favorito: true
    }
  ];

  // Datos de solicitudes
  const solicitudesAdopcion = [
    {
      id: 1,
      mascota: "Simba",
      fecha: "25/04/2023",
      estado: "Pendiente"
    },
    {
      id: 2,
      mascota: "Max",
      fecha: "18/03/2023",
      estado: "Aprobada"
    }
  ];

  const toggleFavorito = (id) => {
    const updatedMascotas = mascotasRecomendadas.map(mascota => {
      if (mascota.id === id) {
        const newFavorito = !mascota.favorito;
        setFavoritos(prev => newFavorito ? prev + 1 : prev - 1);
        return { ...mascota, favorito: newFavorito };
      }
      return mascota;
    });
    // Aquí deberías actualizar el estado de las mascotas recomendadas
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdoptSlidebar isCollapsed={isSidebarCollapsed} user={userData} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "pl-20" : "pl-64"}`}>
        {/* Header */}
        <AdoptSlideHeader
          title={`Bienvenida, ${nombreUsuario}`}
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
          user={userData}
        />

        {/* Main Content */}
        <div className="container mx-auto p-6 mt-16">
          {/* Título y descripción */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">¿Encuentra tu compañero ideal?</h1>
            <p className="text-gray-600">Descubre nuestra selección de animales disponibles para adopción y encuentra el compañero perfecto para tu hogar.</p>
          </div>

          {/* Resumen - Eliminé el contador de mascotas adoptadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{favoritos}</h2>
                <p className="text-sm text-gray-600">Favoritos</p>
              </div>
              <div className="text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{solicitudes}</h2>
                <p className="text-sm text-gray-600">Solicitudes</p>
              </div>
              <div className="text-emerald-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tabs - Eliminé la pestaña "Mis Mascotas" */}
          <div className="border-b border-gray-300 mb-4">
            <ul className="flex space-x-4">
              <li>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "recomendados" ? "text-emerald-500 border-b-2 border-emerald-500" : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("recomendados")}
                >
                  Recomendados para ti
                </button>
              </li>
              <li>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "solicitudes" ? "text-emerald-500 border-b-2 border-emerald-500" : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("solicitudes")}
                >
                  Mis Solicitudes
                </button>
              </li>
            </ul>
          </div>

          {/* Contenido de las pestañas */}
          {activeTab === "recomendados" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mascotasRecomendadas.map((mascota) => (
                <div key={mascota.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Imagen del animal */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={mascota.imagen}
                      alt={mascota.nombre}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Información del animal */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{mascota.nombre}</h3>
                        <p className="text-sm text-gray-600">
                          {mascota.raza} • {mascota.edad} • {mascota.genero}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleFavorito(mascota.id)}
                        className={`${mascota.favorito ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={mascota.favorito ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-700 my-3">{mascota.descripcion}</p>

                    {/* Características */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mascota.caracteristicas.map((caracteristica, index) => (
                        <span
                          key={index}
                          className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full"
                        >
                          {caracteristica}
                        </span>
                      ))}
                    </div>

                    {/* Botones */}
                    <div className="flex space-x-2">
                  {/*   <button className="flex-1 bg-white border border-emerald-500 text-emerald-500 px-4 py-2 rounded hover:bg-emerald-50 transition-colors">
                        Ver detalles
                      </button>
                      <button 
      className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
      onClick={() => navigate("/adoptantes/solicitud", { state: { animal } })}
    >
      Adoptar
    </button>*/}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "solicitudes" && (
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Solicitudes de Adopción</h2>
              <ul className="space-y-4">
                {solicitudesAdopcion.map((solicitud) => (
                  <li key={solicitud.id} className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Solicitud para adoptar a {solicitud.mascota}</p>
                      <p className="text-sm text-gray-600">Enviada el {solicitud.fecha}</p>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        solicitud.estado === "Aprobada" ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {solicitud.estado}
                      </span>
                    </div>
                    <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">
                      Ver Detalles
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardA;