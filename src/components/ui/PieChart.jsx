import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ data }) => {
  const { labels, datasets } = data;

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Pie
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
              }
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                }
              }
            },
            datalabels: {
              color: '#000',
              display: true,
              anchor: 'end',
              align: 'start',
              formatter: (value, context) => {
                const { label } = context;
                return `${label}: ${value}`;
              },
              font: {
                size: 12,
              },
            },
          }
        }}
      />
    </div>
  );
};

export default PieChart;
