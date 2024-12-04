"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '@/app/components/Header';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsPage: React.FC = () => {
  const data = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
    datasets: [
      {
        label: 'Certificats générés',
        data: [5, 10, 15, 20, 120],
        backgroundColor: '#0071bc',
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Certificats générés par mois',
        font: {
          size: 18,
        },
        color: '#0071bc',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#333',
        },
      },
      y: {
        ticks: {
          color: '#333',
        },
      },
    },
  };

  return (
    <>
    <Header/>
        <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-[#0071bc] m-6">Statistiques</h2>
      <div className="bg-[#f9f9f9] p-4 rounded-lg shadow-md">
        <Bar data={data} options={options} />
      </div>

    </div>    
    </>
  );
};

export default StatisticsPage;
