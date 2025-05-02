import React from "react";
import { PawPrint } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-emerald-800 text-white py-8 px-6">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-8 w-8" />
              <h2 className="text-xl font-bold">PetRescue</h2>
            </div>
            <p className="text-emerald-100">
              Plataforma dedicada a facilitar la gestión de refugios y la
              adopción responsable de animales.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-emerald-100 hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/animales" className="text-emerald-100 hover:text-white">
                  Animales
                </a>
              </li>
              <li>
                <a
                  href="/adopcion"
                  className="text-emerald-100 hover:text-white"
                >
                  Proceso de Adopción
                </a>
              </li>
              <li>
                <a
                  href="/voluntarios"
                  className="text-emerald-100 hover:text-white"
                >
                  Voluntariado
                </a>
              </li>
            </ul>
          </div>

          {/* Access Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Accesos</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin"
                  className="text-emerald-100 hover:text-white"
                >
                  Administradores
                </a>
              </li>
              <li>
                <a
                  href="/voluntarios"
                  className="text-emerald-100 hover:text-white"
                >
                  Voluntarios
                </a>
              </li>
              <li>
                <a
                  href="/adoptantes"
                  className="text-emerald-100 hover:text-white"
                >
                  Adoptantes
                </a>
              </li>
              <li>
                <a
                  href="/registro"
                  className="text-emerald-100 hover:text-white"
                >
                  Registro
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-emerald-100">Teléfono: (123) 456-7890</li>
              <li className="text-emerald-100">Email: contacto@petrescue.com</li>
              <li className="text-emerald-100">
                Dirección: Calle Principal 123, Ciudad
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-700 mt-8 pt-8 text-center text-emerald-100">
          <p>&copy; {new Date().getFullYear()} PetRescue. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;