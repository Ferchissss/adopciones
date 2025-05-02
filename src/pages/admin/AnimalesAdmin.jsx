import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";
import { FaEye, FaEdit, FaTimes, FaPaw, FaVenusMars, FaWeight, FaCalendarAlt, FaNotesMedical, FaClipboardList, FaHeart } from "react-icons/fa";
import MiniCarrusel from "../../components/administradorcompon/AdminCarrusel";

const AnimalesAdmin = () => {
  const [filter, setFilter] = useState("Todos");
  const [speciesFilter, setSpeciesFilter] = useState("Todos");
  const [ageFilter, setAgeFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Función para cargar los animales desde Firestore
  const loadAnimals = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "animales"));
      const querySnapshot = await getDocs(q);
      
      const animalsData = [];
      querySnapshot.forEach((doc) => {
        const animalData = doc.data();
        animalsData.push({
          id: doc.id,
          ...animalData.datosFijos,
          saludActual: animalData.saludActual || {},
          comportamiento: animalData.comportamiento || {}
        });
      });
      
      setAnimals(animalsData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading animals:", err);
      setError("Error al cargar los animales");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredAnimals = animals.filter((animal) => {
    const matchesStatus = filter === "Todos" || animal.estado === filter;
    const matchesSpecies = speciesFilter === "Todos" || animal.especie === speciesFilter;
    const matchesAge =
      ageFilter === "Todas" ||
      (ageFilter === "Cachorro" && animal.unidadEdad === "meses") ||
      (ageFilter === "Adulto" && animal.unidadEdad === "años");
    const matchesSearch =
      searchTerm === "" ||
      animal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSpecies && matchesAge && matchesSearch;
  });

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(e.target.value);
      e.target.value = "";
    }
  };

  const resetFilters = () => {
    setFilter("Todos");
    setSpeciesFilter("Todos");
    setAgeFilter("Todas");
    setSearchTerm("");
  };

  const handleViewAnimal = (animal) => {
    setSelectedAnimal(animal);
    setShowViewModal(true);
  };

  const handleEditAnimal = (animal) => {
    setSelectedAnimal(animal);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedAnimal(null);
  };

  const handleSaveAnimal = async (updatedAnimal) => {
    try {
      setLoading(true);
      
      // Limpiar el objeto antes de guardar
      const cleanData = cleanObject(updatedAnimal);
      
      // Actualizar en Firestore
      await updateDoc(doc(db, "animales", updatedAnimal.id), cleanData);
      
      // Recargar la lista de animales
      await loadAnimals();
      
      closeModal();
    } catch (error) {
      console.error("Error updating animal:", error);
      setError("Error al actualizar el animal");
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar objetos vacíos o con valores por defecto
  const cleanObject = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== "" && obj[key] !== undefined) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          const nestedObj = cleanObject(obj[key]);
          if (Object.keys(nestedObj).length > 0) {
            newObj[key] = nestedObj;
          }
        } else if (Array.isArray(obj[key])) {
          if (obj[key].length > 0) {
            newObj[key] = obj[key];
          }
        } else {
          newObj[key] = obj[key];
        }
      }
    });
    return newObj;
  };

  return (
    <div className="flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        {/* Header */}
        <AdminHeader
          title="Animales"
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Contenido principal */}
        <div className="p-6 mt-16">
          {/* Título y botón */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Animales</h1>
            <button 
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer"
              onClick={() => navigate("/admin/animales/nuevo")}
            >
              + Nuevo Animal
            </button>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar animales..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              onKeyDown={handleSearch}
            />
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            >
              <option value="Todos">Todas las especies</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Conejo">Conejo</option>
              <option value="Ave">Ave</option>
              <option value="Otro">Otro</option>
            </select>
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
            >
              <option value="Todas">Todas las edades</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Adulto">Adulto</option>
            </select>
            <button
              onClick={resetFilters}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>

          {/* Filtros de estado */}
          <div className="flex space-x-4 mb-6">
            {["Todos", "Disponible", "En adopción", "Adoptado", "En tratamiento"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    filter === status
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>

          {/* Mostrar error si existe */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Mostrar loading si está cargando */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            /* Tarjetas de animales */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAnimals.map((animal) => {
                // Determinar el color del estado
                let statusColor = "bg-gray-200 text-gray-800";
                if (animal.estado === "Disponible") statusColor = "bg-green-200 text-green-800";
                else if (animal.estado === "En adopción") statusColor = "bg-blue-200 text-blue-800";
                else if (animal.estado === "Adoptado") statusColor = "bg-purple-200 text-purple-800";
                else if (animal.estado === "En tratamiento") statusColor = "bg-yellow-200 text-yellow-800";

                return (
                  <div
                    key={animal.id}
                    className="bg-white shadow-md rounded-lg p-4 flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewAnimal(animal)}
                  >
                    <div className="h-48 overflow-hidden mb-2">
                      <MiniCarrusel images={animal.fotos} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">{animal.nombre}</h2>
                    <p className="text-sm text-gray-600">{animal.especie} - {animal.raza || 'Sin raza especificada'}</p>
                    <p className="text-sm text-gray-600">ID: {animal.id}</p>
                    <p className="text-sm text-gray-600">Edad: {animal.edad} {animal.unidadEdad}</p>
                    <p className="text-sm text-gray-600">Sexo: {animal.sexo}</p>
                    <span
                      className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${statusColor}`}
                    >
                      {animal.estado}
                    </span>
                    <div className="flex justify-between items-center mt-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAnimal(animal);
                        }}
                        className="flex items-center gap-1 text-emerald-600 hover:underline cursor-pointer"
                      >
                        <FaEye /> Ver
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAnimal(animal);
                        }}
                        className="flex items-center gap-1 text-gray-600 hover:underline cursor-pointer"
                      >
                        <FaEdit /> Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modales */}
        {showViewModal && selectedAnimal && (
          <ViewAnimalModal 
            animal={selectedAnimal} 
            onClose={closeModal} 
          />
        )}

        {showEditModal && selectedAnimal && (
          <EditAnimalModal 
            animal={selectedAnimal} 
            onClose={closeModal}
            onSave={handleSaveAnimal}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

// Componente para el modal de visualización
const ViewAnimalModal = ({ animal, onClose }) => {
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado */}
        <div className="bg-emerald-600 text-white p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaPaw /> {animal.nombre}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 cursor-pointer">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1 - Información básica */}
            <div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2 flex items-center gap-2">
                <FaClipboardList /> Información Básica
              </h3>
              
              <div className="space-y-4">
                <InfoItem label="ID" value={animal.id} />
                <InfoItem label="Especie" value={animal.especie} />
                <InfoItem label="Raza" value={animal.raza || "No especificada"} />
                <InfoItem label="Edad" value={`${animal.edad || "?"} ${animal.unidadEdad || ""}`} />
                <InfoItem label="Sexo" value={animal.sexo || "No especificado"} icon={<FaVenusMars />} />
                <InfoItem label="Color" value={animal.color || "No especificado"} />
                <InfoItem label="Tamaño" value={animal.tamaño || "No especificado"} />
                <InfoItem label="Peso" value={`${animal.peso || "?"} kg`} icon={<FaWeight />} />
                <InfoItem 
                  label="Estado" 
                  value={animal.estado} 
                  customClass={animal.estado === "Disponible" ? "bg-green-200 text-green-800" : 
                               animal.estado === "En adopción" ? "bg-blue-200 text-blue-800" :
                               animal.estado === "Adoptado" ? "bg-purple-200 text-purple-800" :
                               "bg-yellow-200 text-yellow-800"}
                />
                <InfoItem label="Fecha de ingreso" value={formatDate(animal.fechaIngreso)} icon={<FaCalendarAlt />} />
                <InfoItem label="Procedencia" value={animal.procedencia || "No especificada"} />
                <InfoItem label="Descripción" value={animal.descripcion || "No hay descripción"} />
              </div>
            </div>

            {/* Columna 2 - Información de salud */}
            <div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2 flex items-center gap-2">
                <FaNotesMedical /> Salud
              </h3>
              
              <div className="space-y-4">
                <InfoItem label="Estado general" value={animal.saludActual?.estadoGeneral || "No especificado"} />
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Vacunación</h4>
                  <div className="ml-4 space-y-2">
                    <CheckInfoItem 
                      checked={animal.saludActual?.vacunacion?.rabia?.aplicada} 
                      label="Rabia" 
                      date={animal.saludActual?.vacunacion?.rabia?.fecha ? formatDate(animal.saludActual.vacunacion.rabia.fecha) : null} 
                    />
                    <CheckInfoItem 
                      checked={animal.saludActual?.vacunacion?.leucemia?.aplicada} 
                      label="Leucemia" 
                      date={animal.saludActual?.vacunacion?.leucemia?.fecha ? formatDate(animal.saludActual.vacunacion.leucemia.fecha) : null} 
                    />
                    <CheckInfoItem 
                      checked={animal.saludActual?.vacunacion?.polivalente?.aplicada} 
                      label="Polivalente" 
                      date={animal.saludActual?.vacunacion?.polivalente?.fecha ? formatDate(animal.saludActual.vacunacion.polivalente.fecha) : null} 
                    />
                    {animal.saludActual?.vacunacion?.otra?.aplicada && (
                      <CheckInfoItem 
                        checked 
                        label={animal.saludActual.vacunacion.otra.nombre || "Otra vacuna"} 
                        date={animal.saludActual.vacunacion.otra.fecha ? formatDate(animal.saludActual.vacunacion.otra.fecha) : null} 
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Desparasitación</h4>
                  <div className="ml-4 space-y-2">
                    <CheckInfoItem 
                      checked={animal.saludActual?.desparasitacion?.interna?.aplicada} 
                      label="Interna" 
                      date={animal.saludActual?.desparasitacion?.interna?.fecha ? formatDate(animal.saludActual.desparasitacion.interna.fecha) : null} 
                    />
                    <CheckInfoItem 
                      checked={animal.saludActual?.desparasitacion?.externa?.aplicada} 
                      label="Externa" 
                      date={animal.saludActual?.desparasitacion?.externa?.fecha ? formatDate(animal.saludActual.desparasitacion.externa.fecha) : null} 
                    />
                  </div>
                </div>
                
                <InfoItem 
                  label="Esterilización" 
                  value={animal.saludActual?.esterilizacion === "Esterilizado" ? 
                    `Sí (${animal.saludActual?.fechaEsterilizacion ? formatDate(animal.saludActual.fechaEsterilizacion) : "sin fecha"})` : 
                    animal.saludActual?.esterilizacion || "No especificado"} 
                />
                
                <InfoItem label="Condiciones médicas" value={animal.saludActual?.condicionesMedicas || "Ninguna conocida"} />
                <InfoItem label="Alergias" value={animal.saludActual?.alergias || "Ninguna conocida"} />
                <InfoItem label="Dieta especial" value={animal.saludActual?.dietaEspecial || "Ninguna"} />
              </div>
            </div>

            {/* Columna 3 - Comportamiento y fotos */}
            <div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2 flex items-center gap-2">
                <FaHeart /> Comportamiento
              </h3>
              
              <div className="space-y-4 mb-6">
                <InfoItem label="Temperamento" value={animal.comportamiento?.temperamento || "No especificado"} />
                <InfoItem label="Con perros" value={animal.comportamiento?.compatibilidad?.perros || "No especificado"} />
                <InfoItem label="Con gatos" value={animal.comportamiento?.compatibilidad?.gatos || "No especificado"} />
                <InfoItem label="Nivel de entrenamiento" value={animal.comportamiento?.nivelEntrenamiento || "No especificado"} />
                <InfoItem label="Necesidades especiales" value={animal.comportamiento?.necesidadesEspeciales || "Ninguna"} />
                <InfoItem label="Notas de comportamiento" value={animal.comportamiento?.notasComportamiento || "No hay notas"} />
              </div>

              <h3 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2">
                Fotos
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {animal.fotos && animal.fotos.length > 0 ? (
                  animal.fotos.map((foto, index) => (
                    <div key={index} className="bg-gray-200 rounded-lg h-32 overflow-hidden">
                      <img src={foto} alt={`${animal.nombre} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500">
                    No hay fotos disponibles
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botón de cierre */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para el modal de edición
const EditAnimalModal = ({ animal, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    id: animal.id,
    // Información básica
    nombre: animal.nombre || "",
    especie: animal.especie || "",
    raza: animal.raza || "",
    edad: animal.edad || "",
    unidadEdad: animal.unidadEdad || "años",
    sexo: animal.sexo || "",
    color: animal.color || "",
    tamaño: animal.tamaño || "",
    peso: animal.peso || "",
    estado: animal.estado || "Disponible",
    descripcion: animal.descripcion || "",
    procedencia: animal.procedencia || "",
    notasProcedencia: animal.notasProcedencia || "",
    fechaIngreso: animal.fechaIngreso || new Date().toISOString().split('T')[0],
    fotos: animal.fotos || [],
    
    // Información de salud
    saludActual: {
      estadoGeneral: animal.saludActual?.estadoGeneral || "",
      vacunacion: {
        rabia: animal.saludActual?.vacunacion?.rabia || { fecha: "", aplicada: false },
        leucemia: animal.saludActual?.vacunacion?.leucemia || { fecha: "", aplicada: false },
        polivalente: animal.saludActual?.vacunacion?.polivalente || { fecha: "", aplicada: false },
        otra: animal.saludActual?.vacunacion?.otra || { fecha: "", aplicada: false, nombre: "" }
      },
      desparasitacion: {
        interna: animal.saludActual?.desparasitacion?.interna || { fecha: "", aplicada: false },
        externa: animal.saludActual?.desparasitacion?.externa || { fecha: "", aplicada: false }
      },
      esterilizacion: animal.saludActual?.esterilizacion || "",
      fechaEsterilizacion: animal.saludActual?.fechaEsterilizacion || "",
      condicionesMedicas: animal.saludActual?.condicionesMedicas || "",
      alergias: animal.saludActual?.alergias || "",
      dietaEspecial: animal.saludActual?.dietaEspecial || ""
    },
    
    // Comportamiento
    comportamiento: {
      temperamento: animal.comportamiento?.temperamento || "",
      compatibilidad: {
        perros: animal.comportamiento?.compatibilidad?.perros || "",
        gatos: animal.comportamiento?.compatibilidad?.gatos || ""
      },
      nivelEntrenamiento: animal.comportamiento?.nivelEntrenamiento || "",
      necesidadesEspeciales: animal.comportamiento?.necesidadesEspeciales || "",
      notasComportamiento: animal.comportamiento?.notasComportamiento || ""
    },
    
    // Nuevas fotos para subir
    newPhotos: [],
    previewImages: animal.fotos || []
  });

  const [error, setError] = useState("");

  // Función para subir imágenes a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "animales_preset");
    formData.append("cloud_name", "dsglcrfw9");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsglcrfw9/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir la imagen");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaludInputChange = (field, value, subField = null) => {
    if (subField) {
      setFormData({
        ...formData,
        saludActual: {
          ...formData.saludActual,
          [field]: {
            ...formData.saludActual[field],
            [subField]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        saludActual: {
          ...formData.saludActual,
          [field]: value
        }
      });
    }
  };

  const handleComportamientoInputChange = (field, value, subField = null) => {
    if (subField) {
      setFormData({
        ...formData,
        comportamiento: {
          ...formData.comportamiento,
          [field]: {
            ...formData.comportamiento[field],
            [subField]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        comportamiento: {
          ...formData.comportamiento,
          [field]: value
        }
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      newPhotos: [...formData.newPhotos, ...files],
      previewImages: [...formData.previewImages, ...newPreviews]
    });
  };

  const removeImage = async (index) => {
    // No eliminamos físicamente la imagen de Cloudinary, solo la quitamos de la lista
    const newPreviews = [...formData.previewImages];
    const isNewPhoto = index >= formData.fotos.length;
    
    if (isNewPhoto) {
      // Es una foto nueva que no se ha subido aún
      const newPhotos = [...formData.newPhotos];
      newPhotos.splice(index - formData.fotos.length, 1);
      newPreviews.splice(index, 1);
      
      setFormData({
        ...formData,
        newPhotos,
        previewImages: newPreviews
      });
    } else {
      // Es una foto existente que queremos eliminar
      const fotos = [...formData.fotos];
      fotos.splice(index, 1);
      newPreviews.splice(index, 1);
      
      setFormData({
        ...formData,
        fotos,
        previewImages: newPreviews
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.especie || !formData.fechaIngreso) {
      setError("Nombre, especie y fecha de ingreso son campos obligatorios");
      return;
    }

    try {
      // Subir nuevas imágenes a Cloudinary
      const newPhotoUrls = [];
      for (const photo of formData.newPhotos) {
        const url = await uploadImageToCloudinary(photo);
        newPhotoUrls.push(url);
      }

      // Combinar fotos existentes con las nuevas
      const allPhotos = [...formData.fotos, ...newPhotoUrls];

      // Crear estructura de datos para Firebase
      const animalData = {
        datosFijos: {
          nombre: formData.nombre,
          especie: formData.especie,
          raza: formData.raza,
          edad: formData.edad ? parseInt(formData.edad) : null,
          unidadEdad: formData.unidadEdad,
          sexo: formData.sexo,
          tamaño: formData.tamaño,
          color: formData.color,
          peso: formData.peso ? parseFloat(formData.peso) : null,
          fechaIngreso: formData.fechaIngreso,
          estado: formData.estado,
          descripcion: formData.descripcion,
          procedencia: formData.procedencia,
          notasProcedencia: formData.notasProcedencia,
          fotos: allPhotos,
          fechaActualizacion: new Date().toISOString()
        },
        saludActual: {
          estadoGeneral: formData.saludActual.estadoGeneral,
          vacunacion: {
            rabia: formData.saludActual.vacunacion.rabia.aplicada ? formData.saludActual.vacunacion.rabia : null,
            leucemia: formData.saludActual.vacunacion.leucemia.aplicada ? formData.saludActual.vacunacion.leucemia : null,
            polivalente: formData.saludActual.vacunacion.polivalente.aplicada ? formData.saludActual.vacunacion.polivalente : null,
            otra: formData.saludActual.vacunacion.otra.aplicada ? formData.saludActual.vacunacion.otra : null
          },
          desparasitacion: {
            interna: formData.saludActual.desparasitacion.interna.aplicada ? formData.saludActual.desparasitacion.interna : null,
            externa: formData.saludActual.desparasitacion.externa.aplicada ? formData.saludActual.desparasitacion.externa : null
          },
          esterilizacion: formData.saludActual.esterilizacion,
          fechaEsterilizacion: formData.saludActual.fechaEsterilizacion,
          condicionesMedicas: formData.saludActual.condicionesMedicas,
          alergias: formData.saludActual.alergias,
          dietaEspecial: formData.saludActual.dietaEspecial
        },
        comportamiento: {
          temperamento: formData.comportamiento.temperamento,
          compatibilidad: {
            perros: formData.comportamiento.compatibilidad.perros,
            gatos: formData.comportamiento.compatibilidad.gatos
          },
          nivelEntrenamiento: formData.comportamiento.nivelEntrenamiento,
          necesidadesEspeciales: formData.comportamiento.necesidadesEspeciales,
          notasComportamiento: formData.comportamiento.notasComportamiento
        }
      };

      // Llamar a la función onSave con los datos actualizados
      await onSave({
        id: formData.id,
        ...animalData
      });

    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setError("Error al guardar los cambios: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado */}
        <div className="bg-emerald-600 text-white p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaEdit /> Editar {animal.nombre}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 cursor-pointer">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Mostrar error si existe */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1 - Información básica */}
            <div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2">
                Información Básica
              </h3>
              
              <div className="space-y-4">
                <FormInput 
                  label="Nombre" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleInputChange} 
                  required 
                />
                
                <FormSelect 
                  label="Especie" 
                  name="especie" 
                  value={formData.especie} 
                  onChange={handleInputChange}
                  options={["", "Perro", "Gato", "Conejo", "Ave", "Otro"]}
                  required
                />
                
                <FormInput 
                  label="Raza" 
                  name="raza" 
                  value={formData.raza} 
                  onChange={handleInputChange} 
                />
                
                <div className="flex gap-2">
                  <FormInput 
                    label="Edad" 
                    name="edad" 
                    type="number" 
                    value={formData.edad} 
                    onChange={handleInputChange} 
                  />
                  <FormSelect 
                    label="Unidad" 
                    name="unidadEdad" 
                    value={formData.unidadEdad} 
                    onChange={handleInputChange}
                    options={["años", "meses", "días"]}
                  />
                </div>
                
                <FormSelect 
                  label="Sexo" 
                  name="sexo" 
                  value={formData.sexo} 
                  onChange={handleInputChange}
                  options={["", "Macho", "Hembra"]}
                />
                
                <FormInput 
                  label="Color" 
                  name="color" 
                  value={formData.color} 
                  onChange={handleInputChange} 
                />
                
                <FormSelect 
                  label="Tamaño" 
                  name="tamaño" 
                  value={formData.tamaño} 
                  onChange={handleInputChange}
                  options={["", "Pequeño", "Mediano", "Grande"]}
                />
                
                <FormInput 
                  label="Peso (kg)" 
                  name="peso" 
                  type="number" 
                  step="0.1" 
                  value={formData.peso} 
                  onChange={handleInputChange} 
                />
                
                <FormSelect 
                  label="Estado" 
                  name="estado" 
                  value={formData.estado} 
                  onChange={handleInputChange}
                  options={["Disponible", "En adopción", "Adoptado", "En tratamiento"]}
                />
                
                <FormInput 
                  label="Fecha de ingreso" 
                  name="fechaIngreso" 
                  type="date" 
                  value={formData.fechaIngreso} 
                  onChange={handleInputChange} 
                  required
                />
                
                <FormSelect 
                  label="Procedencia" 
                  name="procedencia" 
                  value={formData.procedencia} 
                  onChange={handleInputChange}
                  options={["", "Abandono", "Rescate", "Donación", "Nacido en el refugio"]}
                />
                
                <FormTextarea 
                  label="Descripción" 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleInputChange} 
                />
                
                <FormTextarea 
                  label="Notas sobre procedencia" 
                  name="notasProcedencia" 
                  value={formData.notasProcedencia} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* Columna 2 - Información de salud */}
            <div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2">
                Salud
              </h3>
              
              <div className="space-y-4">
                <FormSelect 
                  label="Estado general" 
                  name="estadoGeneral" 
                  value={formData.saludActual.estadoGeneral} 
                  onChange={(e) => handleSaludInputChange("estadoGeneral", e.target.value)}
                  options={["", "Excelente", "Bueno", "Regular", "Malo", "Crítico"]}
                />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Vacunación</h4>
                  
                  <FormCheckbox 
                    label="Rabia" 
                    name="rabia" 
                    checked={formData.saludActual.vacunacion.rabia.aplicada} 
                    onChange={(e) => handleSaludInputChange("vacunacion", {
                      ...formData.saludActual.vacunacion,
                      rabia: {
                        ...formData.saludActual.vacunacion.rabia,
                        aplicada: e.target.checked
                      }
                    })}
                  />
                  {formData.saludActual.vacunacion.rabia.aplicada && (
                    <FormInput 
                      type="date" 
                      label="Fecha de vacunación rabia" 
                      name="rabiaFecha" 
                      value={formData.saludActual.vacunacion.rabia.fecha} 
                      onChange={(e) => handleSaludInputChange("vacunacion", {
                        ...formData.saludActual.vacunacion,
                        rabia: {
                          ...formData.saludActual.vacunacion.rabia,
                          fecha: e.target.value
                        }
                      })}
                      small
                    />
                  )}
                  
                  <FormCheckbox 
                    label="Leucemia (felina)" 
                    name="leucemia" 
                    checked={formData.saludActual.vacunacion.leucemia.aplicada} 
                    onChange={(e) => handleSaludInputChange("vacunacion", {
                      ...formData.saludActual.vacunacion,
                      leucemia: {
                        ...formData.saludActual.vacunacion.leucemia,
                        aplicada: e.target.checked
                      }
                    })}
                  />
                  {formData.saludActual.vacunacion.leucemia.aplicada && (
                    <FormInput 
                      type="date" 
                      label="Fecha de vacunación leucemia" 
                      name="leucemiaFecha" 
                      value={formData.saludActual.vacunacion.leucemia.fecha} 
                      onChange={(e) => handleSaludInputChange("vacunacion", {
                        ...formData.saludActual.vacunacion,
                        leucemia: {
                          ...formData.saludActual.vacunacion.leucemia,
                          fecha: e.target.value
                        }
                      })}
                      small
                    />
                  )}
                  
                  <FormCheckbox 
                    label="Polivalente" 
                    name="polivalente" 
                    checked={formData.saludActual.vacunacion.polivalente.aplicada} 
                    onChange={(e) => handleSaludInputChange("vacunacion", {
                      ...formData.saludActual.vacunacion,
                      polivalente: {
                        ...formData.saludActual.vacunacion.polivalente,
                        aplicada: e.target.checked
                      }
                    })}
                  />
                  {formData.saludActual.vacunacion.polivalente.aplicada && (
                    <FormInput 
                      type="date" 
                      label="Fecha de vacunación polivalente" 
                      name="polivalenteFecha" 
                      value={formData.saludActual.vacunacion.polivalente.fecha} 
                      onChange={(e) => handleSaludInputChange("vacunacion", {
                        ...formData.saludActual.vacunacion,
                        polivalente: {
                          ...formData.saludActual.vacunacion.polivalente,
                          fecha: e.target.value
                        }
                      })}
                      small
                    />
                  )}
                  
                  <FormCheckbox 
                    label="Otra vacuna" 
                    name="otraVacuna" 
                    checked={formData.saludActual.vacunacion.otra.aplicada} 
                    onChange={(e) => handleSaludInputChange("vacunacion", {
                      ...formData.saludActual.vacunacion,
                      otra: {
                        ...formData.saludActual.vacunacion.otra,
                        aplicada: e.target.checked
                      }
                    })}
                  />
                  {formData.saludActual.vacunacion.otra.aplicada && (
                    <>
                      <FormInput 
                        type="text" 
                        label="Nombre de la vacuna" 
                        name="otraVacunaNombre" 
                        value={formData.saludActual.vacunacion.otra.nombre} 
                        onChange={(e) => handleSaludInputChange("vacunacion", {
                          ...formData.saludActual.vacunacion,
                          otra: {
                            ...formData.saludActual.vacunacion.otra,
                            nombre: e.target.value
                          }
                        })}
                        small
                      />
                      <FormInput 
                        type="date" 
                        label="Fecha de otra vacuna" 
                        name="otraVacunaFecha" 
                        value={formData.saludActual.vacunacion.otra.fecha} 
                        onChange={(e) => handleSaludInputChange("vacunacion", {
                          ...formData.saludActual.vacunacion,
                          otra: {
                            ...formData.saludActual.vacunacion.otra,
                            fecha: e.target.value
                          }
                        })}
                        small
                      />
                    </>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Desparasitación</h4>
                  
                  <FormCheckbox 
                    label="Interna" 
                    name="desparasitacionInterna" 
                    checked={formData.saludActual.desparasitacion.interna.aplicada} 
                    onChange={(e) => handleSaludInputChange("desparasitacion", {
                      ...formData.saludActual.desparasitacion,
                      interna: {
                        ...formData.saludActual.desparasitacion.interna,
                        aplicada: e.target.checked
                      }
                    })}
                  />
                  {formData.saludActual.desparasitacion.interna.aplicada && (
                    <FormInput 
                      type="date" 
                      label="Fecha desparasitación interna" 
                      name="desparasitacionInternaFecha" 
                      value={formData.saludActual.desparasitacion.interna.fecha} 
                      onChange={(e) => handleSaludInputChange("desparasitacion", {
                        ...formData.saludActual.desparasitacion,
                        interna: {
                          ...formData.saludActual.desparasitacion.interna,
                          fecha: e.target.value
                        }
                      })}
                      small
                    />
                  )}
                  
                  <FormCheckbox 
                    label="Externa" 
                    name="desparasitacionExterna" 
                    checked={formData.saludActual.desparasitacion.externa.aplicada} 
                    onChange={(e) => handleSaludInputChange("desparasitacion", {
                      ...formData.saludActual.desparasitacion,
                      externa: {
                        ...formData.saludActual.desparasitacion.externa,
                        aplicada: e.target.checked
                      }
                    })}
                  />
                  {formData.saludActual.desparasitacion.externa.aplicada && (
                    <FormInput 
                      type="date" 
                      label="Fecha desparasitación externa" 
                      name="desparasitacionExternaFecha" 
                      value={formData.saludActual.desparasitacion.externa.fecha} 
                      onChange={(e) => handleSaludInputChange("desparasitacion", {
                        ...formData.saludActual.desparasitacion,
                        externa: {
                          ...formData.saludActual.desparasitacion.externa,
                          fecha: e.target.value
                        }
                      })}
                      small
                    />
                  )}
                </div>
                
                <FormSelect 
                  label="Esterilización" 
                  name="esterilizacion" 
                  value={formData.saludActual.esterilizacion} 
                  onChange={(e) => handleSaludInputChange("esterilizacion", e.target.value)}
                  options={["", "Esterilizado", "No esterilizado", "Pendiente"]}
                />
                {(formData.saludActual.esterilizacion === "Esterilizado" || formData.saludActual.esterilizacion === "Pendiente") && (
                  <FormInput 
                    type="date" 
                    label="Fecha de esterilización" 
                    name="fechaEsterilizacion" 
                    value={formData.saludActual.fechaEsterilizacion} 
                    onChange={(e) => handleSaludInputChange("fechaEsterilizacion", e.target.value)}
                  />
                )}
                
                <FormTextarea 
                  label="Condiciones médicas" 
                  name="condicionesMedicas" 
                  value={formData.saludActual.condicionesMedicas} 
                  onChange={(e) => handleSaludInputChange("condicionesMedicas", e.target.value)} 
                />
                
                <FormTextarea 
                  label="Alergias conocidas" 
                  name="alergias" 
                  value={formData.saludActual.alergias} 
                  onChange={(e) => handleSaludInputChange("alergias", e.target.value)} 
                />
                
                <FormTextarea 
                  label="Dieta especial" 
                  name="dietaEspecial" 
                  value={formData.saludActual.dietaEspecial} 
                  onChange={(e) => handleSaludInputChange("dietaEspecial", e.target.value)} 
                />
              </div>
            </div>

            {/* Columna 3 - Comportamiento y fotos */}
            <div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2">
                Comportamiento
              </h3>
              
              <div className="space-y-4 mb-6">
                <FormSelect 
                  label="Temperamento" 
                  name="temperamento" 
                  value={formData.comportamiento.temperamento} 
                  onChange={(e) => handleComportamientoInputChange("temperamento", e.target.value)}
                  options={["", "Tranquilo", "Activo", "Nervioso", "Amigable", "Tímido", "Agresivo"]}
                />
                
                <FormSelect 
                  label="Compatibilidad con perros" 
                  name="compatibilidadPerros" 
                  value={formData.comportamiento.compatibilidad.perros} 
                  onChange={(e) => handleComportamientoInputChange("compatibilidad", e.target.value, "perros")}
                  options={["", "Si", "No", "Desconocido"]}
                />
                
                <FormSelect 
                  label="Compatibilidad con gatos" 
                  name="compatibilidadGatos" 
                  value={formData.comportamiento.compatibilidad.gatos} 
                  onChange={(e) => handleComportamientoInputChange("compatibilidad", e.target.value, "gatos")}
                  options={["", "Si", "No", "Desconocido"]}
                />
                
                <FormSelect 
                  label="Nivel de entrenamiento" 
                  name="nivelEntrenamiento" 
                  value={formData.comportamiento.nivelEntrenamiento} 
                  onChange={(e) => handleComportamientoInputChange("nivelEntrenamiento", e.target.value)}
                  options={["", "Básico", "Intermedio", "Avanzado", "Ninguno"]}
                />
                
                <FormTextarea 
                  label="Necesidades especiales" 
                  name="necesidadesEspeciales" 
                  value={formData.comportamiento.necesidadesEspeciales} 
                  onChange={(e) => handleComportamientoInputChange("necesidadesEspeciales", e.target.value)} 
                />
                
                <FormTextarea 
                  label="Notas de comportamiento" 
                  name="notasComportamiento" 
                  value={formData.comportamiento.notasComportamiento} 
                  onChange={(e) => handleComportamientoInputChange("notasComportamiento", e.target.value)} 
                />
              </div>

              <h3 className="text-xl font-semibold text-emerald-800 mb-4 border-b pb-2">
                Fotos
              </h3>
              
              <div className="mb-4">
                <label className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700 mb-2">
                  <span className="flex items-center">
                    <span className="material-icons-outlined mr-2">add_photo_alternate</span>
                    Agregar foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500">Sube fotos adicionales del animal</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {formData.previewImages.length > 0 ? (
                  formData.previewImages.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-gray-500">
                    No hay fotos disponibles
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 flex items-center justify-center min-w-32 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componentes auxiliares
const InfoItem = ({ label, value, icon, customClass = "" }) => (
  <div className="flex flex-col">
    <span className="font-medium text-gray-700">{label}</span>
    <span className={`flex items-center gap-1 ${customClass}`}>
      {icon} {value || "No especificado"}
    </span>
  </div>
);

const CheckInfoItem = ({ checked, label, date }) => (
  <div className="flex items-center gap-2">
    <span className={`inline-block w-4 h-4 border rounded ${checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400'}`}>
      {checked && <span className="text-white text-xs flex items-center justify-center">✓</span>}
    </span>
    <span>{label}</span>
    {date && <span className="text-sm text-gray-500">({date})</span>}
  </div>
);

const FormInput = ({ label, name, type = "text", value, onChange, required = false, small = false }) => (
  <div className="flex flex-col">
    <label className="font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-300 ${small ? 'text-sm py-1' : ''}`}
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, required = false }) => (
  <div className="flex flex-col">
    <label className="font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
    >
      {options.map(option => (
        <option key={option} value={option}>{option || "Seleccione..."}</option>
      ))}
    </select>
  </div>
);

const FormTextarea = ({ label, name, value, onChange, rows = 3 }) => (
  <div className="flex flex-col">
    <label className="font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-emerald-300"
    />
  </div>
);

const FormCheckbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
    />
    <label className="text-gray-700">{label}</label>
  </div>
);

export default AnimalesAdmin;