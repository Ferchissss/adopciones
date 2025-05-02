// components/MiniCarrusel.js
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MiniCarrusel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-200 rounded-lg h-48 text-gray-400">
        Sin imagen
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={images[currentIndex]}
        alt={`Imagen ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />

      {/* Mostrar controles solo si hay más de una imagen y está en hover */}
      {images.length > 1 && isHovered && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity duration-200 cursor-pointer"
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity duration-200 cursor-pointer"
          >
            <FaChevronRight size={14} />
          </button>
        </>
      )}

      {/* Indicadores de posición (solo visibles en hover cuando hay múltiples imágenes) */}
      {images.length > 1 && isHovered && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${currentIndex === index ? 'bg-emerald-500 w-4' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MiniCarrusel;