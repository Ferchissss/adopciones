import React from "react";

const PendingAdoptionsTable = ({ adoptions }) => {
  const requests = [
    { id: "#S001", applicant: "María González", animal: "Simba (#A002)", date: "22/04/2023", status: "Pendiente" },
    { id: "#S002", applicant: "Juan Pérez", animal: "Rocky (#A003)", date: "23/04/2023", status: "Pendiente" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Solicitudes de Adopción Pendientes</h3>
      <p className="text-sm text-gray-600 mb-4">Solicitudes que requieren revisión y aprobación</p>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border-b px-4 py-2 text-left text-gray-600 font-medium">Solicitante</th>
            <th className="border-b px-4 py-2 text-left text-gray-600 font-medium">Animal</th>
            <th className="border-b px-4 py-2 text-left text-gray-600 font-medium">Fecha Solicitud</th>
            <th className="border-b px-4 py-2 text-left text-gray-600 font-medium">Estado</th>
            <th className="border-b px-4 py-2 text-left text-gray-600 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
        {adoptions.map((adoption) => (
            <tr key={adoption.id}>
              <td className="border-b px-4 py-2">
                <div className="text-sm font-medium text-gray-900">{adoption.nombreCompleto}</div>
                <div className="text-sm text-gray-500">{adoption.correoElectronico}</div>
              </td>
              <td className="border-b px-4 py-2">{adoption.nombreAnimal}</td>
              <td className="border-b px-4 py-2">{adoption.fechaEnvio}</td>
              <td className="border-b px-4 py-2">
                <span className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">Pendiente</span>
              </td>
              <td className="border-b px-4 py-2">
                <button className="px-2 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                  Ver
                </button>
                <button className="px-2 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200">
                  Aprobar
                </button>
                <button className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200">
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingAdoptionsTable;