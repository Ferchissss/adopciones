import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import {
  FaHome,
  FaHeart,
  FaPaw,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

const AdoptSlidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirigir a login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-emerald-700 text-white h-screen fixed top-0 left-0 flex flex-col transition-all duration-300`}
    >
      {/* Logo and Title */}
      <div className="flex items-center justify-center py-4">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <FaPaw className="text-3xl" />
          {!isCollapsed && <span className="text-xl font-bold">Pet Rescue</span>}
        </div>
      </div>
      <div className="border-t border-emerald-600"></div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-4">
          <li>
            <Link
              to="/adoptante/animales"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:text-emerald-300 ${
                location.pathname === "/adoptantes/explorar"
                  ? "text-emerald-300"
                  : ""
              }`}
            >
              <FaPaw />
              {!isCollapsed && <span>Explorar Animales</span>}
            </Link>
          </li>
        
          <li>
            <Link
              to="/adoptante/mis-solicitudes"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:text-emerald-300 ${
                location.pathname === "/adoptantes/solicitudes"
                  ? "text-emerald-300"
                  : ""
              }`}
            >
              <FaClipboardList />
              {!isCollapsed && <span>Mis Solicitudes</span>}
            </Link>
          </li>
        
        </ul>
      </nav>

      {/* Log Out */}
      <div className="px-2 py-4 border-t border-emerald-600">
      <button
          onClick={handleLogout}
          className={`flex items-center w-full cursor-pointer ${
            isCollapsed ? "justify-center" : "space-x-3"
          } hover:text-emerald-300`}
        >
          <FaSignOutAlt />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default AdoptSlidebar;