import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const NuevoAnimal = () => {
  const [activeTab, setActiveTab] = useState("informacionBasica");
  const [formData, setFormData] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    unidadEdad: "años",
    sexo: "",
    tamaño: "",
    color: "",
    peso: "",
    fechaIngreso: new Date().toISOString().split('T')[0],
    estado: "Disponible",
    descripcion: "",
    procedencia: "",
    notasProcedencia: "",
    salud: {
      estadoGeneral: "",
      vacunacion: {
        rabia: { fecha: "", aplicada: false },
        leucemia: { fecha: "", aplicada: false },
        polivalente: { fecha: "", aplicada: false },
        otra: { fecha: "", aplicada: false, nombre: "" }
      },
      desparasitacion: {
        interna: { fecha: "", aplicada: false },
        externa: { fecha: "", aplicada: false }
      },
      esterilizacion: "",
      fechaEsterilizacion: "",
      condicionesMedicas: "",
      alergias: "",
      dietaEspecial: "",
    },
    comportamiento: {
      temperamento: "",
      compatibilidad: {
        perros: "",
        gatos: ""
      },
      nivelEntrenamiento: "",
      necesidadesEspeciales: "",
      notasComportamiento: "",
    },
    fotos: [],
  });
  useEffect(() => {
    // Establecer fecha actual y estado por defecto al montar el componente
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      fechaIngreso: today,
      estado: "Disponible"
    }));
  }, []);

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Función para subir imágenes a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "animales_preset"); // Reemplaza con tu upload preset
    formData.append("cloud_name", "dsglcrfw9"); // Reemplaza con tu cloud name

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaludInputChange = (field, value, subField = null) => {
    if (subField) {
      setFormData({
        ...formData,
        salud: {
          ...formData.salud,
          [field]: {
            ...formData.salud[field],
            [subField]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        salud: {
          ...formData.salud,
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
    setPreviewImages([...previewImages, ...newPreviews]);
    setFormData({
      ...formData,
      fotos: [...formData.fotos, ...files]
    });
  };

  const removeImage = (index) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
    
    const newFiles = [...formData.fotos];
    newFiles.splice(index, 1);
    setFormData({
      ...formData,
      fotos: newFiles
    });
  };

  const handleSave = async () => {
    // Validación básica
    if (!formData.nombre || !formData.especie || !formData.fechaIngreso) {
      setError("Nombre, especie y fecha de ingreso son campos obligatorios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Subir imágenes a Cloudinary
      const fotosUrls = [];
      for (const foto of formData.fotos) {
        const url = await uploadImageToCloudinary(foto);
        fotosUrls.push(url);
      }

      // Crear estructura de datos para Firebase
      const animalData = {
        datosFijos: cleanObject({
          nombre: formData.nombre,
          especie: formData.especie,
          raza: formData.raza,
          ...(formData.edad && { 
            edad: parseInt(formData.edad),
            unidadEdad: formData.unidadEdad 
          }),
          sexo: formData.sexo,
          tamaño: formData.tamaño,
          color: formData.color,
          peso: formData.peso ? parseFloat(formData.peso) : null,
          fechaIngreso: formData.fechaIngreso,
          estado: formData.estado,
          descripcion: formData.descripcion,
          procedencia: formData.procedencia,
          notasProcedencia: formData.notasProcedencia,
          fotos: fotosUrls,
          fechaCreacion: new Date().toISOString()
        }),
        saludActual: cleanObject({
          estadoGeneral: formData.salud.estadoGeneral,
          vacunacion: cleanObject({
            rabia: formData.salud.vacunacion.rabia.aplicada ? cleanObject(formData.salud.vacunacion.rabia) : null,
            leucemia: formData.salud.vacunacion.leucemia.aplicada ? cleanObject(formData.salud.vacunacion.leucemia) : null,
            polivalente: formData.salud.vacunacion.polivalente.aplicada ? cleanObject(formData.salud.vacunacion.polivalente) : null,
            otra: formData.salud.vacunacion.otra.aplicada ? cleanObject(formData.salud.vacunacion.otra) : null
          }),
          desparasitacion: cleanObject({
            interna: formData.salud.desparasitacion.interna.aplicada ? cleanObject(formData.salud.desparasitacion.interna) : null,
            externa: formData.salud.desparasitacion.externa.aplicada ? cleanObject(formData.salud.desparasitacion.externa) : null
          }),
          esterilizacion: formData.salud.esterilizacion,
          fechaEsterilizacion: formData.salud.fechaEsterilizacion,
          condicionesMedicas: formData.salud.condicionesMedicas,
          alergias: formData.salud.alergias,
          dietaEspecial: formData.salud.dietaEspecial
        }),
        comportamiento: cleanObject({
          temperamento: formData.comportamiento.temperamento,
          compatibilidad: cleanObject({
            perros: formData.comportamiento.compatibilidad.perros,
            gatos: formData.comportamiento.compatibilidad.gatos
          }),
          nivelEntrenamiento: formData.comportamiento.nivelEntrenamiento,
          necesidadesEspeciales: formData.comportamiento.necesidadesEspeciales,
          notasComportamiento: formData.comportamiento.notasComportamiento
        })
      };

      // Generar ID único para el animal
      const animalId = uuidv4();
      
      // Guardar en Firestore
      await setDoc(doc(db, "animales", animalId), animalData);

      // Redirigir después de guardar
      navigate("/admin/animales");
    } catch (error) {
      console.error("Error al guardar el animal:", error);
      setError("Error al guardar el animal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/animales")}
          className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full text-gray-600 hover:text-gray-800 hover:border-gray-400 cursor-pointer"
        >
          <span className="material-icons-outlined text-lg">←</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 ml-4">Nuevo Animal</h1>
      </div>
      {/* Mostrar error si existe */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: "informacionBasica", label: "Información Básica" },
          { id: "salud", label: "Salud" },
          { id: "comportamiento", label: "Comportamiento" },
          { id: "fotos", label: "Fotos" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px font-medium text-sm cursor-pointer ${
              activeTab === tab.id
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content - Información Básica */}
      {activeTab === "informacionBasica" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Información Básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Nombre del animal"
              />
            </div>
            <div>
              <label className="block text-gray-700">Especie</label>
              <select
                name="especie"
                value={formData.especie}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="">Seleccione especie</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Conejo">Conejo</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Raza</label>
              <input
                type="text"
                name="raza"
                value={formData.raza}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Raza o tipo"
              />
            </div>
            <div>
              <label className="block text-gray-700">Edad aproximada</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
                  placeholder="Edad"
                />
                <select
                  name="unidadEdad"
                  value={formData.unidadEdad}
                  onChange={handleInputChange}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
                >
                  <option value="años">Años</option>
                  <option value="meses">Meses</option>
                  <option value="días">Días</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700">Sexo</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexo"
                    value="Macho"
                    checked={formData.sexo === "Macho"}
                    onChange={handleInputChange}
                    className="mr-2 cursor-pointer"
                  />
                  Macho
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="sexo"
                    value="Hembra"
                    checked={formData.sexo === "Hembra"}
                    onChange={handleInputChange}
                    className="mr-2 cursor-pointer"
                  />
                  Hembra
                </label>
              </div>
            </div>
            <div>
              <label className="block text-gray-700">Tamaño</label>
              <select
                name="tamaño"
                value={formData.tamaño}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="">Seleccione tamaño</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Color principal"
              />
            </div>
            <div>
              <label className="block text-gray-700">Peso (kg)</label>
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Peso en kg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Fecha de ingreso</label>
              <input
                type="date"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-gray-700">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="Disponible">Disponible</option>
                <option value="En tratamiento">En tratamiento</option>
                <option value="En adopción">En adopción</option>
                <option value="Adoptado">Adoptado</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                rows="3"
                placeholder="Descripción general del animal"
              />
            </div>
            <div>
              <label className="block text-gray-700">Procedencia</label>
              <select
                name="procedencia"
                value={formData.procedencia}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="">Seleccione procedencia</option>
                <option value="Abandono">Abandono</option>
                <option value="Rescate">Rescate</option>
                <option value="Donación">Donación</option>
                <option value="Nacido en el refugio">Nacido en el refugio</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700">Notas sobre la procedencia</label>
              <textarea
                name="notasProcedencia"
                value={formData.notasProcedencia}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                rows="2"
                placeholder="Detalles sobre cómo llegó al refugio"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content - Salud */}
      {activeTab === "salud" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Información de Salud
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700">Estado de salud general</label>
              <select
                value={formData.salud.estadoGeneral}
                onChange={(e) => handleSaludInputChange("estadoGeneral", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="">Seleccione estado</option>
                <option value="Excelente">Excelente</option>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Malo">Malo</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Estado de vacunación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Rabia */}
                <div className="border p-3 rounded-lg">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.salud.vacunacion.rabia.aplicada}
                      onChange={(e) => handleSaludInputChange("vacunacion", {
                        ...formData.salud.vacunacion,
                        rabia: {
                          ...formData.salud.vacunacion.rabia,
                          aplicada: e.target.checked
                        }
                      })}
                      className="mr-2 cursor-pointer"
                    />
                    <span>Rabia</span>
                  </label>
                  {formData.salud.vacunacion.rabia.aplicada && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 ">Fecha:</label>
                      <input
                        type="date"
                        value={formData.salud.vacunacion.rabia.fecha}
                        onChange={(e) => handleSaludInputChange("vacunacion", {
                          ...formData.salud.vacunacion,
                          rabia: {
                            ...formData.salud.vacunacion.rabia,
                            fecha: e.target.value
                          }
                        })}
                        className="w-full px-3 py-1 border rounded-lg text-sm cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Leucemia */}
                <div className="border p-3 rounded-lg">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.salud.vacunacion.leucemia.aplicada}
                      onChange={(e) => handleSaludInputChange("vacunacion", {
                        ...formData.salud.vacunacion,
                        leucemia: {
                          ...formData.salud.vacunacion.leucemia,
                          aplicada: e.target.checked
                        }
                      })}
                      className="mr-2 cursor-pointer"
                    />
                    <span>Leucemia (felina)</span>
                  </label>
                  {formData.salud.vacunacion.leucemia.aplicada && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 cursor-pointer">Fecha:</label>
                      <input
                        type="date"
                        value={formData.salud.vacunacion.leucemia.fecha}
                        onChange={(e) => handleSaludInputChange("vacunacion", {
                          ...formData.salud.vacunacion,
                          leucemia: {
                            ...formData.salud.vacunacion.leucemia,
                            fecha: e.target.value
                          }
                        })}
                        className="w-full px-3 py-1 border rounded-lg text-sm cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Polivalente */}
                <div className="border p-3 rounded-lg">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.salud.vacunacion.polivalente.aplicada}
                      onChange={(e) => handleSaludInputChange("vacunacion", {
                        ...formData.salud.vacunacion,
                        polivalente: {
                          ...formData.salud.vacunacion.polivalente,
                          aplicada: e.target.checked
                        }
                      })}
                      className="mr-2 cursor-pointer"
                    />
                    <span>Polivalente</span>
                  </label>
                  {formData.salud.vacunacion.polivalente.aplicada && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600">Fecha:</label>
                      <input
                        type="date"
                        value={formData.salud.vacunacion.polivalente.fecha}
                        onChange={(e) => handleSaludInputChange("vacunacion", {
                          ...formData.salud.vacunacion,
                          polivalente: {
                            ...formData.salud.vacunacion.polivalente,
                            fecha: e.target.value
                          }
                        })}
                        className="w-full px-3 py-1 border rounded-lg text-sm cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Otra vacuna */}
                <div className="border p-3 rounded-lg">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.salud.vacunacion.otra.aplicada}
                      onChange={(e) => handleSaludInputChange("vacunacion", {
                        ...formData.salud.vacunacion,
                        otra: {
                          ...formData.salud.vacunacion.otra,
                          aplicada: e.target.checked
                        }
                      })}
                      className="mr-2 cursor-pointer"
                    />
                    <span>Otra</span>
                  </label>
                  {formData.salud.vacunacion.otra.aplicada && (
                    <div className="mt-2 space-y-2">
                      <div>
                        <label className="block text-sm text-gray-600">Nombre:</label>
                        <input
                          type="text"
                          value={formData.salud.vacunacion.otra.nombre}
                          onChange={(e) => handleSaludInputChange("vacunacion", {
                            ...formData.salud.vacunacion,
                            otra: {
                              ...formData.salud.vacunacion.otra,
                              nombre: e.target.value
                            }
                          })}
                          className="w-full px-3 py-1 border rounded-lg text-sm"
                          placeholder="Nombre de la vacuna"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600">Fecha:</label>
                        <input
                          type="date"
                          value={formData.salud.vacunacion.otra.fecha}
                          onChange={(e) => handleSaludInputChange("vacunacion", {
                            ...formData.salud.vacunacion,
                            otra: {
                              ...formData.salud.vacunacion.otra,
                              fecha: e.target.value
                            }
                          })}
                          className="w-full px-3 py-1 border rounded-lg text-sm cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-700 mb-2">Desparasitación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Desparasitación interna */}
                <div className="border p-3 rounded-lg">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.salud.desparasitacion.interna.aplicada}
                      onChange={(e) => handleSaludInputChange("desparasitacion", {
                        ...formData.salud.desparasitacion,
                        interna: {
                          ...formData.salud.desparasitacion.interna,
                          aplicada: e.target.checked
                        }
                      })}
                      className="mr-2 cursor-pointer"
                    />
                    <span>Interna</span>
                  </label>
                  {formData.salud.desparasitacion.interna.aplicada && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600">Fecha:</label>
                      <input
                        type="date"
                        value={formData.salud.desparasitacion.interna.fecha}
                        onChange={(e) => handleSaludInputChange("desparasitacion", {
                          ...formData.salud.desparasitacion,
                          interna: {
                            ...formData.salud.desparasitacion.interna,
                            fecha: e.target.value
                          }
                        })}
                        className="w-full px-3 py-1 border rounded-lg text-sm cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Desparasitación externa */}
                <div className="border p-3 rounded-lg">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.salud.desparasitacion.externa.aplicada}
                      onChange={(e) => handleSaludInputChange("desparasitacion", {
                        ...formData.salud.desparasitacion,
                        externa: {
                          ...formData.salud.desparasitacion.externa,
                          aplicada: e.target.checked
                        }
                      })}
                      className="mr-2 cursor-pointer"
                    />
                    <span>Externa</span>
                  </label>
                  {formData.salud.desparasitacion.externa.aplicada && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600">Fecha:</label>
                      <input
                        type="date"
                        value={formData.salud.desparasitacion.externa.fecha}
                        onChange={(e) => handleSaludInputChange("desparasitacion", {
                          ...formData.salud.desparasitacion,
                          externa: {
                            ...formData.salud.desparasitacion.externa,
                            fecha: e.target.value
                          }
                        })}
                        className="w-full px-3 py-1 border rounded-lg text-sm cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-700 mb-2">Estado de esterilización</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="esterilizacion"
                    value="Esterilizado"
                    checked={formData.salud.esterilizacion === "Esterilizado"}
                    onChange={(e) => handleSaludInputChange("esterilizacion", e.target.value)}
                    className="mr-2 cursor-pointer"
                  />
                  Esterilizado/a
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="esterilizacion"
                    value="No esterilizado"
                    checked={formData.salud.esterilizacion === "No esterilizado"}
                    onChange={(e) => handleSaludInputChange("esterilizacion", e.target.value)}
                    className="mr-2 cursor-pointer"
                  />
                  No esterilizado/a
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="esterilizacion"
                    value="Pendiente"
                    checked={formData.salud.esterilizacion === "Pendiente"}
                    onChange={(e) => handleSaludInputChange("esterilizacion", e.target.value)}
                    className="mr-2 cursor-pointer"
                  />
                  Pendiente
                </label>
              </div>

              {formData.salud.esterilizacion === "Esterilizado" || formData.salud.esterilizacion === "Pendiente" ? (
                <div className="mb-4">
                  <label className="block text-gray-700">Fecha de esterilización</label>
                  <input
                    type="date"
                    value={formData.salud.fechaEsterilizacion}
                    onChange={(e) => handleSaludInputChange("fechaEsterilizacion", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  />
                </div>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700">Condiciones médicas</label>
              <textarea
                value={formData.salud.condicionesMedicas}
                onChange={(e) => handleSaludInputChange("condicionesMedicas", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                rows="3"
                placeholder="Describa cualquier condición médica o enfermedad"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700">Tratamientos actuales</label>
              <textarea
                value={formData.salud.tratamientos}
                onChange={(e) => handleSaludInputChange("tratamientos", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                rows="3"
                placeholder="Describa los tratamientos que está recibiendo actualmente"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700">Alergias conocidas</label>
              <textarea
                value={formData.salud.alergias}
                onChange={(e) => handleSaludInputChange("alergias", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                rows="2"
                placeholder="Describa cualquier alergia conocida"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700">Dieta especial</label>
              <textarea
                value={formData.salud.dietaEspecial}
                onChange={(e) => handleSaludInputChange("dietaEspecial", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                rows="2"
                placeholder="Describa cualquier requerimiento dietético especial"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content - Comportamiento */}
      {activeTab === "comportamiento" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Comportamiento
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700">Temperamento</label>
              <select
                value={formData.comportamiento.temperamento}
                onChange={(e) => handleComportamientoInputChange("temperamento", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="">Seleccione temperamento</option>
                <option value="Tranquilo">Tranquilo</option>
                <option value="Activo">Activo</option>
                <option value="Nervioso">Nervioso</option>
                <option value="Amigable">Amigable</option>
                <option value="Tímido">Tímido</option>
                <option value="Agresivo">Agresivo</option>
              </select>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Compatibilidad con</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Perros</label>
                  <select
                    value={formData.comportamiento.compatibilidad.perros}
                    onChange={(e) => handleComportamientoInputChange("compatibilidad", e.target.value, "perros")}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
                  >
                    <option value="">Seleccione</option>
                    <option value="Si">Si</option>
                    <option value="No">No</option>
                    <option value="Desconocido">Desconocido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700">Gatos</label>
                  <select
                    value={formData.comportamiento.compatibilidad.gatos}
                    onChange={(e) => handleComportamientoInputChange("compatibilidad", e.target.value, "gatos")}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
                  >
                    <option value="">Seleccione</option>
                    <option value="Si">Si</option>
                    <option value="No">No</option>
                    <option value="Desconocido">Desconocido</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Nivel de entrenamiento</label>
              <select
                value={formData.comportamiento.nivelEntrenamiento}
                onChange={(e) => handleComportamientoInputChange("nivelEntrenamiento", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 cursor-pointer"
              >
                <option value="">Seleccione nivel</option>
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Ninguno">Ninguno</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700">Necesidades especiales</label>
              <textarea
                value={formData.comportamiento.necesidadesEspeciales}
                onChange={(e) => handleComportamientoInputChange("necesidadesEspeciales", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 "
                rows="3"
                placeholder="Describa cualquier necesidad especial de comportamiento"
              />
            </div>

            <div>
              <label className="block text-gray-700">Notas adicionales sobre comportamiento</label>
              <textarea
                value={formData.comportamiento.notasComportamiento}
                onChange={(e) => handleComportamientoInputChange("notasComportamiento", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                rows="3"
                placeholder="Cualquier otra información relevante sobre su comportamiento"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content - Fotos */}
      {activeTab === "fotos" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Fotos</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 mb-2">
                Sube al menos una foto clara del animal. Recomendamos subir varias fotos desde diferentes ángulos.
              </p>
              <label className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-emerald-700">
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
            </div>

            {previewImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity "
                    >
                      <span className="material-icons-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <span className="material-icons-outlined text-gray-400 text-4xl mb-2">photo_camera</span>
                <p className="text-gray-500">No hay fotos subidas todavía</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => navigate("/animales")}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center cursor-pointer"
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
            "Guardar Animal"
          )}
        </button>
      </div>
    </div>
  );
};

export default NuevoAnimal;