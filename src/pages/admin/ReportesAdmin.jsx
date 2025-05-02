import React, { useState } from "react";
import AdminSidebar from "../../components/administradorcompon/AdminSidebar";
import AdminHeader from "../../components/administradorcompon/AdminHeader";
import { Bar, Pie, Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ReportesAdmin = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Datos para los gráficos
  const adopcionesMensualesData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Adopciones",
        data: [12, 19, 10, 15, 20, 25],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const distribucionEspecieData = {
    labels: ["Perros", "Gatos", "Otros"],
    datasets: [
      {
        label: "Distribución por Especie",
        data: [60, 30, 10],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const ingresosMensualesData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Ingresos",
        data: [5, 10, 8, 12, 15, 18],
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  // Datos para las tablas
  const animalesRecientes = [
    { id: "#A001", nombre: "Luna", especie: "Perro", edad: "2 años", fechaIngreso: "15/04/2023", estado: "En tratamiento" },
    { id: "#A002", nombre: "Simba", especie: "Gato", edad: "1 año", fechaIngreso: "18/04/2023", estado: "Disponible" },
    { id: "#A003", nombre: "Rocky", especie: "Perro", edad: "3 años", fechaIngreso: "20/04/2023", estado: "En adopción" },
  ];

  const exportarDatos = () => {
    const doc = new jsPDF();
  
    // Agregar el logo
    const logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTA0LTI3PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjUxM2QyNzUxLTNmZDktNDYzNC04MjE2LWNmM2Q1OGY5NzNkODwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5EaXNlw7FvIHNpbiB0w610dWxvIC0gMTwvcmRmOmxpPgogICA8L3JkZjpBbHQ+CiAgPC9kYzp0aXRsZT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3Jp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"; // Reemplaza con el Base64 del logo
    doc.addImage(logo, "PNG", 10, 10, 30, 30); // Posición (x, y) y tamaño (ancho, alto)
  
    // Título del PDF
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Pet Rescue", 50, 20); // Título principal
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("Reporte de Adopciones y Animales", 50, 30);
  
    // Línea decorativa
    doc.setDrawColor(0, 128, 0); // Color verde
    doc.setLineWidth(1);
    doc.line(10, 40, 200, 40); // Línea horizontal
  
    // Datos de las barras (Adopciones por Mes)
    const adopcionesMensuales = [
      ["Enero", 12],
      ["Febrero", 19],
      ["Marzo", 10],
      ["Abril", 15],
      ["Mayo", 20],
      ["Junio", 25],
    ];
  
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("Adopciones por Mes", 14, 50);
    doc.autoTable({
      startY: 55,
      head: [["Mes", "Cantidad"]],
      body: adopcionesMensuales,
      theme: "grid", // Tema de la tabla
      headStyles: { fillColor: [0, 128, 0] }, // Color de encabezado
      styles: { fontSize: 12 },
    });
  
    // Datos de animales recientemente agregados
    const animalesRecientes = [
      { id: "#A001", nombre: "Luna", especie: "Perro", edad: "2 años", estado: "En tratamiento" },
      { id: "#A002", nombre: "Simba", especie: "Gato", edad: "1 año", estado: "Disponible" },
      { id: "#A003", nombre: "Rocky", especie: "Perro", edad: "3 años", estado: "En adopción" },
    ];
  
    const animalesTabla = animalesRecientes.map((animal) => [
      animal.id,
      animal.nombre,
      animal.especie,
      animal.edad,
      animal.estado,
    ]);
  
    doc.text("Animales Recientemente Agregados", 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [["ID", "Nombre", "Especie", "Edad", "Estado"]],
      body: animalesTabla,
      theme: "grid",
      headStyles: { fillColor: [0, 128, 0] },
      styles: { fontSize: 12 },
    });
  
    // Pie de página
    const pageHeight = doc.internal.pageSize.height; // Altura de la página
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Pet Rescue - Todos los derechos reservados", 14, pageHeight - 10);
  
    // Guardar el PDF
    doc.save("reporte_pet_rescue.pdf");
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* Header */}
        <AdminHeader
          title="Reportes"
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
        />

        {/* Main Content Area */}
        <div className="p-6 bg-gray-100 min-h-screen" style={{ marginTop: "64px" }}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
            <button
              onClick={exportarDatos}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              Exportar Datos
            </button>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800">Total Animales</h2>
              <p className="text-3xl font-bold text-emerald-600">128</p>
              <p className="text-sm text-gray-600">+12% desde el mes pasado</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800">Adopciones</h2>
              <p className="text-3xl font-bold text-emerald-600">24</p>
              <p className="text-sm text-gray-600">+7% desde el mes pasado</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800">Voluntarios</h2>
              <p className="text-3xl font-bold text-emerald-600">36</p>
              <p className="text-sm text-gray-600">+5% desde el mes pasado</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800">Solicitudes Pendientes</h2>
              <p className="text-3xl font-bold text-emerald-600">8</p>
              <p className="text-sm text-gray-600">+3% desde el mes pasado</p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de barras */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Adopciones por Mes</h2>
              <Bar data={adopcionesMensualesData} />
            </div>

            {/* Gráfico circular */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Distribución por Especie</h2>
              <Pie data={distribucionEspecieData} />
            </div>
          </div>

          {/* Gráfico de línea */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tendencia de Ingresos</h2>
            <Line data={ingresosMensualesData} />
          </div>

          {/* Tabla de animales recientemente agregados */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Animales Recientemente Agregados</h2>
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Especie</th>
                  <th className="px-4 py-2">Edad</th>
                  <th className="px-4 py-2">Fecha Ingreso</th>
                  <th className="px-4 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {animalesRecientes.map((animal) => (
                  <tr key={animal.id} className="border-t">
                    <td className="px-4 py-2">{animal.id}</td>
                    <td className="px-4 py-2">{animal.nombre}</td>
                    <td className="px-4 py-2">{animal.especie}</td>
                    <td className="px-4 py-2">{animal.edad}</td>
                    <td className="px-4 py-2">{animal.fechaIngreso}</td>
                    <td className="px-4 py-2">{animal.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ReportesAdmin;