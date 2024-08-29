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

    const processedData = {};
    let lainnyaTotal = 0;

    Object.entries(data).forEach(([category, units]) => {
      if (category.toLowerCase().includes('lainnya')) {
        lainnyaTotal += Object.values(units).reduce((acc, unit) => acc + unit.Total, 0);
      } else {
        processedData[category] = Object.values(units).reduce((acc, unit) => acc + unit.Total, 0);
      }
    });

    if (lainnyaTotal > 0) {
      processedData['Lainnya'] = lainnyaTotal;
    }

    const labels = Object.keys(processedData);
    const values = Object.values(processedData);

    const colors = ['#267db3', '#6dc486', '#fad25e', '#ec6444', '#8561c8'];
    const datasetColor = colors.slice(0, labels.length);

    return {
      labels,
      datasets: [{
        label: 'Total Komplain',
        data: values,
        backgroundColor: datasetColor,
      }]
    };
  }, [data]);

  console.log('BarChart chartData:', JSON.stringify(chartData, null, 2));

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
          size: 15,
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
            let label = context.dataset.label || '';
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
    <div className="flex flex-wrap justify-center mt-4 text-sm">
      {chartData.labels.map((label, index) => (
        <div key={index} className="flex items-center mx-1 lg:mx-4 mb-2">
          <div
            className="w-3 h-3 mr-2"
            style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
          ></div>
          <span className="text-xs lg:text-base">{label}</span>
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