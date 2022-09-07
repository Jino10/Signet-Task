import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { randomColorForCharts } from '../Utilities/AppUtilities';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function VerticalBarChart({ data }) {
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      title: {
        display: true,
        position: 'left',
        text: 'Number of Tickets',
      },
    },
  };

  const labels = data.map((key) => parseFloat(key.priorityKey).toFixed(2));
  const values = data.map((key) => parseFloat(key.priorityNumberOfTickets).toFixed());

  const dataValues = {
    labels,
    datasets: [
      {
        label: 'No of Tickets',
        data: values,
        backgroundColor: randomColorForCharts(data.length),
        barPercentage: 0.3,
      },
    ],
  };

  return <Bar options={options} data={dataValues} />;
}

export default VerticalBarChart;
