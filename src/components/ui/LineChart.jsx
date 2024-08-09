import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

const LineChart = ({ data }) => {
  const { labels, datasets } = data;

  return (
    <Line
      data={{ labels, datasets }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Layanan',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Jumlah',
            },
            beginAtZero: true,
          },
        },
      }}
    />
  );
};

export default LineChart;
