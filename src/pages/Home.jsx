import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Import icons (you can use react-icons or custom SVGs)
import { FaClipboardList, FaChartBar, FaImages, FaClock, FaClipboardCheck, FaUsers } from "react-icons/fa";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-emerald-50 py-16 px-6">
          <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
            {/* Text Section */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-800">
                Encuentra un amigo para toda la vida
              </h1>
              <p className="text-lg text-gray-700">
                Nuestra plataforma conecta refugios de animales con personas que
                desean adoptar, facilitando el proceso de adopción responsable y
                el seguimiento del bienestar animal.
              </p>
              <div className="flex gap-4">
                <a
                  href="/animales"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
                >
                  Ver Animales
                </a>
                <a
                  href="/adopciones"
                  className="border-2 border-emerald-600 text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition duration-300 transform hover:scale-105"
                >
                  Proceso de adopcion 
                </a>
              </div>
            </div>

            {/* Image Section */}
            <div className="rounded-lg overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Red de refugios de animales conectados"
                className="w-full h-auto object-cover transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-emerald-800">
              Características Principales
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards with Custom Icons */}
              {[
                {
                  title: "Fichas Médicas Completas",
                  description: "Registro detallado del historial médico, vacunaciones y tratamientos de cada animal.",
                  icon: <FaClipboardList className="text-emerald-600 text-2xl" />,
                },
                {
                  title: "Reportes y Estadísticas",
                  description: "Informes detallados sobre rescates, adopciones y estado general del refugio.",
                  icon: <FaChartBar className="text-emerald-600 text-2xl" />,
                },
                {
                  title: "Galería Fotográfica",
                  description: "Imágenes actualizadas de cada animal para mostrar su evolución y facilitar su adopción.",
                  icon: <FaImages className="text-emerald-600 text-2xl" />,
                },
                {
                  title: "Seguimiento Post-Adopción",
                  description: "Control y apoyo continuo después de la adopción para asegurar el bienestar animal.",
                  icon: <FaClock className="text-emerald-600 text-2xl" />,
                },
                {
                  title: "Proceso de Adopción",
                  description: "Formularios y verificaciones para garantizar adopciones responsables y adecuadas.",
                  icon: <FaClipboardCheck className="text-emerald-600 text-2xl" />,
                },
                {
                  title: "Gestión de Voluntarios",
                  description: "Coordinación de actividades y horarios para el equipo de voluntarios del refugio.",
                  icon: <FaUsers className="text-emerald-600 text-2xl" />,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-emerald-100 p-2 rounded-full mr-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 pl-12">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;