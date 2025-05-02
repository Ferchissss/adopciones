import React, { useState } from "react";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
import { useAuth } from "../../components/AuthContext";

const VolunSlideHeader = ({ title, toggleSidebar, isCollapsed }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { usuario } = useAuth(); // Obtener el usuario admin actual

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div
      className={`bg-white shadow-md py-4 px-6 flex items-center justify-between fixed top-0 z-50 transition-all duration-300`}
      style={{
        left: isCollapsed ? "5rem" : "16rem", // Ajusta la posición según el estado del sidebar
        width: isCollapsed ? "calc(100% - 5rem)" : "calc(100% - 16rem)", // Ajusta el ancho dinámicamente
        height: "4rem", // Define explícitamente la altura del header
      }}
    >
      {/* Botón para alternar el sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-emerald-600 focus:outline-none hover:text-emerald-800"
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Título */}
      <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
        {title || "Dashboard de Voluntario"}
      </h1>

      {/* Barra de herramientas */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        {/* Barra de búsqueda (oculta en pantallas pequeñas) */}
        <div className="relative hidden sm:block">
          <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
          />
        </div>

        {/* Ícono de búsqueda para pantallas pequeñas */}
        <button className="text-gray-500 hover:text-gray-800 sm:hidden">
          <FaSearch className="text-xl" />
        </button>

        {/* Notificaciones */}
        <div className="relative">
          <button className="text-gray-500 hover:text-gray-800">
            <FaBell className="text-xl" />
          </button>
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </div>

        {/* Menú de usuario */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src="/default-user.jpg" // Imagen de perfil por defecto
              alt="Voluntario"
              className="w-8 h-8 rounded-full"
            />
            {usuario?.displayName && (
  <span className="text-gray-700 font-medium hidden sm:block">
    {usuario.displayName} ↆ
  </span>
)}

          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-48">
              <ul className="py-2">
                <li>
                  <a
                    href="/voluntario/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Perfil
                  </a>
                </li>
                <li>
                  <a
                    href="/logout"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunSlideHeader;