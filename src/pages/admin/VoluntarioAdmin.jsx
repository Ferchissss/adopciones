import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDaysIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const VoluntariosAdmin = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos los roles");
  const [statusFilter, setStatusFilter] = useState("Activo");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const roles = ["Todos los roles", "Coordinador", "Asistente veterinario", "Paseador", "Limpieza", "Marketing"];
  const statuses = ["Activo", "Inactivo"];
  const horasSemanales = [2, 4, 6, 8, 10, 12, 15, 20];

  // Obtener voluntarios de Firebase
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const volunteersData = querySnapshot.docs
          .filter(doc => doc.data().rol === "voluntario")
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setVolunteers(volunteersData);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleSearchChange = (e) => setSearchText(e.target.value);
  const handleRoleChange = (e) => setRoleFilter(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleEdit = (id) => {
    const volunteerToEdit = volunteers.find((v) => v.id === id);
    setCurrentVolunteer(volunteerToEdit);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este voluntario?")) {
      try {
        const volunteerToDelete = volunteers.find(v => v.id === id);
        
        // Eliminar imagen de Cloudinary si existe
        if (volunteerToDelete.fotoUrl) {
          const imageRef = ref(storage, volunteerToDelete.fotoUrl);
          await deleteObject(imageRef);
        }
        
        // Eliminar documento de Firestore
        await deleteDoc(doc(db, "users", id));
        
        // Actualizar estado local
        setVolunteers(prev => prev.filter(volunteer => volunteerer.id !== id));
      } catch (error) {
        console.error("Error deleting volunteer:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVolunteer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCurrentVolunteer(prev => {
      if (checked) {
        return {
          ...prev,
          disponibilidad: [...(prev.disponibilidad || []), name]
        };
      } else {
        return {
          ...prev,
          disponibilidad: (prev.disponibilidad || []).filter(day => day !== name)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", currentVolunteer.id), currentVolunteer);
      
      setVolunteers(prev =>
        prev.map(volunteer =>
          volunteer.id === currentVolunteer.id ? currentVolunteer : volunteer
        )
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating volunteer:", error);
    }
  };

  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch = `${volunteer.nombre} ${volunteer.email}`.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter === "Todos los roles" || volunteer.rolPrincipal === roleFilter;
    const matchesStatus = statusFilter === "Todos los estados" || volunteer.esta_activo === (statusFilter === "Activo");
    return matchesSearch && matchesRole && matchesStatus;
  });

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const horarios = ["Mañana", "Tarde", "Flexible"];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isCollapsed={isCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
          <AdminHeader title="Voluntarios" toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
          <div className="p-6 bg-gray-100 min-h-screen" style={{ marginTop: "64px" }}>
            <div className="flex justify-center items-center h-full">
              <p>Cargando voluntarios...</p>
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
          title="Voluntarios"
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
            <h1 className="text-2xl font-bold text-gray-800">Voluntarios</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/voluntarios/nuevo")}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nuevo Voluntario
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Buscar voluntarios..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
            />
            <div className="flex space-x-4">
              <select
                value={roleFilter}
                onChange={handleRoleChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="Todos los estados">Todos los estados</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Volunteers Table */}
          <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-2">Foto</th>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Teléfono</th>
                  <th className="px-4 py-2">Rol</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Fecha Inicio</th>
                  <th className="px-4 py-2">Horas</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="border-t">
                    <td className="px-4 py-2">
                      {volunteer.fotoUrl ? (
                        <img 
                          src={volunteer.fotoUrl} 
                          alt={volunteer.nombre}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Sin foto</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{volunteer.nombre}</td>
                    <td className="px-4 py-2">{volunteer.email}</td>
                    <td className="px-4 py-2">{volunteer.telefono}</td>
                    <td className="px-4 py-2">{volunteer.rolPrincipal}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          volunteer.esta_activo
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {volunteer.esta_activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-2">{volunteer.fechaInicio}</td>
                    <td className="px-4 py-2">{volunteer.horasSemanales}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(volunteer.id)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2 cursor-pointer"
                      >
                        Ver/Editar
                      </button>
                      <button
                        onClick={() => handleDelete(volunteer.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVolunteers.length === 0 && (
              <p className="text-center text-gray-600 py-4">
                No hay voluntarios que coincidan con los filtros.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && currentVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Editar Voluntario</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
                  
                  <div className="flex items-center space-x-4">
                    {currentVolunteer.fotoUrl ? (
                      <img 
                        src={currentVolunteer.fotoUrl} 
                        alt={currentVolunteer.nombre}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Sin foto</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Foto</label>
                      <p className="text-sm text-gray-500">La foto no se puede editar aquí</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                    <input
                      type="text"
                      name="nombre"
                      value={currentVolunteer.nombre}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={currentVolunteer.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={currentVolunteer.telefono}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DNI/Identificación</label>
                    <input
                      type="text"
                      name="dni"
                      value={currentVolunteer.dni}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={currentVolunteer.direccion}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Información de Voluntariado */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Información de Voluntariado</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rol principal</label>
                    <select
                      name="rolPrincipal"
                      value={currentVolunteer.rolPrincipal}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                    >
                      {roles.filter(r => r !== "Todos los roles").map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Horas semanales</label>
                    <select
                      name="horasSemanales"
                      value={currentVolunteer.horasSemanales}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                    >
                      {horasSemanales.map((horas) => (
                        <option key={horas} value={horas}>{horas} horas</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      name="esta_activo"
                      value={currentVolunteer.esta_activo}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: "esta_activo",
                          value: e.target.value === "true"
                        }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value={true}>Activo</option>
                      <option value={false}>Inactivo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={currentVolunteer.fechaInicio}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad</label>
                    <div className="grid grid-cols-2 gap-2">
                      {diasSemana.map((dia) => (
                        <div key={dia} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`disponibilidad-${dia}`}
                            name={dia}
                            checked={(currentVolunteer.disponibilidad || []).includes(dia)}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                          />
                          <label htmlFor={`disponibilidad-${dia}`} className="ml-2 block text-sm text-gray-700">
                            {dia}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preferencia horaria</label>
                    <select
                      name="preferenciaHoraria"
                      value={currentVolunteer.preferenciaHoraria}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer"
                    >
                      {horarios.map((horario) => (
                        <option key={horario} value={horario}>{horario}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Habilidades y Motivación */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Habilidades y conocimientos</label>
                  <textarea
                    name="habilidades"
                    value={currentVolunteer.habilidades}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivación para ser voluntario</label>
                  <textarea
                    name="motivacion"
                    value={currentVolunteer.motivacion}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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

export default VoluntariosAdmin;