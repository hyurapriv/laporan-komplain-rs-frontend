import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
);

const BarChart = ({ data }) => {
  console.log('BarChart raw data:', JSON.stringify(data, null, 2));

  const chartData = useMemo(() => {
    if (!data || typeof data !== 'object') {
      console.error('Invalid data passed to BarChart:', data);
      return { labels: [], datasets: [] };
    }

    const predefinedOrder = ['IGD', 'Rawat Jalan', 'Rawat Inap/Rawat Inap Khusus', 'Penunjang Medis', 'Penunjang Non-Medis', 'IBS'];
    const units = predefinedOrder.filter(unit => unit in data);
    const additionalUnits = Object.keys(data).filter(unit => !predefinedOrder.includes(unit));
    const sortedUnits = units.concat(additionalUnits);

    const totalComplaints = sortedUnits.map(unit =>
      Object.values(data[unit]?.statuses || {}).reduce((acc, count) => acc + count, 0)
    );

    const colors = ['#267db3', '#6dc486', '#fad25e', '#ec6444', '#8561c8', '#E67E22'];
    const datasetColor = sortedUnits.map((_, index) => colors[index % colors.length]);

    const shortenedLabels = sortedUnits.map(unit =>
      unit.includes('Rawat Inap/Rawat Inap Khusus') ? 'Rawat Inap' : unit
    );

    return {
      labels: shortenedLabels,
      datasets: [{
        data: totalComplaints,
        backgroundColor: datasetColor,
      }]
    };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Total Komplain Berdasarkan Unit',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20
      }
    },
    barPercentage: 0.8,
    categoryPercentage: 0.9
  };

  const CustomLegend = () => (
    <div className="flex flex-wrap justify-center mt-4">
      {chartData.labels.map((label, index) => (
        <div key={index} className="flex items-center mx-7 mb-2">
          <div
            className="w-4 h-4 mr-2"
            style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
          ></div>
          <span className="text-sm">{label}</span>
        </div>
      ))}
    </div>
  );

  if (chartData.labels.length === 0) {
    return <div>No data available for the chart</div>;
  }

  return (
    <div className='bg-white shadow-lg rounded-xl mt-14 mx-auto' style={{ height: '500px', width: '100%', padding: '20px' }}>
      <div style={{ height: '80%' }}>
        <Bar data={chartData} options={options} />
      </div>
      <CustomLegend />
    </div>
  );
};

export default React.memo(BarChart);
