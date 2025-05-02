import React, { useState } from "react";
import { PawPrint } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-emerald-600 text-white py-4 px-6 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <PawPrint className="h-8 w-8" />
          <h1 className="text-2xl font-bold">PetRescue</h1>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          type="button"
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          ☰
        </button>

        {/* Navigation Links */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row gap-6 absolute top-full left-0 w-full md:static md:w-auto bg-emerald-600 md:bg-transparent z-50`}
        >
          <a
            href="/"
            className="block px-4 py-2 md:px-0 md:py-0 hover:underline font-medium text-white hover:text-gray-200"
          >
            Inicio
          </a>
          <a
            href="/animales"
            className="block px-4 py-2 md:px-0 md:py-0 hover:underline font-medium text-white hover:text-gray-200"
          >
            Animales
          </a>
          <a
            href="/adopciones"
            className="block px-4 py-2 md:px-0 md:py-0 hover:underline font-medium text-white hover:text-gray-200"
          >
            Adopción
          </a>
          <a
            href="/sobre-nosotros"
            className="block px-4 py-2 md:px-0 md:py-0 hover:underline font-medium text-white hover:text-gray-200"
          >
            Sobre Nosotros
          </a>
        </nav>

        {/* Buttons */}
        <div className="hidden md:flex gap-3">
          <a
            href="/login"
            className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50"
          >
            Iniciar Sesión
          </a>
          <a
            href="/register"
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-800"
          >
            Registrarse
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;