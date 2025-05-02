import React from "react";
import Footer from "../components/Footer"; // Asegúrate de que esta ruta sea correcta
import Navbar from "../components/Navbar"; // Asegúrate de que esta ruta sea correcta
import { CheckCircle } from "lucide-react";

const Adopciones = () => {
  return (
    <div className="bg-emerald-50 min-h-screen flex flex-col">
      <Navbar /> {/* Navbar agregado */}
      <div className="flex-1">
        <div className="container mx-auto py-16 px-6">
          {/* Sección de Título */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-emerald-800 mb-4">Proceso de Adopción</h1>
            <p className="text-lg max-w-3xl mx-auto text-gray-700">
              Adoptar una mascota es una decisión importante que implica compromiso y responsabilidad. Aquí te explicamos
              cómo funciona nuestro proceso de adopción.
            </p>
          </div>

          {/* Cards del Proceso de Adopción */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "1. Selección",
                description:
                  "Explora nuestro catálogo de animales y encuentra a tu compañero ideal. Puedes filtrar por tipo, edad y otras características.",
              },
              {
                title: "2. Solicitud",
                description:
                  "Completa el formulario de adopción con tus datos y responde algunas preguntas sobre tu estilo de vida y experiencia con mascotas.",
              },
              {
                title: "3. Entrevista",
                description:
                  "Nuestro equipo revisará tu solicitud y te contactará para una entrevista donde podrás conocer más sobre el animal y resolver tus dudas.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="bg-emerald-100 p-4 rounded-full mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                  <span className="text-emerald-600 text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Requisitos y Cuota */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">Requisitos para adoptar</h2>
              <ul className="space-y-3">
                {[
                  "Ser mayor de edad y presentar identificación oficial",
                  "Comprometerse a proporcionar cuidados veterinarios regulares",
                  "Tener un espacio adecuado para la mascota según su tamaño y necesidades",
                  "Aceptar una visita de seguimiento después de la adopción",
                  "Firmar un contrato de adopción responsable",
                  "Pagar la cuota de adopción que cubre vacunas y esterilización",
                ].map((req, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-emerald-600 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">Cuota de adopción</h2>
              <p className="mb-4 text-gray-700">
                Nuestra cuota de adopción ayuda a cubrir parte de los gastos veterinarios, alimentación y cuidados que
                reciben nuestros animales mientras están en el refugio.
              </p>

              <div className="space-y-4">
  {[
    { type: "Perros", description: "Incluye vacunas, desparasitación y esterilización", price: "500 Bs." },
    { type: "Gatos", description: "Incluye vacunas, desparasitación y esterilización", price: "200 Bs." },
    { type: "Otros animales", description: "Varía según la especie", price: "Consultar" },
  ].map((fee, index) => (
    <div
      key={index}
      className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center transform transition-transform duration-300 hover:translate-y-[-5px] hover:translate-x-[5px]"
    >
      <div>
        <h3 className="font-semibold">{fee.type}</h3>
        <p className="text-sm text-gray-500">{fee.description}</p>
      </div>
      <span className="text-xl font-bold text-emerald-700">{fee.price}</span>
    </div>
  ))}
</div>
            </div>
          </div>

          {/* Preguntas frecuentes */}
          <div className="bg-emerald-100 p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4 text-center">Preguntas frecuentes</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  q: "¿Puedo adoptar si vivo en un apartamento?",
                  a: "Sí, muchos de nuestros animales se adaptan perfectamente a la vida en apartamentos.",
                },
                {
                  q: "¿Todos los animales están esterilizados?",
                  a: "Todos nuestros animales adultos están esterilizados. En el caso de cachorros o gatitos muy jóvenes, se entrega un voucher.",
                },
                {
                  q: "¿Cuánto tiempo tarda el proceso de adopción?",
                  a: "El proceso completo suele tomar entre 1 y 2 semanas.",
                },
                {
                  q: "¿Qué pasa si la adopción no funciona?",
                  a: "Siempre aceptamos de vuelta a nuestros animales si por alguna razón la adopción no funciona.",
                },
              ].map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-lg">{faq.q}</h3>
                  <p className="text-gray-700 mt-1">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Llamado a la Acción */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">¿Listo para adoptar?</h2>
            <p className="mb-6 max-w-2xl mx-auto text-gray-700">
              Explora nuestro catálogo de animales disponibles y encuentra a tu compañero perfecto.
            </p>
            <div className="flex justify-center">
              <a href="/animales" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 mr-4">
                Ver animales disponibles
              </a>
              <a href="/sobre-nosotros" className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50">
                Contactar al refugio
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Adopciones;