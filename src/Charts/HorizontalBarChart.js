import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { randomColorForCharts } from '../Utilities/AppUtilities';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HorizontalBarChart({ data }) {
  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
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
      },
      title: {
        display: true,
        text: 'System Types',
        position: 'left',
      },
    },
  };

  const labels = [];
  const values = [];
  data.system.systemCapacityDTOs.forEach((sys) => {
    labels.push(sys.key.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()));
    values.push(parseFloat(sys.capacity).toFixed(2));
  });

  const dataValues = {
    labels,
    datasets: [
      {
        data: [...values, 100],
        backgroundColor: randomColorForCharts(values.length),
      },
    ],
  };

  return <Bar options={options} data={dataValues} />;
}

export default HorizontalBarChart;
