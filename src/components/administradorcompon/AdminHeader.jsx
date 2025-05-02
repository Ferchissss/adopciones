import React, { useState } from "react";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";

const AdminHeader = ({ title, toggleSidebar, isCollapsed }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div
      className={`bg-white shadow-md py-4 px-6 flex items-center justify-between fixed top-0 z-50 transition-all duration-300`}
      style={{
        left: isCollapsed ? "5rem" : "16rem", // Ajusta la posición según el estado del sidebar
        width: isCollapsed ? "calc(100% - 5rem)" : "calc(100% - 16rem)", // Ajusta el ancho dinámicamente
      }}
    >
      {/* Botón para alternar el sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-emerald-600 focus:outline-none hover:text-emerald-800 cursor-pointer"
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Título */}
      <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
        {title}
      </h1>

      {/* Barra de herramientas */}
      <div className="flex items-center space-x-4 sm:space-x-6">

        {/* Notificaciones */}
        <div className="relative">
          <button className="text-gray-500 hover:text-gray-800">
            <FaBell className="text-xl" />
          </button>
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>

        {/* Menú de usuario */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center space-x-2 focus:outline-none cursor-pointer"
          >
            <img
              src="/admin.png"
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-gray-700 font-medium hidden sm:block">
              Admin ↆ
            </span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-48">
              <ul className="py-2">
                <li>
                  <a
                    href="/admin/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Mi Cuenta
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Perfil
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Configuración
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

export default AdminHeader;