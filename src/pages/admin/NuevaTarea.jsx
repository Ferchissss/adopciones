import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";
import { db } from "../../firebase";
import { collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../components/AuthContext"; // Asumo que tienes un contexto de autenticación
import { v4 as uuidv4 } from "uuid";

const NuevaTarea = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    asignado_a: "",
    asignado_nombre: "",
    fecha_vencimiento: "",
    estado: "Pendiente",
    prioridad: "Media",
    rechazada: false,
  });
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { usuario } = useAuth(); // Obtener el usuario admin actual

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    // Cargar la lista de voluntarios al montar el componente
    const fetchVoluntarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const voluntariosData = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.rol === "voluntario") {
            voluntariosData.push({
              id: doc.id,
              nombre: userData.nombre,
            });
          }
        });
        setVoluntarios(voluntariosData);
      } catch (error) {
        console.error("Error al cargar voluntarios:", error);
        setError("Error al cargar la lista de voluntarios");
      }
    };

    fetchVoluntarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Actualizar el nombre del asignado cuando se selecciona un voluntario
    if (name === "asignado_a") {
      const voluntarioSeleccionado = voluntarios.find(v => v.id === value);
      setFormData(prev => ({
        ...prev,
        asignado_nombre: voluntarioSeleccionado ? voluntarioSeleccionado.nombre : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Crear ID único para la tarea
      const tareaId = uuidv4();

      // Crear el objeto de tarea para Firestore
      const tareaData = {
        _id: tareaId,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        asignado_a: formData.asignado_a,
        asignado_nombre: formData.asignado_nombre,
        fecha_vencimiento: new Date(formData.fecha_vencimiento),
        estado: formData.estado,
        prioridad: formData.prioridad,
        rechazada:false,
        creada_en: serverTimestamp(),
        creada_por: usuario.uid, // ID del admin que creó la tarea
        creada_por_nombre: usuario.displayName || "Administrador", // Nombre del admin
      };

      // Guardar en la colección 'tareas'
      await setDoc(doc(db, "tareas", tareaId), tareaData);

      alert("Tarea creada exitosamente!");
      // Limpiar el formulario después del registro exitoso
      setFormData({
        titulo: "",
        descripcion: "",
        asignado_a: "",
        asignado_nombre: "",
        fecha_vencimiento: "",
        estado: "Pendiente",
        prioridad: "Media",
        rechazada: false,
      });
    } catch (error) {
      console.error("Error al crear tarea:", error);
      setError("Error al crear tarea: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
          title="Nueva Tarea"
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Content Area */}
        <div className="p-6 bg-gray-100 min-h-screen" style={{ marginTop: "64px" }}>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
            title="Retroceder"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Crear Nueva Tarea
            </h2>
            <p className="text-gray-600 mb-6">
              Complete los detalles de la nueva tarea a asignar
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  placeholder="Título descriptivo de la tarea"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  placeholder="Describa la tarea en detalle"
                  rows="4"
                  required
                />
              </div>

              {/* Asignado a */}
              <div>
                <label className="block text-gray-700 mb-2">Asignar a</label>
                <select
                  name="asignado_a"
                  value={formData.asignado_a}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
                  required
                >
                  <option value="">Seleccione un voluntario</option>
                  {voluntarios.map((voluntario) => (
                    <option key={voluntario.id} value={voluntario.id}>
                      {voluntario.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha de vencimiento */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha de vencimiento</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={formData.fecha_vencimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
                  required
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-gray-700 mb-2">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
                  required
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>

              {/* Prioridad */}
              <div>
                <label className="block text-gray-700 mb-2">Prioridad</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
                  required
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
            </div>

            {/* Botón de enviar */}
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creando..." : "Crear Tarea"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevaTarea;