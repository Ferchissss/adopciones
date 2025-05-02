import React, { useState, useEffect } from "react";

const RegistrarObservacionModal = ({ isOpen, onClose }) => {
  const [animalId, setAnimalId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Fecha actual
  const [tipoObservacion, setTipoObservacion] = useState("General");
  const [observacion, setObservacion] = useState("");

  // Función para reiniciar los campos del formulario
  const resetForm = () => {
    setAnimalId("");
    setFecha(new Date().toISOString().split("T")[0]);
    setTipoObservacion("General");
    setObservacion("");
  };

  // Efecto para limpiar el formulario al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Comprobación de si todos los campos están completos
  const isFormValid = animalId && fecha && tipoObservacion && observacion;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Aquí puedes manejar el envío del formulario
    console.log({
      animalId,
      fecha,
      tipoObservacion,
      observacion,
    });

    onClose(); // Cerrar el modal después de guardar
    resetForm(); // Limpiar el formulario
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Registrar Observación
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Animal ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animal
            </label>
            <input
              type="text"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              placeholder="Animal (ID)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
            />
          </div>

          {/* Fecha */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <div className="flex items-center">
              <span className="material-icons-outlined mr-2 text-gray-500">
                calendar_today
              </span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              />
            </div>
          </div>

          {/* Tipo de Observación */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de observación
            </label>
            <select
              value={tipoObservacion}
              onChange={(e) => setTipoObservacion(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
            >
              <option>General</option>
              <option>Salud</option>
              <option>Comportamiento</option>
              <option>Alimentación</option>
              <option>Medicacion</option>

            </select>
          </div>

          {/* Observación */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observación
            </label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Escribe aquí tu observación..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              rows="4"
            ></textarea>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid} // Botón deshabilitado si no está completo el formulario
              className={`px-4 py-2 rounded-lg text-white ${
                isFormValid
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Guardar Observación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarObservacionModal;