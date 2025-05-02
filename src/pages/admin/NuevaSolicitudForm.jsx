import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NuevaAdopcion = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    // Información del adoptante
    nombreCompleto: "",
    email: "",
    telefono: "",
    dni: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    
    // Información del animal y hogar
    animalAdoptar: "",
    otrosAnimales: "no",
    tipoVivienda: "piso",
    jardinTerraza: "no",
    personasHogar: "",
    niñosHogar: "no",
    
    // Información adicional
    motivoAdopcion: "",
    experienciaAnimales: "",
    tiempoSolo: "",
    visitaHogar: "si",
    aceptaTerminos: false
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (activeStep < 3) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 1) setActiveStep(prev => prev - 1);
  };

  const handleSave = () => {
    console.log("Datos de la solicitud:", formData);
    // Aquí iría la lógica para enviar los datos al servidor
    navigate("/animales");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/adopciones")}
          className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full text-gray-600 hover:text-gray-800 hover:border-gray-400"
        >
          <span className="material-icons-outlined text-lg">←</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800 ml-4">Nueva Solicitud de Adopción</h1>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  activeStep >= step
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`h-1 w-16 ${
                    activeStep > step ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <span className="text-sm text-gray-600">Paso {activeStep} de 3</span>
      </div>

      {/* Paso 1: Información del Adoptante */}
      {activeStep === 1 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del Adoptante</h2>
          <p className="text-gray-600 mb-6">Ingrese los datos personales del solicitante</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-700">Nombre completo</label>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Nombre y apellidos"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="(123) 456-7890"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">DNI/Identificación</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="12345678A"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Calle, número, piso"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Ciudad"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Provincia</label>
              <input
                type="text"
                name="provincia"
                value={formData.provincia}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="Provincia"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700">Código Postal</label>
              <input
                type="text"
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
                placeholder="12345"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Información del Animal y Hogar */}
      {activeStep === 2 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del Animal y Hogar</h2>
          <p className="text-gray-600 mb-6">Seleccione el animal y proporcione información sobre el hogar</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700">Animal a adoptar</label>
              <select
                name="animalAdoptar"
                value={formData.animalAdoptar}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              >
                <option value="">Seleccione un animal</option>
                <option value="luna">Luna (Labrador, 2 años)</option>
                <option value="simba">Simba (Siamés, 1 año)</option>
                <option value="rocky">Rocky (Pastor Alemán, 3 años)</option>
                <option value="pelusa">Pelusa (Conejo, 6 meses)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700">¿Tiene otros animales en casa?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="otrosAnimales"
                    value="si"
                    checked={formData.otrosAnimales === "si"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="otrosAnimales"
                    value="no"
                    checked={formData.otrosAnimales === "no"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700">Tipo de vivienda</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoVivienda"
                    value="piso"
                    checked={formData.tipoVivienda === "piso"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Piso/Apartamento
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoVivienda"
                    value="casa"
                    checked={formData.tipoVivienda === "casa"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Casa
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="tipoVivienda"
                    value="chalet"
                    checked={formData.tipoVivienda === "chalet"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Chalet
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700">¿Dispone de jardín o terraza?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="jardinTerraza"
                    value="si"
                    checked={formData.jardinTerraza === "si"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="jardinTerraza"
                    value="no"
                    checked={formData.jardinTerraza === "no"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700">¿Cuántas personas viven en el hogar?</label>
              <select
                name="personasHogar"
                value={formData.personasHogar}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              >
                <option value="">Seleccione</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5 o más</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700">¿Hay niños en el hogar?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="niñosHogar"
                    value="si"
                    checked={formData.niñosHogar === "si"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="niñosHogar"
                    value="no"
                    checked={formData.niñosHogar === "no"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Paso 3: Información Adicional */}
      {activeStep === 3 && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Información Adicional</h2>
          <p className="text-gray-600 mb-6">Complete la información final para procesar la solicitud</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700">¿Por qué desea adoptar este animal?</label>
              <textarea
                name="motivoAdopcion"
                value={formData.motivoAdopcion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 min-h-[100px]"
                placeholder="Explique sus motivos para la adopción"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700">¿Tiene experiencia previa con animales?</label>
              <textarea
                name="experienciaAnimales"
                value={formData.experienciaAnimales}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300 min-h-[100px]"
                placeholder="Describa su experiencia previa con mascotas"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700">¿Cuánto tiempo pasará el animal solo al día?</label>
              <select
                name="tiempoSolo"
                value={formData.tiempoSolo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              >
                <option value="">Seleccione</option>
                <option value="menos-2">Menos de 2 horas</option>
                <option value="2-4">Entre 2 y 4 horas</option>
                <option value="4-8">Entre 4 y 8 horas</option>
                <option value="mas-8">Más de 8 horas</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700">¿Está dispuesto a permitir una visita a su hogar?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visitaHogar"
                    value="si"
                    checked={formData.visitaHogar === "si"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visitaHogar"
                    value="no"
                    checked={formData.visitaHogar === "no"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terminos"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleInputChange}
                className="mt-1"
              />
              <label htmlFor="terminos" className="block text-gray-700">
                Acepto los términos y condiciones de adopción. Confirmo que toda la información proporcionada es verídica.
              </label>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100"
            >
              Anterior
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.aceptaTerminos}
              className={`px-6 py-2 rounded-lg ${
                formData.aceptaTerminos
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Guardar Solicitud
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevaAdopcion;