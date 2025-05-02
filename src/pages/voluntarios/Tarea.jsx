import React, { useState, useEffect } from "react";
import VolunSlideBar from "../../components/voluntacompone/VolunSlideBar";
import VolunSlideHeader from "../../components/voluntacompone/VolunSlideHeader";
import { db } from "../../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../components/AuthContext";
import { ClockIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Tarea = () => {
  // Estado para controlar el sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { usuario } = useAuth();
  
  // Estado para las tareas
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Estado de búsqueda y filtros
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas las categorías");
  const [filterStatus, setFilterStatus] = useState("Todas las prioridades");
  const [activeTab, setActiveTab] = useState("Pendientes");

  // Obtener tareas del usuario actual
  useEffect(() => {
    const fetchTasks = async () => {
      if (!usuario) return;
      
      try {
        setLoading(true);
        const q = query(
          collection(db, "tareas"),
          where("asignado_a", "==", usuario.uid),
          where("rechazada", "==", false) // Solo tareas no rechazadas
        );
        
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convertir Firestore Timestamp a Date si existe
          fecha_vencimiento: doc.data().fecha_vencimiento?.toDate() || null,
          creada_en: doc.data().creada_en?.toDate() || null
        }));
        
        setTasks(tasksData);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [usuario]);
  // Verificar si una tarea está vencida
  const isTaskOverdue = (task) => {
    return task.fecha_vencimiento && 
           new Date(task.fecha_vencimiento) < new Date() && 
           task.estado !== "Completada" &&
           !task.rechazada;
  };

  // Calcular estadísticas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.estado === "Completada").length;
  const pendingTasks = tasks.filter((task) => 
    task.estado !== "Completada" && !isTaskOverdue(task)
  ).length;
  const overdueTasks = tasks.filter(isTaskOverdue).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;


  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return "No definida";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Maneja la búsqueda
  const handleSearch = (e) => setSearchText(e.target.value);

  // Filtrar tareas según la pestaña activa
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.titulo.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      filterCategory === "Todas las categorías" || task.prioridad === filterCategory;
    const matchesStatus =
      filterStatus === "Todas las prioridades" || task.estado === filterStatus;

    // Filtro por pestaña activa
    if (activeTab === "Pendientes" && 
        (task.estado !== "Pendiente" || isTaskOverdue(task))) return false;
    if (activeTab === "Completadas" && task.estado !== "Completada") return false;
    if (activeTab === "Urgentes" && task.prioridad !== "Urgente") return false;
    if (activeTab === "Vencidas" && !isTaskOverdue(task)) return false;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Marca la tarea como completada
  const markAsCompleted = async (id) => {
    try {
      // Actualizar en Firestore
      await updateDoc(doc(db, "tareas", id), {
        estado: "Completada",
        rechazada: false // Asegurarse que no está rechazada
      });
      
      // Actualizar estado local
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, estado: "Completada", rechazada: false } : task
        )
      );
    } catch (error) {
      console.error("Error al completar tarea:", error);
      alert("Error al marcar la tarea como completada");
    }
  };

  // Rechaza la tarea (marca como rechazada en lugar de eliminar)
  const rejectTask = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres rechazar esta tarea?")) return;
    
    try {
      // Actualizar en Firestore
      await updateDoc(doc(db, "tareas", id), {
        rechazada: true
      });
      
      // Actualizar estado local
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error al rechazar tarea:", error);
      alert("Error al rechazar la tarea");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <VolunSlideBar isCollapsed={isSidebarCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? "pl-20" : "pl-64"
        } mt-16`}>
          <VolunSlideHeader
            toggleSidebar={toggleSidebar}
            isCollapsed={isSidebarCollapsed}
            title="Tareas"
          />
          <div className="p-6">
            <p>Cargando tareas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra lateral */}
      <VolunSlideBar isCollapsed={isSidebarCollapsed} />

      {/* Contenido principal */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? "pl-20" : "pl-64"
        } mt-16`}
      >
        {/* Encabezado */}
        <VolunSlideHeader
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
          title="Tareas"
        />

        {/* Contenido */}
        <div className="p-6">
          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Tareas</h1>

          {/* Header de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold text-gray-800">{totalTasks}</h2>
              <p className="text-sm text-gray-600">Total Tareas</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold text-gray-800">{pendingTasks}</h2>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold text-gray-800">{completedTasks}</h2>
              <p className="text-sm text-gray-600">Completadas</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold text-gray-800">{overdueTasks}</h2>
              <p className="text-sm text-gray-600">Vencidas</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold text-gray-800">{progress}%</h2>
              <p className="text-sm text-gray-600">Progreso</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchText}
              onChange={handleSearch}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
            />
            <div className="flex space-x-4 mt-4 md:mt-0">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              >
                <option>Todas las categorías</option>
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
                <option>Urgente</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              >
                <option>Todas las prioridades</option>
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Completada</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-300 mb-4">
            {["Pendientes", "Completadas", "Urgentes", "Vencidas"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "text-gray-800 border-b-2 border-emerald-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Lista de tareas */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="bg-white shadow-md rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  {activeTab === "Pendientes" 
                    ? "No tienes tareas pendientes" 
                    : activeTab === "Completadas" 
                    ? "No has completado ninguna tarea aún" 
                    : activeTab === "Urgentes"
                    ? "No tienes tareas urgentes"
                    : "No tienes tareas vencidas"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isOverdue = isTaskOverdue(task);
                
                return (
                  <div
                    key={task.id}
                    className={`bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center ${
                      task.prioridad === "Urgente" ? "border-l-4 border-red-500" : ""
                    } ${isOverdue ? "border-l-4 border-yellow-500" : ""}`}
                  >
                    <div>
                      <div className="flex items-center">
                        <h3
                          className={`text-lg font-bold ${
                            task.estado === "Completada"
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {task.titulo}
                        </h3>
                        {isOverdue && (
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Vencida
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          task.estado === "Completada"
                            ? "line-through text-gray-500"
                            : "text-gray-600"
                        }`}
                      >
                        {task.descripcion}
                      </p>
                      <p
                        className={`text-sm mt-2 ${
                          isOverdue ? "text-red-600 font-medium" : "text-gray-600"
                        }`}
                      >
                        <span className="font-medium">
                          {task.estado === "Completada" ? "Completada:" : "Límite:"}
                        </span>{" "}
                        {formatDate(task.fecha_vencimiento)}
                      </p>
                      {task.estado !== "Completada" && (
                        <div className="flex space-x-4 mt-4">
                          <button
                            onClick={() => markAsCompleted(task.id)}
                            className="flex items-center px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                          >
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Completar
                          </button>
                          <button
                            onClick={() => rejectTask(task.id)}
                            className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          task.prioridad === "Urgente"
                            ? "bg-red-100 text-red-700"
                            : task.prioridad === "Alta"
                            ? "bg-orange-100 text-orange-700"
                            : task.prioridad === "Media"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {task.prioridad}
                      </span>
                      <span className="text-sm text-gray-600">
                        Asignado por: {task.creada_por_nombre || "Administrador"}
                      </span>
                      {task.estado === "Completada" && (
                        <span className="text-sm text-green-600 font-medium flex items-center">
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Completada
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tarea;