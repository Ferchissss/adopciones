import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { FaPaw, FaSignOutAlt } from "react-icons/fa";

const VolunSlideBar = ({ isCollapsed }) => {
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
      {/* Logo y Título */}
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

      {/* Menú de Navegación */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-4">
          <li>
            <Link
              to="/voluntario/tareas"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:bg-emerald-800 p-2 rounded-lg`}
            >
              <ClipboardDocumentListIcon className="h-6 w-6" />
              {!isCollapsed && <span>Tareas</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/voluntario/reportes"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:bg-emerald-800 p-2 rounded-lg`}
            >
              <DocumentTextIcon className="h-6 w-6" />
              {!isCollapsed && <span>Reportes</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Cerrar Sesión */}
      <div className="px-2 py-4 border-t border-emerald-600">
      <button
          onClick={handleLogout}
          className={`flex items-center w-full ${
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

export default VolunSlideBar;