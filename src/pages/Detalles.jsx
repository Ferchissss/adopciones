import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MiniCarrusel from "../components/administradorcompon/AdminCarrusel";

const Detalles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener datos del animal desde la ubicación
  const animal = location.state?.animal;

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAdoptClick = () => {
    navigate("/registro", { state: { from: 'animal', animal } });
  };

  // Función para generar el resumen de salud
  const getHealthSummary = () => {
    if (!animal?.saludActual) return "Sin información de salud disponible";
    
    const salud = animal.saludActual;
    const summary = [];
    
    if (salud.estadoGeneral) summary.push(`Estado general: ${salud.estadoGeneral}`);
    
    // Vacunación
    const vacunas = [];
    if (salud.vacunacion?.rabia?.aplicada) vacunas.push("rabia");
    if (salud.vacunacion?.leucemia?.aplicada) vacunas.push("leucemia");
    if (salud.vacunacion?.polivalente?.aplicada) vacunas.push("polivalente");
    if (salud.vacunacion?.otra?.aplicada) vacunas.push(salud.vacunacion.otra.nombre || "otra vacuna");
    if (vacunas.length > 0) summary.push(`Vacunas: ${vacunas.join(", ")}`);
    
    // Desparasitación
    const desparasitaciones = [];
    if (salud.desparasitacion?.interna?.aplicada) desparasitaciones.push("interna");
    if (salud.desparasitacion?.externa?.aplicada) desparasitaciones.push("externa");
    if (desparasitaciones.length > 0) summary.push(`Desparasitación: ${desparasitaciones.join(" y ")}`);
    
    if (salud.esterilizacion === "Si") {
      summary.push(`Esterilizado/a${salud.fechaEsterilizacion ? ` (${salud.fechaEsterilizacion})` : ""}`);
    }
    
    if (salud.condicionesMedicas) summary.push(`Condiciones médicas: ${salud.condicionesMedicas}`);
    if (salud.alergias) summary.push(`Alergias: ${salud.alergias}`);
    if (salud.dietaEspecial) summary.push(`Dieta especial: ${salud.dietaEspecial}`);
    
    return summary.length > 0 ? summary.join(". ") + "." : "Sin información de salud disponible";
  };

  // Función para generar los requisitos de adopción
  const getAdoptionRequirements = () => {
    const requirements = [];
    const comportamiento = animal?.comportamiento || {};
    const salud = animal?.saludActual || {};
    
    if (!animal) return ["No hay requisitos especiales para la adopción"];
    
    if (comportamiento.temperamento?.toLowerCase().includes("temeroso") || 
        comportamiento.temperamento?.toLowerCase().includes("reactivo")) {
      requirements.push("Tener experiencia previa con animales tímidos o con problemas de conducta");
    }
    
    if (comportamiento.compatibilidad?.gatos === "No") {
      requirements.push("No tener gatos en el hogar");
    }
    if (comportamiento.compatibilidad?.perros === "Si") {
      requirements.push("Recomendable vivir con otro perro (es sociable)");
    }
    
    if (comportamiento.nivelEntrenamiento === "Bajo") {
      requirements.push("Tener tiempo y disposición para entrenarlo en casa");
    }
    
    if (salud.dietaEspecial) {
      requirements.push("Tener disponibilidad para dieta especial");
    }
    
    if (animal.tamaño === "Grande") {
      requirements.push("Casa con patio amplio (no apto para departamentos pequeños)");
    }
    
    if (animal.unidadEdad === "meses" || (animal.edad && parseInt(animal.edad) < 2 && animal.unidadEdad === "años")) {
      requirements.push("Persona con tiempo para entrenar y supervisar constantemente (es cachorro)");
    }
    
    if (comportamiento.necesidadesEspeciales) {
      requirements.push(comportamiento.necesidadesEspeciales);
    }
    
    return requirements.length > 0 ? requirements : ["No hay requisitos especiales para la adopción"];
  };

  if (!animal) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 container mx-auto p-6 mt-16 max-w-4xl text-center">
          <p>No se encontró información del animal. Por favor, regresa a la lista.</p>
          <button
            onClick={handleBackClick}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
          >
            Volver
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Contenido principal */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-emerald-600 hover:text-emerald-800 mb-6 cursor-pointer"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la lista
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Sección de imágenes */}
            <div className="lg:sticky lg:top-4">
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <MiniCarrusel
                  images={animal.fotos || []} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Sección de información */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{animal.nombre}</h1>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    animal.especie === 'Perro' ? 'bg-blue-100 text-blue-800' :
                    animal.especie === 'Gato' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {animal.especie}
                  </span>
                  <span className="ml-4 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    {animal.estado}
                  </span>
                </div>
              </div>

              {/* Datos básicos */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Raza</p>
                  <p className="font-medium">{animal.raza || 'Sin raza especificada'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Edad</p>
                  <p className="font-medium">{animal.edad} {animal.unidadEdad}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Sexo</p>
                  <p className="font-medium">{animal.sexo}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Tamaño</p>
                  <p className="font-medium">{animal.tamaño}</p>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Sobre {animal.nombre}</h2>
                <p className="text-gray-700">
                  {animal.descripcion || 'No hay descripción disponible.'}
                </p>
              </div>

              {/* Personalidad */}
              {animal.comportamiento?.temperamento && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Personalidad</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                      {animal.comportamiento.temperamento}
                    </span>
                    {animal.comportamiento.compatibilidad?.perros === "Si" && (
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                        Compatible con perros
                      </span>
                    )}
                    {animal.comportamiento.compatibilidad?.gatos === "Si" && (
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                        Compatible con gatos
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Historia */}
              {(animal.procedencia || animal.notasProcedencia) && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Historia</h2>
                  <p className="text-gray-700">
                    {animal.procedencia || ''}
                    {animal.notasProcedencia && ` ${animal.notasProcedencia}`}
                  </p>
                </div>
              )}

              {/* Salud */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Salud</h2>
                <p className="text-gray-700">{getHealthSummary()}</p>
              </div>

              {/* Requisitos */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Requisitos de adopción</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {getAdoptionRequirements().map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
                {animal.estado !== "Disponible" && (
                <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Este compañero ya tiene proceso de adopción en curso</h3>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {/* Plan 1: Lista de espera */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-emerald-100">
                      <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-lg mb-2">Lista de espera</h4>
                      <p className="text-gray-600 mb-3">Si la adopción no se concreta, te contactaremos para que seas el primero en conocerlo.</p>
                      <button 
                        onClick={() => navigate('/login', { state: { listaEspera: animal.id } })}
                        className="text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center cursor-pointer"
                      >
                        Unirme a la lista
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Plan 2: Animales similares */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
                      <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-lg mb-2">Conoce similares</h4>
                      <p className="text-gray-600 mb-3">Tenemos otros compañeros con características similares esperando un hogar.</p>
                      <button 
                        onClick={() => navigate('/animales', { state: { filtro: animal.especie } })}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center cursor-pointer"
                      >
                        Ver {animal.especie === 'Perro' ? 'perritos' : animal.especie === 'Gato' ? 'gatitos' : 'animales'}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Plan 3: Apadrinamiento */}
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
                      <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-lg mb-2">Apadrina</h4>
                      <p className="text-gray-600 mb-3">Colabora con su manutención mientras espera su hogar definitivo.</p>
                      <button 
                        onClick={() => navigate('/apadrina', { state: { animalId: animal.id } })}
                        className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center cursor-pointer"
                      >
                        Conoce cómo ayudar
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h4 className="font-medium text-emerald-800 mb-2">¿Por qué algunos animales no están disponibles?</h4>
                    <p className="text-sm text-emerald-700">
                      Cuando un animal está en proceso de adopción, damos tiempo para que adoptante y animal se conozcan.
                      Si no hay compatibilidad, volverá a estar disponible. ¡No te desanimes!
                    </p>
                  </div>
                </div>
              )}

              {/* Botón de adopción */}
              <button
                onClick={handleAdoptClick}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer"
              >
                ¡Quiero adoptar!
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Detalles;