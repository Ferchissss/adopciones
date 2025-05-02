import React, { useState, useRef, useEffect } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";
import StatsCards from "../../components/administradorcompon/StatsCards";
import RecentAnimalsTable from "../../components/administradorcompon/RecentAnimalsTable";
import PendingAdoptionsTable from "../../components/administradorcompon/PendingAdoptionsTable";
import RecentActivities from "../../components/administradorcompon/RecentActivities";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalAnimals: 0,
    completedAdoptions: 0,
    volunteersCount: 0,
    pendingRequests: 0
  });
  const [recentAnimals, setRecentAnimals] = useState([]);
  const [pendingAdoptions, setPendingAdoptions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Referencias para las secciones
  const animalsRef = useRef(null);
  const adoptionsRef = useRef(null);
  const activitiesRef = useRef(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Función para desplazarse a una sección
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Función para formatear fechas
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return timestamp.toDate().toLocaleDateString("es-ES");
  };

  // Cargar datos de Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener estadísticas generales
        // Total de animales
        const animalsQuery = query(collection(db, "animales"));
        const animalsSnapshot = await getDocs(animalsQuery);
        const totalAnimals = animalsSnapshot.size;

        // Adopciones completadas
        const completedAdoptionsQuery = query(
          collection(db, "solicitudesAdopcion"),
          where("estado", "==", "completada")
        );
        const completedAdoptionsSnapshot = await getDocs(completedAdoptionsQuery);
        const completedAdoptions = completedAdoptionsSnapshot.size;

        // Voluntarios
        const volunteersQuery = query(
          collection(db, "users"),
          where("rol", "==", "voluntario")
        );
        const volunteersSnapshot = await getDocs(volunteersQuery);
        const volunteersCount = volunteersSnapshot.size;

        // Solicitudes pendientes
        const pendingRequestsQuery = query(
          collection(db, "solicitudesAdopcion"),
          where("formulario.estadoFormulario", "==", "pendiente")
        );
        const pendingRequestsSnapshot = await getDocs(pendingRequestsQuery);
        const pendingRequests = pendingRequestsSnapshot.size;

        setStats({
          totalAnimals,
          completedAdoptions,
          volunteersCount,
          pendingRequests
        });

        // 2. Obtener 3 animales más recientes
        const recentAnimalsQuery = query(
          collection(db, "animales"),
          orderBy("FechaIngreso", "desc"),
          limit(3)
        );
        const recentAnimalsSnapshot = await getDocs(recentAnimalsQuery);
        const animalsData = recentAnimalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          FechaIngreso: formatDate(doc.data().FechaIngreso)
        }));
        setRecentAnimals(animalsData);

        // 3. Obtener solicitudes pendientes
        const pendingAdoptionsQuery = query(
          collection(db, "solicitudesAdopcion"),
          where("formulario.estadoFormulario", "==", "pendiente"),
          orderBy("formulario.fechaEnvio", "desc")
        );
        const pendingAdoptionsSnapshot = await getDocs(pendingAdoptionsQuery);
        const pendingAdoptionsData = pendingAdoptionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fechaEnvio: formatDate(doc.data().formulario?.fechaEnvio),
          nombreAnimal: doc.data().nombreAnimal,
          nombreCompleto: doc.data().nombreCompleto,
        }));
        setPendingAdoptions(pendingAdoptionsData);

        // 4. Obtener actividades recientes
        const allAdoptionsQuery = query(
          collection(db, "solicitudesAdopcion"),
          orderBy("formulario.fechaEnvio", "desc"),
          limit(10)
        );
        const allAdoptionsSnapshot = await getDocs(allAdoptionsQuery);
        
        const activities = [];
        
        allAdoptionsSnapshot.docs.forEach(doc => {
          const data = doc.data();
          
          // Evento de solicitud
          if (data.formulario?.fechaEnvio) {
            activities.push({
              type: "solicitud",
              fecha: data.formulario.fechaEnvio,
              title: `${data.nombreCompleto} solicitó adoptar a ${data.nombreAnimal}`,
              formattedDate: formatDate(data.formulario.fechaEnvio)
            });
          }
          
          // Evento de revisión del formulario
          if (data.formulario?.fechaRevision) {
            activities.push({
              type: "revision",
              fecha: data.formulario.fechaRevision,
              title: `Formulario de ${data.nombreCompleto} fue ${data.formulario.estadoFormulario}`,
              formattedDate: formatDate(data.formulario.fechaRevision)
            });
          }
          
          // Evento de adopción
          if (data.fechaAdopcion) {
            activities.push({
              type: "adopcion",
              fecha: data.fechaAdopcion,
              title: `${data.nombreCompleto} adoptó a ${data.nombreAnimal}`,
              formattedDate: formatDate(data.fechaAdopcion)
            });
          }
          
          // Eventos de seguimiento
          if (data.seguimiento) {
            data.seguimiento.forEach((seg, index) => {
              activities.push({
                type: "seguimiento",
                fecha: seg.fecha,
                title: `Seguimiento ${index + 1} para ${data.nombreAnimal}`,
                detalles: seg.tipo,
                formattedDate: formatDate(seg.fecha)
              });
            });
          }
        });
        
        // Ordenar actividades por fecha (más reciente primero)
        activities.sort((a, b) => b.fecha - a.fecha);
        setRecentActivities(activities.slice(0, 10));

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex bg-gray-100 overflow-hidden">
        <AdminSidebar isCollapsed={isCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}>
          <AdminHeader
            title="Administración"
            toggleSidebar={toggleSidebar}
            isCollapsed={isCollapsed}
          />
          <div className="p-6 mt-16 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Header */}
        <AdminHeader
          title="Administración"
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Contenido principal con margen superior */}
        <div className="p-6 mt-16">
          {/* Estadísticas */}
          <StatsCards 
            totalAnimals={stats.totalAnimals}
            completedAdoptions={stats.completedAdoptions}
            volunteersCount={stats.volunteersCount}
            pendingRequests={stats.pendingRequests}
          />

          {/* Tabs */}
          <div className="mb-6">
            <ul className="flex space-x-4 border-b overflow-x-auto">
              {[
                "Animales Recientes",
                "Adopciones Pendientes",
                "Actividades Recientes",
              ].map((tab, index) => (
                <li key={index}>
                  <button
                    onClick={() =>
                      index === 0
                        ? scrollToSection(animalsRef)
                        : index === 1
                        ? scrollToSection(adoptionsRef)
                        : scrollToSection(activitiesRef)
                    }
                    className={`px-4 py-2 font-semibold text-gray-600 hover:text-emerald-600 whitespace-nowrap`}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Animales Recientes */}
          <div ref={animalsRef} className="mb-6">
            <h2 className="text-xl font-bold text-emerald-800 mb-4">
              Animales Recientes
            </h2>
            <RecentAnimalsTable animals={recentAnimals} />
          </div>

          {/* Solicitudes de Adopción Pendientes */}
          <div ref={adoptionsRef} className="mb-6">
            <h2 className="text-xl font-bold text-emerald-800 mb-4">
              Solicitudes de Adopción Pendientes
            </h2>
            <PendingAdoptionsTable adoptions={pendingAdoptions} />
          </div>

          {/* Actividades Recientes */}
          <div ref={activitiesRef} className="mb-6">
            <h2 className="text-xl font-bold text-emerald-800 mb-4">
              Actividades Recientes
            </h2>
            <RecentActivities activities={recentActivities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;