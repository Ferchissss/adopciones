import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDaysIcon, PlusIcon, XMarkIcon, CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { useAuth } from "../../components/AuthContext";

const TareasAdmin = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos los estados");
  const [priorityFilter, setPriorityFilter] = useState("Todas las prioridades");
  const [rejectedFilter, setRejectedFilter] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const estados = ["Pendiente", "En progreso", "Completada"];
  const prioridades = ["Baja", "Media", "Alta", "Urgente"];

  // Obtener tareas y voluntarios de Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener tareas
        const tasksQuery = query(collection(db, "tareas"));
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksData = tasksSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          // Convertir Firestore Timestamp a Date si existe
          fecha_vencimiento: doc.data().fecha_vencimiento?.toDate() || null,
          creada_en: doc.data().creada_en?.toDate() || null,
          rechazada: doc.data().rechazada || false
        }));
        setTasks(tasksData);

        // Obtener voluntarios
        const voluntariosQuery = query(collection(db, "users"), where("rol", "==", "voluntario"));
        const voluntariosSnapshot = await getDocs(voluntariosQuery);
        const voluntariosData = voluntariosSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        setVoluntarios(voluntariosData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => setSearchText(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handlePriorityChange = (e) => setPriorityFilter(e.target.value);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleEdit = (id) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    setCurrentTask(taskToEdit);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
      try {
        await deleteDoc(doc(db, "tareas", id));
        setTasks(prev => prev.filter(task => task.id !== id));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Actualizar el nombre del asignado cuando se selecciona un voluntario
    if (name === "asignado_a") {
      const voluntarioSeleccionado = voluntarios.find(v => v.id === value);
      setCurrentTask(prev => ({
        ...prev,
        asignado_nombre: voluntarioSeleccionado ? voluntarioSeleccionado.nombre : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "tareas", currentTask.id), {
        ...currentTask,
        fecha_vencimiento: new Date(currentTask.fecha_vencimiento),
      });
      
      setTasks(prev =>
        prev.map(task =>
          task.id === currentTask.id ? currentTask : task
        )
      );
      setIsEditModalOpen(false);
      alert("Tarea actualizada exitosamente!");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error al actualizar la tarea");
    }
  };

  const formatDate = (date) => {
    if (!date) return "No definida";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = `${task.titulo} ${task.descripcion} ${task.asignado_nombre}`.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "Todos los estados" || task.estado === statusFilter;
    const matchesPriority = priorityFilter === "Todas las prioridades" || task.prioridad === priorityFilter;
    const matchesRejected = rejectedFilter ? task.rechazada : !task.rechazada;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesRejected;
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isCollapsed={isCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
          <AdminHeader title="Tareas" toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
          <div className="p-6 bg-gray-100 min-h-screen" style={{ marginTop: "64px" }}>
            <div className="flex justify-center items-center h-full">
              <p>Cargando tareas...</p>
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
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
        style={{
          width: "calc(100vw - 64px)",
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <AdminHeader
          title="Tareas"
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Content Area */}
        <div
          className="p-6 bg-gray-100 min-h-screen"
          style={{
            marginTop: "64px",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tareas</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/tareas/nueva")}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nueva Tarea
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
            />
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="Todos los estados">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={handlePriorityChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="Todas las prioridades">Todas las prioridades</option>
                {prioridades.map((prioridad) => (
                  <option key={prioridad} value={prioridad}>
                    {prioridad}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setRejectedFilter(!rejectedFilter)}
                className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer ${
                    rejectedFilter ? "bg-red-100 text-red-700" : "bg-white"
                }`}
                >
                {rejectedFilter ? "Mostrar activas" : "Mostrar rechazadas"}
                </button>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-2">Título</th>
                  <th className="px-4 py-2">Asignado a</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Prioridad</th>
                  <th className="px-4 py-2">Vencimiento</th>
                  <th className="px-4 py-2">Creada</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => {
                  const isOverdue = task.fecha_vencimiento && 
                                  new Date(task.fecha_vencimiento) < new Date() && 
                                  task.estado !== "Completada";
                  return (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{task.titulo}</td>
                      <td className="px-4 py-2">{task.asignado_nombre || "No asignada"}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            task.estado === "Completada" 
                              ? "bg-green-100 text-green-700"
                              : task.estado === "En progreso"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {task.estado}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
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
                      </td>
                      <td className={`px-4 py-2 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                        <div className="flex items-center">
                          {isOverdue && <ClockIcon className="h-4 w-4 mr-1 text-red-500" />}
                          {formatDate(task.fecha_vencimiento)}
                        </div>
                      </td>
                      <td className="px-4 py-2">{formatDate(task.creada_en)}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleEdit(task.id)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2 cursor-pointer"
                        >
                          Ver/Editar
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
              <p className="text-center text-gray-600 py-4">
                No hay tareas que coincidan con los filtros.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Editar Tarea</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                      type="text"
                      name="titulo"
                      value={currentTask.titulo}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Asignado a</label>
                    <select
                      name="asignado_a"
                      value={currentTask.asignado_a}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">Seleccione un voluntario</option>
                      {voluntarios.map((voluntario) => (
                        <option key={voluntario.id} value={voluntario.id}>
                          {voluntario.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      name="estado"
                      value={currentTask.estado}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                      required
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fechas y Prioridad */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Configuración</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de vencimiento</label>
                    <input
                      type="date"
                      name="fecha_vencimiento"
                      value={currentTask.fecha_vencimiento ? new Date(currentTask.fecha_vencimiento).toISOString().split('T')[0] : ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                    <select
                      name="prioridad"
                      value={currentTask.prioridad}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                      required
                    >
                      {prioridades.map((prioridad) => (
                        <option key={prioridad} value={prioridad}>{prioridad}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Creada por</label>
                    <input
                      type="text"
                      value={currentTask.creada_por_nombre || "Administrador"}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={currentTask.descripcion}
                    onChange={handleInputChange}
                    rows={5}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Botones del formulario */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TareasAdmin;