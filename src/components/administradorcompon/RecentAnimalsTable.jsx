import React from "react";

const RecentAnimalsTable = ({ animals }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-emerald-800 mb-4">Animales Recientes</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="border-b p-2">Nombre</th>
            <th className="border-b p-2">Especie</th>
            <th className="border-b p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
        {animals.map((animal) => (
            <tr key={animal.id}>
              <td className="p-2">{animal.nombre}</td>
              <td className="p-2">{animal.especie}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  animal.estado === "disponible" ? "bg-green-100 text-green-800" :
                  animal.estado === "en tratamiento" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {animal.estado}
                </span>
              </td>
              <td className="p-2">{animal.FechaIngreso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentAnimalsTable;