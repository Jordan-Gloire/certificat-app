"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "@/app/components/Header";
import ChartGrk from "@/app/components/ChartGrk";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsPage: React.FC = () => {
  const data = {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai"],
    datasets: [
      {
        label: "Certificats générés",
        data: [500, 100, 305, 220, 120],
        // type: "doughnut",
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderRadius: 10,
        hoverOffset: 4,
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
        text: "Certificats générés par mois",
        font: {
          size: 18,
        },
        color: "#0071bc",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#333",
        },
      },
      y: {
        ticks: {
          color: "#333",
        },
      },
    },
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-white">
        <h2 className="text-2xl font-bold text-[#0071bc] m-6">Statistiques</h2>
        <div className="bg-[#f9f9f9] p-4 rounded-lg shadow-md">
          <Bar data={data} options={options} />
        </div>
      </div>
      <ChartGrk />
    </>
  );
};

export default StatisticsPage;
