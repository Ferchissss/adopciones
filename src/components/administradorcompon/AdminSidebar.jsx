import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut, getAuth } from "firebase/auth";

import {
  FaTachometerAlt,
  FaPaw,
  FaUserFriends,
  FaFileAlt,
  FaCog,
  FaHeart,
  FaSignOutAlt,
  FaTasks,
} from "react-icons/fa";

const AdminSidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      const auth1 = getAuth();
            const user3 = auth1.currentUser;
      
            console.log(user3);
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
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
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
              to="/admin"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:text-emerald-300 ${
                location.pathname === "/admin" ? "text-emerald-300" : ""
              }`}
            >
              <FaTachometerAlt />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li>
          <Link
              to="/admin/animales"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:text-emerald-300 ${
                location.pathname === "/admin/animales" ? "text-emerald-300" : ""
              }`}
            >
              <FaPaw />
              {!isCollapsed && <span>Animales</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/adopciones"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:text-emerald-300`}
            >
              <FaHeart />
              {!isCollapsed && <span>Adopciones</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/voluntarios"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:text-emerald-300`}
            >
              <FaUserFriends />
              {!isCollapsed && <span>Voluntarios</span>}
            </Link>
          </li>          <li>
            <Link
              to="/admin/tareas"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:text-emerald-300`}
            >
              <FaTasks />
              {!isCollapsed && <span>Tareas de Voluntarios</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/reportes"
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } hover:text-emerald-300`}
            >
              <FaFileAlt />
              {!isCollapsed && <span>Reportes</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Cerrar Sesión */}
      <div className="px-2 py-4 border-t border-emerald-600">
      <button
          onClick={handleLogout}
          className={`cursor-pointer flex items-center w-full ${
            isCollapsed ? "justify-center" : "space-x-3"
          } hover:text-emerald-300`}
        >
          <FaSignOutAlt />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p>¿Estás seguro que deseas cerrar sesión?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setShowLogoutConfirm(false)}>Cancelar</button>
              <button onClick={handleLogout} className="bg-red-500 text-white cursor-pointer">Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;