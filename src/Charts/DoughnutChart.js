import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { randomColorForCharts } from '../Utilities/AppUtilities';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
ChartJS.defaults.set('plugins.datalabels', {
  display: false,
});

function DoughnutChart({ data }) {
  const options = {
    responsive: true,
    plugins: {
      ChartDataLabels,
      datalabels: {
        display: true,
        formatter: (value, ctx) => {
          const totalValue = ctx.dataset.data.reduce((acc, i) => acc + i, 0);
          return (value / totalValue) * 100 + ' %';
        },
        color: '#FFFFFF',
        font: {
          size: 12,
          weight: 'bold',
        },
      },
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
        },
      },
    },
  };

  const labels = [];
  const values = [];
  data.forEach((sys) => {
    labels.push(sys.ticketBySiteKey.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase()));
    values.push(sys.ticketBySiteTotalTicket);
  });

  const dataValues = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: randomColorForCharts(data.length),
      },
    ],
    Option,
  };

  return <Doughnut data={dataValues} options={options} />;
}

export default DoughnutChart;
