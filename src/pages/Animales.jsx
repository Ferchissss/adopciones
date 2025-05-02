import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Footer from '../components/Footer';
import Navbar from "../components/Navbar";
import MiniCarrusel from '../components/administradorcompon/AdminCarrusel';

const AnimalesPublico = () => {
  const [filter, setFilter] = useState('Todos');
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar animales desde Firebase
  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "animales"),
          where("datosFijos.estado", "in", ["Disponible", "En adopción"])
        );
        
        const querySnapshot = await getDocs(q);
        const animalesData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          animalesData.push({
            id: doc.id,
            ...data.datosFijos,
            saludActual: data.saludActual || {},
            comportamiento: data.comportamiento || {},
            fotos: data.datosFijos.fotos || []
          });
        });
        
        setAnimales(animalesData);
      } catch (error) {
        console.error("Error al cargar animales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimales();
  }, []);

  // Filtrar animales según la categoría seleccionada
  const filteredAnimals = animales.filter(animal => {
    return filter === 'Todos' || 
           (filter === 'Perro' && animal.especie === 'Perro') ||
           (filter === 'Gato' && animal.especie === 'Gato') ||
           (filter === 'Otros' && animal.especie !== 'Perro' && animal.especie !== 'Gato');
  });

  return (
    <div className="bg-emerald-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="container mx-auto py-16 px-6">
          {/* Title Section */}
          <h1 className="text-4xl font-bold text-center text-emerald-800 mb-6">Nuestros Animales</h1>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
            Conoce a nuestros adorables amigos que están esperando un hogar. Todos nuestros animales
            están vacunados, desparasitados y listos para formar parte de tu familia.
          </p>

          {/* Filter Section */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Todos', 'Perro', 'Gato', 'Otros'].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 font-semibold rounded border-2 transition-all duration-200 cursor-pointer ${
                  filter === category
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'text-emerald-600 border-emerald-600 hover:bg-emerald-50'
                }`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Mostrar loading si está cargando */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            /* Animal Cards */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAnimals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                >
                  {/* Carrusel de imágenes */}
                  <div className="h-64 w-full overflow-hidden">
                    <MiniCarrusel
                      images={animal.fotos} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-emerald-800">{animal.nombre}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        animal.especie === 'Perro' ? 'bg-blue-100 text-blue-800' :
                        animal.especie === 'Gato' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {animal.especie}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      <p>
                        <span className="font-medium">Raza:</span> {animal.raza || 'Sin raza especificada'}<br />
                        <span className="font-medium">Edad:</span> {animal.edad} {animal.unidadEdad}<br />
                        <span className="font-medium">Sexo:</span> {animal.sexo}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {animal.descripcion || 'Sin descripción disponible'}
                    </p>
                    
                    {/* Características basadas en comportamiento */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {animal.comportamiento?.temperamento && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          {animal.comportamiento.temperamento}
                        </span>
                      )}
                      {animal.comportamiento?.compatibilidad?.perros === "Si" && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          Bueno con perros
                        </span>
                      )}
                      {animal.comportamiento?.compatibilidad?.gatos === "Si" && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          Bueno con gatos
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between gap-3">
                      <button 
                        className="flex-1 py-2 font-semibold text-emerald-600 border-2 border-emerald-600 rounded hover:bg-emerald-50 transition-all duration-200 cursor-pointer"
                        onClick={() => navigate(`/animales/detalle/${animal.id}`, { state: { animal } })}
                      >
                        Ver detalles
                      </button>
                      <button 
                        className="flex-1 py-2 font-semibold text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-all duration-200 cursor-pointer"
                        onClick={() => navigate('/login')}
                      >
                        Adoptar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredAnimals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay animales disponibles en esta categoría actualmente.</p>
              <button 
                onClick={() => setFilter('Todos')}
                className="mt-4 px-6 py-2 font-semibold text-emerald-600 border-2 border-emerald-600 rounded hover:bg-emerald-50 transition-all duration-200"
              >
                Ver todos los animales
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AnimalesPublico;