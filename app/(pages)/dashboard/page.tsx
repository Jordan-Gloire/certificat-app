"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const dashboard: React.FC = () => {
  const data = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
    datasets: [
      {
        label: 'Certificats générés',
        data: [5, 10, 15, 20, 12],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Certificats générés par mois',
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Statistiques</h2>
      <div className="bg-white shadow p-4 rounded">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default dashboard;
