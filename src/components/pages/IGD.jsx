import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, BarElement, Tooltip, Legend } from 'chart.js';
import { FaEllipsisH } from 'react-icons/fa';
import useDummyData from '../hooks/useDummyData';

// Register components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
  Legend
);

const IGD = () => {
  const { dataKomplain, loading, error, setSelectedMonth, getMonthName } = useDummyData();

  // Helper functions to process data for charts
  const getLineChartData = () => {
    const labels = Object.keys(dataKomplain.jumlahUnitStatus.IGD || {});
    const data = labels.map(month => dataKomplain.jumlahUnitStatus.IGD[month]?.total || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Total Layanan IGD',
          data,
          borderColor: '#8884d8',
          backgroundColor: 'rgba(136, 132, 216, 0.2)',
          fill: true,
          borderWidth: 2,
        }
      ],
    };
  };

  const getBarChartData = () => {
    const labels = Object.keys(dataKomplain.jumlahUnitStatus.IGD || {});
    const statuses = ['Terkirim', 'Proses', 'Selesai', 'Pending'];
    const datasets = statuses.map(status => ({
      label: status,
      data: labels.map(month => dataKomplain.jumlahUnitStatus.IGD?.[month]?.statuses?.[status] || 0),
      backgroundColor: status === 'Terkirim' ? '#8884d8' :
        status === 'Proses' ? '#82ca9d' :
        status === 'Selesai' ? '#ffc658' :
        '#d9534f',
      stack: 'a',
    }));

    return {
      labels,
      datasets,
    };
  };

  const selectedMonth = dataKomplain.selectedMonth || '';

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="px-4 flex-1 pt-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Monthly IGD Metrics</h2>
        <div className="flex space-x-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1 bg-white text-gray-600 rounded"
          >
            {dataKomplain.availableMonths.map(option => (
              <option key={option} value={option}>
                {getMonthName(option)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Total IGD Visits</h3>
            <span className="text-gray-500">Last 6 months</span>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <Line data={getLineChartData()} options={{
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">IGD Metrics by Status</h3>
            <FaEllipsisH className="text-gray-500" />
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <Bar data={getBarChartData()} options={{
              responsive: true,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                },
              },
            }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IGD;