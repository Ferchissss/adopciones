import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdoptSlideHeader from "../../components/adoptantescompon/AdoptSlideHeader";
import AdoptSlidebar from "../../components/adoptantescompon/AdopSlidebar";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import countries from "../../components/adoptantescompon/countries"; // Importa tu lista de países

const SolicitudAdopcion = ({ user }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false); // Nuevo estado para controlar cuando mostrar errores
  const [selectedCountry, setSelectedCountry] = useState("BO"); // País por defecto: Bolivia
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true); // Para mostrar carga inicial
    
  // Obtener datos del animal desde la ubicación
  const animal = location.state?.animal;
  const uid = auth.currentUser?.uid;
  // Verificar si ya existe una solicitud al cargar el componente
  useEffect(() => {
    const checkExistingRequest = async () => {
      if (!uid || !animal?.id) return;
      
      try {
        const solicitudesRef = collection(db, "solicitudesAdopcion");
        const q = query(
          solicitudesRef,
          where("animalId", "==", animal.id),
          where("adoptanteUid", "==", uid)
        );
        
        const querySnapshot = await getDocs(q);
        setAlreadySubmitted(!querySnapshot.empty);
      } catch (error) {
        console.error("Error verificando solicitudes existentes:", error);
      } finally {
        setLoadingCheck(false);
      }
    };
    
    checkExistingRequest();
  }, [uid, animal?.id]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: user?.displayName || "",
    email: user?.email || "",
    telefono: "",
    direccion: "",
    ciudad: "Tarija", // Ciudad por defecto
    pais: "Bolivia", // País por defecto
    tipoVivienda: "",
    tieneJardin: false,
    horasSolo: "",
    tieneOtrasMascotas: false,
    detallesOtrasMascotas: "",
    experienciaMascotas: "",
    motivacionAdopcion: "",
    aceptaTerminos: false
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.nombreCompleto.trim()) {
        errors.nombreCompleto = "Nombre completo es requerido";
        isValid = false;
      }
      if (!formData.email.trim()) {
        errors.email = "Email es requerido";
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Email no es válido";
        isValid = false;
      }
      if (!formData.telefono.trim()) {
        errors.telefono = "Teléfono es requerido";
        isValid = false;
      }
      if (!formData.direccion.trim()) {
        errors.direccion = "Dirección es requerida";
        isValid = false;
      }
      if (!formData.ciudad.trim()) {
        errors.ciudad = "Ciudad es requerida";
        isValid = false;
      }
    }

    if (currentStep === 2) {
      if (!formData.tipoVivienda) {
        errors.tipoVivienda = "Tipo de vivienda es requerido";
        isValid = false;
      }
      if (!formData.horasSolo) {
        errors.horasSolo = "Debes seleccionar cuántas horas estará solo";
        isValid = false;
      }
      if (formData.tieneOtrasMascotas && !formData.detallesOtrasMascotas.trim()) {
        errors.detallesOtrasMascotas = "Por favor describe tus otras mascotas";
        isValid = false;
      }
    }

    if (currentStep === 3) {
      if (!formData.experienciaMascotas.trim()) {
        errors.experienciaMascotas = "Describe tu experiencia con mascotas";
        isValid = false;
      }
      if (!formData.motivacionAdopcion.trim()) {
        errors.motivacionAdopcion = "Explica tus motivos para adoptar";
        isValid = false;
      }
      if (!formData.aceptaTerminos) {
        errors.aceptaTerminos = "Debes aceptar los términos y condiciones";
        isValid = false;
      }
    }

    // Solo actualizar errores para campos que actualmente son inválidos
    setFormErrors(prev => {
      // Mantener errores existentes que aún son relevantes
      const currentErrors = { ...prev };
      // Agregar nuevos errores
      return { ...currentErrors, ...errors };
    });
    return isValid; 
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Limpiar el error de este campo específico cuando el usuario escribe
    if (formErrors[name] && value.trim() !== "") {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const nextStep = () => {
    const isValid = validateForm(); // Validamos el formulario y obtenemos el resultado
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      setShowErrors(false); // Ocultamos errores al cambiar de paso
    } else {
      setShowErrors(true); // Mostramos errores si el formulario no es válido
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setShowErrors(false); // Ocultar errores al retroceder
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm(); // Validamos el formulario y obtenemos el resultado
  
    if (!isValid) {
      setShowErrors(true); // Mostramos errores si el formulario no es válido
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCountryData = countries.find(c => c.code === selectedCountry);
      const telefonoCompleto = `+${selectedCountryData.phone}${formData.telefono}`;

      // Crear el objeto de solicitud según la estructura requerida
      const solicitudData = {
        animalId: animal.id,
        nombreAnimal: animal.nombre,
        adoptanteUid: uid,
        
        // Datos del adoptante
        nombreCompleto: formData.nombreCompleto,
        correoElectronico: formData.email,
        telefono: telefonoCompleto,
        direccion: formData.direccion,
        ciudad: formData.ciudad,
        pais: formData.pais,
        
        fechaSolicitud: serverTimestamp(),
        estado: "pendiente", // Estado inicial
        notas: "",
        
        formulario: {
          fechaEnvio: serverTimestamp(),
          tipoVivienda: formData.tipoVivienda,
          tienePatio: formData.tieneJardin,
          horasSolo: formData.horasSolo,
          tieneOtrosAnimales: formData.tieneOtrasMascotas,
          detallesOtrosAnimales: formData.detallesOtrasMascotas,
          experienciaPrevia: formData.experienciaMascotas,
          motivacion: formData.motivacionAdopcion,
          estadoFormulario: "pendiente",
          revisadoPor: "",
          fechaRevision: null
        }
      };

      // Guardar en la colección de solicitudes
      const solicitudesRef = collection(db, "solicitudesAdopcion");
      await addDoc(solicitudesRef, solicitudData);

      alert("¡Solicitud de adopción enviada con éxito!");
      navigate("/adoptante/animales");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Hubo un error al enviar la solicitud. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleBackClick = () => {
    navigate(-1); // Regresa a la página anterior
  };

  const handleCancel = () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar la solicitud? Los datos no se guardarán.")) {
      navigate("/adoptante/animales");
    }
  };

  if (loadingCheck) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar y header como en el original */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verificando solicitudes previas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar y header como en el original */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white relative rounded-lg shadow-md p-8 max-w-md text-center">
          <button
                  onClick={handleBackClick}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            <div className="text-emerald-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Solicitud ya enviada</h2>
            <p className="text-gray-600 mb-6">
              Ya enviaste una solicitud para adoptar a <span className="font-bold">{animal?.nombre}</span>.
              Estamos procesando tu solicitud y nos pondremos en contacto contigo pronto.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/adoptante/animales")}
                className="w-full px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
              >
                Ver otros animales
              </button>
              <button
                onClick={() => navigate("/adoptante/mis-solicitudes")}
                className="w-full px-6 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 cursor-pointer"
              >
                Ver mis solicitudes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdoptSlidebar isCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "pl-20" : "pl-64"}`}>
        {/* Header */}
        <AdoptSlideHeader
          title={`Solicitud de Adopción`}
          toggleSidebar={toggleSidebar}
          isCollapsed={isSidebarCollapsed}
          user={user}
        />

        {/* Main Content */}
        <div className="container mx-auto p-6 mt-16 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Solicitud de Adopción</h1>
                <p className="text-gray-600">
                  Estás solicitando la adopción de <span className="font-bold">{animal?.nombre}</span>, {animal?.raza} de {animal?.edad}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Pasos del formulario */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-xs mt-1 text-gray-500">
                    {step === 1 && "Personal"}
                    {step === 2 && "Hogar"}
                    {step === 3 && "Motivación"}
                  </span>
                </div>
              ))}
            </div>

            {/* Paso 1: Información Personal */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Información Personal</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo*</label>
                    <input
                      type="text"
                      name="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 ${
                        showErrors && formErrors.nombreCompleto ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {showErrors && formErrors.nombreCompleto && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.nombreCompleto}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 ${
                        formErrors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
                    <div className="flex">
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-1/3 px-3 py-2 border border-r-0 rounded-l-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 cursor-pointer"
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
                        className={`w-2/3 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 ${
                          showErrors && formErrors.telefono ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    {showErrors && formErrors.telefono && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.telefono}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección*</label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 ${
                        formErrors.direccion ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {formErrors.direccion && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.direccion}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad*</label>
                      <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 ${
                          formErrors.ciudad ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {formErrors.ciudad && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.ciudad}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                      <input
                        type="text"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Información del Hogar */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Información del Hogar</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de vivienda*</label>
                    <select
                      name="tipoVivienda"
                      value={formData.tipoVivienda}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 cursor-pointer ${
                        formErrors.tipoVivienda ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="Casa">Casa</option>
                      <option value="Apartamento">Apartamento</option>
                      <option value="Dúplex">Dúplex</option>
                      <option value="Otro">Otro</option>
                    </select>
                    {formErrors.tipoVivienda && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.tipoVivienda}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="tieneJardin"
                      id="tieneJardin"
                      checked={formData.tieneJardin}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="tieneJardin" className="ml-2 block text-sm text-gray-700">
                      ¿Tienes jardín o patio?
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Cuántas horas al día estará el animal solo?*
                    </label>
                    <div className="space-y-2">
                      {["Menos de 2 horas", "2 a 4 horas", "4 a 8 horas", "Más de 8 horas"].map((opcion) => (
                        <div key={opcion} className="flex items-center">
                          <input
                            type="radio"
                            name="horasSolo"
                            id={opcion}
                            value={opcion}
                            checked={formData.horasSolo === opcion}
                            onChange={handleChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                            required
                          />
                          <label htmlFor={opcion} className="ml-2 block text-sm text-gray-700">
                            {opcion}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formErrors.horasSolo && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.horasSolo}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="tieneOtrasMascotas"
                      id="tieneOtrasMascotas"
                      checked={formData.tieneOtrasMascotas}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="tieneOtrasMascotas" className="ml-2 block text-sm text-gray-700">
                      ¿Tienes otras mascotas?
                    </label>
                  </div>
                  {formData.tieneOtrasMascotas && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Describe tus otras mascotas*
                      </label>
                      <textarea
                        name="detallesOtrasMascotas"
                        value={formData.detallesOtrasMascotas}
                        onChange={handleChange}
                        rows={2}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 ${
                          formErrors.detallesOtrasMascotas ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Tipo, cantidad, edades, temperamento..."
                        required={formData.tieneOtrasMascotas}
                      />
                      {formErrors.detallesOtrasMascotas && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.detallesOtrasMascotas}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 3: Experiencia y Motivación */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Experiencia y Motivación</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ¿Has tenido mascotas antes? Describe tu experiencia*
                    </label>
                    <textarea
                      name="experienciaMascotas"
                      value={formData.experienciaMascotas}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 ${
                        formErrors.experienciaMascotas ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Cuéntanos sobre tus experiencias previas con mascotas..."
                      required
                    />
                    {formErrors.experienciaMascotas && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.experienciaMascotas}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ¿Por qué quieres adoptar a {animal?.nombre}?*
                    </label>
                    <textarea
                      name="motivacionAdopcion"
                      value={formData.motivacionAdopcion}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 ${
                        formErrors.motivacionAdopcion ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Explica tus motivos para adoptar..."
                      required
                    />
                    {formErrors.motivacionAdopcion && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.motivacionAdopcion}</p>
                    )}
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        name="aceptaTerminos"
                        id="aceptaTerminos"
                        checked={formData.aceptaTerminos}
                        onChange={handleChange}
                        className={`h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer ${
                          formErrors.aceptaTerminos ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    <label htmlFor="aceptaTerminos" className="ml-2 block text-sm text-gray-700">
                      Acepto los términos y condiciones de adopción y declaro que toda la información proporcionada es verídica.*
                    </label>
                    {formErrors.aceptaTerminos && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.aceptaTerminos}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                Cancelar
              </button>
              
              <div className="flex space-x-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Anterior
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-emerald-300 cursor-pointer"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-emerald-300 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudAdopcion;