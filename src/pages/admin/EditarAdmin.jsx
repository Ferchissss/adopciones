import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { Calendar, Home, Clipboard, User, Mail, Phone, MapPin, PawPrint, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";

const EditarAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adopcion, setAdopcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSeguimientoForm, setShowSeguimientoForm] = useState(false);
  const [newSeguimiento, setNewSeguimiento] = useState({
    tipo: "",
    comentario: "",
    estadoGeneralAnimal: ""
  });
  const [errors, setErrors] = useState({});

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Cargar los datos de la adopción
  useEffect(() => {
    const fetchAdopcion = async () => {
      try {
        const docRef = doc(db, "solicitudesAdopcion", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdopcion({
            id: docSnap.id,
            ...data,
            fechaAdopcion: data.fechaAdopcion?.toDate() || null,
            formulario: {
              ...data.formulario,
              fechaEnvio: data.formulario?.fechaEnvio?.toDate() || null,
              fechaRevision: data.formulario?.fechaRevision?.toDate() || null
            },
            seguimiento: data.seguimiento?.map(seg => ({
              ...seg,
              fecha: seg.fecha?.toDate() || null
            })) || []
          });
        } else {
          console.log("No such document!");
          navigate("/admin/adopciones");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdopcion();
  }, [id, navigate]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("es-ES");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("formulario.")) {
      const field = name.split(".")[1];
      setAdopcion(prev => ({
        ...prev,
        formulario: {
          ...prev.formulario,
          [field]: value,
          ...(field === "estadoFormulario" && value !== prev.formulario.estadoFormulario ? {
            fechaRevision: new Date()
          } : {})
        }
      }));
    } else if (name === "estado") {
        // Si el estado cambia a "completada", establece la fecha actual
        setAdopcion(prev => ({
          ...prev,
          [name]: value,
          ...(value === "completada" && !prev.fechaAdopcion ? {
            fechaAdopcion: new Date()
          } : {})
        }));
      } else {
        setAdopcion(prev => ({
          ...prev,
          [name]: value
        }));
      }
  };

  const handleSeguimientoChange = (e) => {
    const { name, value } = e.target;
    setNewSeguimiento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!adopcion.estado) newErrors.estado = "Este campo es requerido";
    if (adopcion.formulario && !adopcion.formulario.estadoFormulario) {
      newErrors.estadoFormulario = "Este campo es requerido";
    }

    // Validar fecha si el estado es "completada"
    if (adopcion.estado === "completada" && !adopcion.fechaAdopcion) {
        newErrors.fechaAdopcion = "La fecha de adopción es requerida para completar el proceso";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const adopcionRef = doc(db, "solicitudesAdopcion", id);
      
      const updateData = {
        estado: adopcion.estado,
        notas: adopcion.notas || "",
        formulario: {
          ...adopcion.formulario,
          estadoFormulario: adopcion.formulario.estadoFormulario,
          fechaRevision: serverTimestamp()
        }
      };
      
      // Si el estado es "completada", asegurar que se guarde la fecha
        if (adopcion.estado === "completada") {
            updateData.fechaAdopcion = adopcion.fechaAdopcion || serverTimestamp();
        } else if (adopcion.fechaAdopcion) {
            updateData.fechaAdopcion = adopcion.fechaAdopcion;
        }
      
      await updateDoc(adopcionRef, updateData);
      
      alert("Adopción actualizada correctamente");
      navigate("/admin/adopciones");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Error al actualizar la adopción");
    }
  };

  const handleAddSeguimiento = async (e) => {
    e.preventDefault();
    
    if (!newSeguimiento.tipo || !newSeguimiento.comentario) {
      setErrors({
        seguimiento: "Tipo y comentario son requeridos"
      });
      return;
    }
    
    try {
      const adopcionRef = doc(db, "solicitudesAdopcion", id);
      // Crear el objeto de seguimiento sin serverTimestamp
        const seguimientoData = {
            ...newSeguimiento,
            fecha: new Date() // Usamos la fecha del cliente temporalmente
        };
        await updateDoc(adopcionRef, {
            seguimiento: arrayUnion(seguimientoData)
          });
      
      // Actualizar el estado local con la fecha del cliente
        setAdopcion(prev => ({
            ...prev,
            seguimiento: [
            ...prev.seguimiento,
            seguimientoData
            ]
        }));
      
      setNewSeguimiento({
        tipo: "",
        comentario: "",
        estadoGeneralAnimal: ""
      });
      setShowSeguimientoForm(false);
      setErrors({});
    } catch (error) {
      console.error("Error adding seguimiento:", error);
      alert("Error al añadir seguimiento");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isCollapsed={isCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
          <AdminHeader title="Editar Adopción" toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
          <div className="p-6 bg-gray-100 min-h-screen" style={{ paddingTop: "80px" }}>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!adopcion) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isCollapsed={isCollapsed} />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
          <AdminHeader title="Editar Adopción" toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
          <div className="p-6 bg-gray-100 min-h-screen" style={{ paddingTop: "80px" }}>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-red-500">No se encontró la adopción solicitada</p>
              <button 
                onClick={() => navigate("/admin/adopciones")}
                className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Volver a Adopciones
              </button>
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
          title={`Editar Adopción: ${adopcion.nombreAnimal}`}
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Content Area */}
        <div className="p-6 bg-gray-100 min-h-screen" style={{ paddingTop: "80px" }}>
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Información de la Adopción</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Sección de información del animal */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-emerald-600" />
                    Información del Animal
                  </h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Nombre:</span> {adopcion.nombreAnimal}</p>
                    <p><span className="font-medium">ID:</span> {adopcion.animalId}</p>
                  </div>
                </div>

                {/* Sección de información del adoptante */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    Información del Adoptante
                  </h3>
                  <div className="space-y-3">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Nombre:</span> {adopcion.nombreCompleto}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Email:</span> {adopcion.correoElectronico}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Teléfono:</span> {adopcion.telefono}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Dirección:</span> {adopcion.direccion}, {adopcion.ciudad}
                    </p>
                  </div>
                </div>

                {/* Sección de información del formulario */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Clipboard className="h-5 w-5 text-emerald-600" />
                    Formulario de Adopción
                  </h3>
                  <div className="space-y-3">
                    <p><span className="font-medium">Fecha de envío:</span> {formatDate(adopcion.formulario?.fechaEnvio)}</p>
                    <p><span className="font-medium">Tipo de vivienda:</span> {adopcion.formulario?.tipoVivienda}</p>
                    <p><span className="font-medium">Tiene patio:</span> {adopcion.formulario?.tienePatio ? "Sí" : "No"}</p>
                    <p><span className="font-medium">Horas solo:</span> {adopcion.formulario?.horasSolo}</p>
                    <p><span className="font-medium">Tiene otros animales:</span> {adopcion.formulario?.tieneOtrosAnimales ? "Sí" : "No"}</p>
                    {adopcion.formulario?.tieneOtrosAnimales && (
                      <p><span className="font-medium">Detalles:</span> {adopcion.formulario?.detallesOtrosAnimales}</p>
                    )}
                    <p><span className="font-medium">Experiencia previa:</span> {adopcion.formulario?.experienciaPrevia}</p>
                    <p><span className="font-medium">Motivación:</span> {adopcion.formulario?.motivación}</p>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado del Formulario
                      </label>
                      <select
                        name="formulario.estadoFormulario"
                        value={adopcion.formulario?.estadoFormulario || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.estadoFormulario ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Seleccione un estado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                      {errors.estadoFormulario && (
                        <p className="mt-1 text-sm text-red-600">{errors.estadoFormulario}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sección de administración */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Home className="h-5 w-5 text-emerald-600" />
                    Administración
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado de la Adopción
                      </label>
                      <select
                        name="estado"
                        value={adopcion.estado || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md ${errors.estado ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Seleccione un estado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en proceso">En proceso</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                        <option value="completada">Completada</option>
                      </select>
                      {errors.estado && (
                        <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
                      )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Adopción
                        </label>
                        <input
                            type="date"
                            name="fechaAdopcion"
                            value={adopcion.fechaAdopcion ? adopcion.fechaAdopcion.toISOString().split('T')[0] : ""}
                            onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setAdopcion(prev => ({ ...prev, fechaAdopcion: date }));
                            }}
                            className={`w-full px-3 py-2 border rounded-md ${
                            errors.fechaAdopcion ? "border-red-500" : "border-gray-300"
                            }`}
                            required={adopcion.estado === "completada"}
                        />
                        {errors.fechaAdopcion && (
                            <p className="mt-1 text-sm text-red-600">{errors.fechaAdopcion}</p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas Adicionales
                      </label>
                      <textarea
                        name="notas"
                        value={adopcion.notas || ""}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección de seguimientos */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Clipboard className="h-5 w-5 text-emerald-600" />
                    Seguimientos
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowSeguimientoForm(!showSeguimientoForm)}
                    className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-2 rounded-md hover:bg-emerald-700"
                  >
                    {showSeguimientoForm ? (
                      <>
                        <X className="h-4 w-4" /> Cancelar
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Añadir Seguimiento
                      </>
                    )}
                  </button>
                </div>

                {showSeguimientoForm && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium mb-3">Nuevo Seguimiento</h4>
                        {/* Reemplazamos el <form> con un <div> */}
                        <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Seguimiento
                            </label>
                            <select
                                name="tipo"
                                value={newSeguimiento.tipo}
                                onChange={handleSeguimientoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Seleccione un tipo</option>
                                <option value="Llamada de verificación">Llamada de verificación</option>
                                <option value="Visita al domicilio">Visita al domicilio</option>
                                <option value="Llamada de control">Llamada de control</option>
                                <option value="Todo en orden">Todo en orden</option>
                                <option value="Problemas detectados">Problemas detectados</option>
                                <option value="Animal devuelto">Animal devuelto</option>
                            </select>
                            </div>

                            {adopcion.estado === "aprobada" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado del Animal
                                </label>
                                <select
                                name="estadoGeneralAnimal"
                                value={newSeguimiento.estadoGeneralAnimal}
                                onChange={handleSeguimientoChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                <option value="">Seleccione un estado</option>
                                <option value="Saludable">Saludable</option>
                                <option value="En observación">En observación</option>
                                <option value="Necesita atención">Necesita atención</option>
                                </select>
                            </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comentario
                            </label>
                            <textarea
                            name="comentario"
                            value={newSeguimiento.comentario}
                            onChange={handleSeguimientoChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                            />
                        </div>

                        {errors.seguimiento && (
                            <p className="mt-2 text-sm text-red-600">{errors.seguimiento}</p>
                        )}

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                            type="button"
                            onClick={() => setShowSeguimientoForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                            Cancelar
                            </button>
                            {/* Cambiamos type="submit" por type="button" y usamos onClick */}
                            <button
                            type="button"
                            onClick={handleAddSeguimiento}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                            >
                            Guardar Seguimiento
                            </button>
                        </div>
                        </div>
                    </div>
                    )}

                {adopcion.seguimiento.length > 0 ? (
                  <div className="space-y-4">
                    {adopcion.seguimiento
                      .sort((a, b) => b.fecha - a.fecha)
                      .map((seg, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{seg.tipo}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(seg.fecha)}
                              </p>
                            </div>
                            {seg.estadoGeneralAnimal && (
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {seg.estadoGeneralAnimal}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm">{seg.comentario}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No hay seguimientos registrados</p>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate("/admin/adopciones")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarAdmin;