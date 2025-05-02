import React, { useState, useEffect } from "react";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

const AdoptSlideHeader = ({ title, toggleSidebar, isCollapsed, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [nombre, setNombre] = useState("");

  // Obtener nombre del usuario autenticado
  useEffect(() => {
    const obtenerNombre = async () => {
      const user = auth.currentUser;  // Obtiene el usuario autenticado

      if (user) {
        const userRef = doc(db, "users", user.uid);  // Accede al documento del usuario
        const docSnap = await getDoc(userRef);  // Obtiene el documento

        if (docSnap.exists()) {
          setNombre(docSnap.data().nombre);  // Guarda el nombre en el estado
        } else {
          console.log("Usuario no encontrado");
        }
      }
    };

    obtenerNombre();
  }, []); 

  return (
    <div
      className={`bg-white shadow-md py-4 px-6 flex items-center justify-between fixed top-0 z-50 transition-all duration-300`}
      style={{
        left: isCollapsed ? "5rem" : "16rem", // Adjust position based on sidebar state
        width: isCollapsed ? "calc(100% - 5rem)" : "calc(100% - 16rem)", // Adjust width dynamically
      }}
    >
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="text-emerald-600 focus:outline-none hover:text-emerald-800 cursor-pointer"
      >
        <FaBars className="text-2xl" />
      </button>

      {/* Title */}
      <h1 className="text-xl font-bold text-gray-800 hidden sm:block">{title}</h1>

      {/* Toolbar */}
      <div className="flex items-center space-x-4 sm:space-x-6">

        {/* Notifications */}
        <div className="relative">
          <button className="text-gray-500 hover:text-gray-800">
            <FaBell className="text-xl" />
          </button>
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            1
          </span>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center space-x-2 focus:outline-none cursor-pointer"
          >
            <FaUserCircle className="text-2xl text-emerald-700" />
            <span className="text-gray-700 font-medium hidden sm:block">
              {nombre ? nombre : "Cargando..."} ↆ
            </span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-48">
              <ul className="py-2">
                <li>
                  <a
                    href="/adoptantes/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Mi Cuenta
                  </a>
                </li>
                <li>
                  <a
                    href="/adoptantes/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Perfil
                  </a>
                </li>
                <li>
                  <a
                    href="/adoptantes/settings"
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

export default AdoptSlideHeader;