import React from "react";

const StatsCards = ({ 
  totalAnimals, 
  completedAdoptions, 
  volunteersCount, 
  pendingRequests,
  animalsChange = "+12%",
  adoptionsChange = "+8%",
  volunteersChange = "+2%",
  requestsChange = "-5%"
}) => {
  const stats = [
    { 
      title: "Total Animales", 
      value: totalAnimals, 
      change: animalsChange, 
      trend: "text-green-500", 
      description: "desde el mes pasado" 
    },
    { 
      title: "Adopciones Completadas", 
      value: completedAdoptions, 
      change: adoptionsChange, 
      trend: "text-green-500", 
      description: "desde el mes pasado" 
    },
    { 
      title: "Voluntarios", 
      value: volunteersCount, 
      change: volunteersChange, 
      trend: "text-green-500", 
      description: "desde el mes pasado" 
    },
    { 
      title: "Solicitudes Pendientes", 
      value: pendingRequests, 
      change: requestsChange, 
      trend: pendingRequests > 0 ? "text-red-500" : "text-green-500", 
      description: "desde el mes pasado" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
          <div className="text-3xl font-bold text-gray-800 my-2">
            {stat.value}
          </div>
          <div className={`flex items-center ${stat.trend}`}>
            <span>{stat.change}</span>
            <span className="ml-2 text-sm text-gray-500">{stat.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;