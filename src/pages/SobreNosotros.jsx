import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FaPaw, FaCut, FaUsers, FaClock } from "react-icons/fa";

const SobreNosotros = () => {
  return (
    <div className="bg-emerald-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="container mx-auto py-16 px-6">
          {/* Sección de Introducción */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">Sobre Nosotros</h1>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Conoce nuestra historia, misión, visión, logros, equipo, colaboradores e instalaciones que hacen posible nuestro trabajo en el refugio de animales.
            </p>
          </div>

          {/* Nuestra Historia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">Nuestra Historia</h2>
              <p className="text-gray-700 mb-4">
                Fundado en 2010, nuestro refugio comenzó como una pequeña iniciativa de un grupo de amantes de los animales preocupados por el creciente número de animales abandonados en nuestra comunidad.
              </p>
              <p className="text-gray-700 mb-4">
                Lo que comenzó con un pequeño espacio y unos pocos voluntarios, ha crecido hasta convertirse en un refugio reconocido que ha ayudado a más de 5,000 animales a encontrar hogares amorosos.
              </p>
              <p className="text-gray-700">
                Hoy, contamos con instalaciones modernas, un equipo de veterinarios dedicados y una red de más de 100 voluntarios comprometidos con nuestra causa.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg h-80">
              <img
                src="https://images.unsplash.com/photo-1455103493930-a116f655b6c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Fundadores del refugio con animales"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Nuestra Misión y Visión */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-emerald-100 p-8 rounded-lg mb-16">
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">Nuestra Misión</h2>
              <p className="text-gray-700">
                Proporcionar refugio, cuidado y amor a animales abandonados o maltratados, trabajando para encontrarles hogares permanentes y responsables. Además, educamos a la comunidad sobre la tenencia responsable de mascotas y promovemos la esterilización como método para controlar la población animal.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">Nuestra Visión</h2>
              <p className="text-gray-700">
                Aspiramos a un mundo donde todos los animales sean tratados con respeto y compasión, donde no exista el abandono ni el maltrato animal, y donde cada mascota tenga un hogar amoroso que le proporcione los cuidados que merece durante toda su vida.
              </p>
            </div>
          </div>

          {/* Nuestros Logros */}
          <div className="bg-emerald-100 p-8 rounded-lg mb-16">
  <h2 className="text-2xl font-bold text-emerald-800 mb-8 text-center">Nuestros Logros</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
    {[
      {
        value: "5,000+",
        description: "Animales adoptados",
        icon: <FaPaw className="text-emerald-600 text-3xl mx-auto" />
      },
      {
        value: "10,000+",
        description: "Esterilizaciones realizadas",
        icon: <FaCut className="text-emerald-600 text-3xl mx-auto" />
      },
      {
        value: "100+",
        description: "Voluntarios activos",
        icon: <FaUsers className="text-emerald-600 text-3xl mx-auto" />
      },
      {
        value: "12",
        description: "Años de servicio",
        icon: <FaClock className="text-emerald-600 text-3xl mx-auto" />
      },
    ].map((logro, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1"
      >
        <div className="mb-2">{logro.icon}</div>
        <h3 className="text-3xl font-bold text-emerald-800">{logro.value}</h3>
        <p className="text-gray-700 mt-2">{logro.description}</p>
      </div>
    ))}
  </div>
</div>

          {/* Nuestro Equipo */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-emerald-800 mb-8 text-center">Nuestro Equipo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  name: "María Rodríguez",
                  role: "Directora",
                  description: "Veterinaria con más de 15 años de experiencia en protección animal.",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                },
                {
                  name: "Carlos Gómez",
                  role: "Veterinario Jefe",
                  description: "Especialista en medicina de pequeños animales y cirugía.",
                  image: "https://images.unsplash.com/photo-1562788869-4ed32648eb72?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                },
                {
                  name: "Laura Martínez",
                  role: "Coordinadora de Adopciones",
                  description: "Dedicada a encontrar el hogar perfecto para cada uno de nuestros animales.",
                  image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                },
                {
                  name: "Javier López",
                  role: "Coordinador de Voluntarios",
                  description: "Organiza y capacita a nuestro increíble equipo de voluntarios.",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                },
              ].map((member, index) => (
                <div key={index} className="text-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-emerald-800">{member.name}</h3>
                    <p className="text-sm text-emerald-600 font-semibold">{member.role}</p>
                    <p className="text-sm text-gray-700 mt-2">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nuestras Instalaciones */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-emerald-800 mb-8 text-center">Nuestras Instalaciones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Área de Perros",
                  description: "Espacios amplios con zonas cubiertas y al aire libre para ejercicio.",
                  image: "https://plus.unsplash.com/premium_photo-1668114375111-e90b5e975df6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                {
                  title: "Área de Gatos",
                  description: "Ambiente tranquilo con áreas de juego y descanso para nuestros felinos.",
                  image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                },
                {
                  title: "Clínica Veterinaria",
                  description: "Equipada para proporcionar atención médica completa a nuestros animales.",
                  image: "https://plus.unsplash.com/premium_photo-1677165479692-180fac4c0832?q=80&w=2055&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
              ].map((facility, index) => (
                <div key={index} className="text-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-emerald-800">{facility.title}</h3>
                    <p className="text-sm text-gray-700 mt-2">{facility.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa de Ubicación con marcador de huella */}
          <div className="mb-16">
  <div className="bg-white rounded-xl shadow-xl overflow-hidden">
    {/* Encabezado de la tarjeta */}
    <div className="bg-emerald-600 p-6 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Visítanos en Nuestro Refugio</h2>
      <p className="text-emerald-100">¡Estaremos encantados de recibirte!</p>
    </div>

    {/* Contenido de la tarjeta */}
    <div className="p-6">
      {/* Mapa */}
      <div className="rounded-lg overflow-hidden shadow-md h-96 relative mb-6 border-2 border-emerald-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209132713!2d-73.9888756845938!3d40.7484404793279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMTMuNiJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Ubicación del Refugio"
        ></iframe>
      </div>

      {/* Información de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
          <h3 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Información de Ubicación
          </h3>
          <p className="text-gray-700 mb-2">
            <span className="font-medium text-emerald-700">Dirección:</span> Calle de los Animales 123, Ciudad Animal
          </p>
          <p className="text-gray-700">
            <span className="font-medium text-emerald-700">Barrio:</span> Zona Residencial Las Mascotas
          </p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
          <h3 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Horario de Atención
          </h3>
          <p className="text-gray-700 mb-2">
            <span className="font-medium text-emerald-700">Lunes a Viernes:</span> 9:00 - 18:00
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-medium text-emerald-700">Sábados:</span> 10:00 - 14:00
          </p>
          <p className="text-gray-700">
            <span className="font-medium text-emerald-700">Domingos:</span> Cerrado
          </p>
        </div>
      </div>

      {/* Nota adicional */}
      <div className="mt-6 text-center bg-amber-50 p-4 rounded-lg border border-amber-100">
        <p className="text-amber-800 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Por favor, llama antes de visitarnos para confirmar disponibilidad.</span>
        </p>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SobreNosotros;