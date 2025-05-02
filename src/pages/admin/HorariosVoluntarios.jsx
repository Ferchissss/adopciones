import React, { useState } from "react";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";

const HorariosVoluntarios = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState("Semana Actual");
  const [schedule, setSchedule] = useState({
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
    sabado: [],
    domingo: [],
  });
  const [volunteers, setVolunteers] = useState([
    { id: 1, nombre: "Ana Martínez", rol: "Cuidador", estado: "Disponible" },
    { id: 2, nombre: "Carlos Rodríguez", rol: "Veterinario", estado: "Disponible" },
    { id: 3, nombre: "Laura Sánchez", rol: "Paseador", estado: "No Disponible" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const openModal = (day, hour) => {
    setSelectedDay(day);
    setSelectedHour(hour);
    setIsModalOpen(true);
  };

  const handleSelectVolunteer = (volunteer) => {
    handleAddToSchedule(selectedDay, selectedHour, volunteer);
    setIsModalOpen(false);
  };

  const handleAddToSchedule = (day, hour, volunteer) => {
    if (schedule[day].some((entry) => entry.hour === hour && entry.volunteer.id === volunteer.id)) {
      alert("El voluntario ya está asignado a este horario.");
      return;
    }

    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], { hour, volunteer }],
    }));
  };

  const handleSaveChanges = () => {
    console.log("Horario guardado:", schedule);
    alert("Cambios guardados correctamente.");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isCollapsed={isCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <AdminHeader
          title="Horarios de Voluntarios"
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />
        <div className="p-6 bg-gray-100 min-h-screen" style={{ marginTop: "64px" }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Horario Semanal</h1>
            <div className="flex items-center space-x-4">
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-emerald-300"
              >
                <option>Semana Actual</option>
                <option>Semana Anterior</option>
                <option>Semana Siguiente</option>
              </select>
              <button
                onClick={handleSaveChanges}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-2">Hora</th>
                  <th className="px-4 py-2">Lunes</th>
                  <th className="px-4 py-2">Martes</th>
                  <th className="px-4 py-2">Miércoles</th>
                  <th className="px-4 py-2">Jueves</th>
                  <th className="px-4 py-2">Viernes</th>
                  <th className="px-4 py-2">Sábado</th>
                  <th className="px-4 py-2">Domingo</th>
                </tr>
              </thead>
              <tbody>
                {[8, 10, 12, 14, 16, 18].map((hour) => (
                  <tr key={hour} className="border-t">
                    <td className="px-4 py-2">{`${hour}:00 - ${hour + 2}:00`}</td>
                    {["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"].map((day) => (
                      <td key={day} className="px-4 py-2">
                        {schedule[day]
                          .filter((entry) => entry.hour === hour)
                          .map((entry) => (
                            <div
                              key={entry.volunteer.id}
                              className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm mb-1"
                            >
                              {entry.volunteer.nombre}
                            </div>
                          ))}
                        <button
                          onClick={() => openModal(day, hour)}
                          className="text-emerald-600 hover:underline text-sm"
                        >
                          +
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-1/3">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Seleccionar Voluntario</h2>
                <ul>
                  {volunteers
                    .filter((v) => v.estado === "Disponible")
                    .map((volunteer) => (
                      <li
                        key={volunteer.id}
                        className="flex items-center justify-between py-2 border-b"
                      >
                        <span>{volunteer.nombre}</span>
                        <button
                          onClick={() => handleSelectVolunteer(volunteer)}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                        >
                          Seleccionar
                        </button>
                      </li>
                    ))}
                </ul>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorariosVoluntarios;