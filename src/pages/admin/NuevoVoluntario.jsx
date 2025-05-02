import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";
import { auth, db } from "../../firebase"; // Asegúrate de tener configurado Cloudinary
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { createUserWithEmailAndPassword } from "firebase/auth";
import countries from "../../components/adoptantescompon/countries"; // Importar lista de países

const NuevoVoluntario = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    dni: "",
    fechaNacimiento: "",
    foto: null,
    fotoUrl: "",
    rolPrincipal: "",
    fechaInicio: "",
    horasSemanales: "",
    experienciaPrevia: "",
    disponibilidad: [],
    preferenciaHoraria: "",
    habilidades: "",
    motivacion: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("BO"); // Código de país por defecto
  
  // Obtener el país seleccionado
  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ 
      ...prev, 
      foto: file,
      // Vista previa
      fotoUrl: URL.createObjectURL(file) 
    }));
  };

  useEffect(() => {
    return () => {
      // Limpiar la URL de objeto cuando el componente se desmonte
      if (formData.fotoUrl) {
        URL.revokeObjectURL(formData.fotoUrl);
      }
    };
  }, [formData.fotoUrl]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      disponibilidad: checked
        ? [...prev.disponibilidad, value]
        : prev.disponibilidad.filter((day) => day !== value),
    }));
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "adopciones"); // Reemplaza con tu upload preset
    formData.append("cloud_name", "dsglcrfw9"); // Reemplaza con tu cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsglcrfw9/image/upload`, // Reemplaza con tu cloud name
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      let imageUrl = "";
      
      // Subir imagen a Cloudinary si existe
      if (formData.foto) {
        imageUrl = await uploadImageToCloudinary(formData.foto);
      }

      // Crear ID único para el voluntario
      const voluntarioId = user.uid; // Usamos el UID de Firebase Auth
      const fullPhoneNumber = `+${selectedCountryData.phone}${formData.telefono}`;

      // Crear el objeto de voluntario para Firestore
      const voluntarioData = {
        _id: voluntarioId,
        nombre: formData.nombre,
        email: formData.email,
        telefono: fullPhoneNumber,
        direccion: formData.direccion,
        dni: formData.dni,
        fechaNacimiento: formData.fechaNacimiento,
        fotoUrl: imageUrl,
        rol: "voluntario", // Rol específico para voluntarios
        rolPrincipal: formData.rolPrincipal,
        fechaInicio: formData.fechaInicio,
        horasSemanales: formData.horasSemanales,
        experienciaPrevia: formData.experienciaPrevia,
        disponibilidad: formData.disponibilidad,
        preferenciaHoraria: formData.preferenciaHoraria,
        habilidades: formData.habilidades,
        motivacion: formData.motivacion,
        creado_en: serverTimestamp(),
        ultimo_acceso: serverTimestamp(),
        esta_activo: true,
      };

      // Guardar en la colección 'users'
      await setDoc(doc(db, "users", voluntarioId), voluntarioData);

      alert("Voluntario registrado exitosamente!");
      // Limpiar el formulario después del registro exitoso
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        dni: "",
        fechaNacimiento: "",
        foto: null,
        fotoUrl: "",
        rolPrincipal: "",
        fechaInicio: "",
        horasSemanales: "",
        experienciaPrevia: "",
        disponibilidad: [],
        preferenciaHoraria: "",
        habilidades: "",
        motivacion: "",
        password: "",
      });
    } catch (error) {
      console.error("Error al registrar voluntario:", error);
      setError("Error al registrar voluntario: " + error.message);
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
          title="Nuevo Voluntario"
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
              Información Personal
            </h2>
            <p className="text-gray-600 mb-6">
              Ingrese los datos personales del nuevo voluntario
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre completo */}
              <div>
                <label className="block text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  placeholder="Nombre y apellidos"
                  required
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <label className="block text-gray-700 mb-2">Correo electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
              <label className="block text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 pr-10"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">La contraseña debe tener al menos 6 caracteres</p>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-gray-700 mb-2">Teléfono</label>
                <div className="flex">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-1/3 px-2 py-2 border rounded-l-lg focus:outline-none focus:ring focus:ring-emerald-300"
                    disabled={loading.phone}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} (+{country.phone})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-2/3 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring focus:ring-emerald-300"
                    placeholder="4567890"
                    required
                  />
                </div>
              </div>

              {/* DNI/Identificación */}
              <div>
                <label className="block text-gray-700 mb-2">DNI/Identificación</label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  placeholder="12345678A"
                  required
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  placeholder="Calle, número, piso"
                  required
                />
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  required
                />
              </div>

              {/* Foto */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700 mb-2">Foto</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  />
                  {formData.foto && (
                    <img
                      src={URL.createObjectURL(formData.foto)}
                      alt="Vista previa"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
              Información de Voluntariado
            </h2>
            <p className="text-gray-600 mb-6">
              Detalles sobre el rol y disponibilidad
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rol principal */}
              <div>
                <label className="block text-gray-700 mb-2">Rol principal</label>
                <select
                  name="rolPrincipal"
                  value={formData.rolPrincipal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  required 
                >
                  <option value="">Seleccione un rol</option>
                  <option value="Coordinador">Coordinador</option>
                  <option value="Asistente veterinario">Asistente veterinario</option>
                  <option value="Paseador">Paseador</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              {/* Fecha de inicio */}
              <div>
                <label className="block text-gray-700 mb-2">Fecha de inicio</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  required
                />
              </div>

              {/* Horas semanales */}
              <div>
                <label className="block text-gray-700 mb-2">Horas semanales</label>
                <select
                  name="horasSemanales"
                  value={formData.horasSemanales}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  required
                >
                  <option value="">Seleccione horas</option>
                  <option value="10">10 horas</option>
                  <option value="15">15 horas</option>
                  <option value="20">20 horas</option>
                </select>
              </div>

              {/* Experiencia previa */}
              <div>
                <label className="block text-gray-700 mb-2">Experiencia previa</label>
                <select
                  name="experienciaPrevia"
                  value={formData.experienciaPrevia}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Disponibilidad */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700 mb-2">Disponibilidad</label>
                <div className="flex flex-wrap gap-4">
                  {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={day}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-emerald-600"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preferencia horaria */}
              <div>
                <label className="block text-gray-700 mb-2">Preferencia horaria</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="preferenciaHoraria"
                      value="Mañana"
                      checked={formData.preferenciaHoraria === "Mañana"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-emerald-600"
                    />
                    <span>Mañana (8:00 - 14:00)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="preferenciaHoraria"
                      value="Tarde"
                      checked={formData.preferenciaHoraria === "Tarde"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-emerald-600"
                    />
                    <span>Tarde (14:00 - 20:00)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="preferenciaHoraria"
                      value="Flexible"
                      checked={formData.preferenciaHoraria === "Flexible"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-emerald-600"
                    />
                    <span>Horario flexible</span>
                  </label>
                </div>
              </div>

              {/* Habilidades */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700 mb-2">Habilidades y conocimientos</label>
                <textarea
                  name="habilidades"
                  value={formData.habilidades}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  placeholder="Describa habilidades relevantes para el voluntariado"
                  rows="3"
                />
              </div>

              {/* Motivación */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-gray-700 mb-2">Motivación para ser voluntario</label>
                <textarea
                  name="motivacion"
                  value={formData.motivacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                  placeholder="Explica el interés en ser voluntario"
                  rows="3"
                />
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
                {loading ? "Registrando..." : "Guardar Voluntario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NuevoVoluntario;