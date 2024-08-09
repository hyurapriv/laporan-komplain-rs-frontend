import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, BarElement, Tooltip, Legend } from 'chart.js';
import { FaEllipsisH } from 'react-icons/fa';

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

const DummyData = {
  lineData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Value',
        data: [4000, 3000, 5000, 4000, 3000, 5000],
        borderColor: '#8884d8',
        backgroundColor: 'rgba(136, 132, 216, 0.2)',
        fill: true,
        borderWidth: 2,
      }
    ],
  },
  barData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'A',
        data: [1000, 1500, 800, 1800, 1200, 1500],
        backgroundColor: '#8884d8',
        stack: 'a',
      },
      {
        label: 'B',
        data: [1500, 1000, 1800, 1200, 1000, 1500],
        backgroundColor: '#82ca9d',
        stack: 'a',
      },
      {
        label: 'C',
        data: [900, 1200, 1400, 1300, 1600, 1000],
        backgroundColor: '#ffc658',
        stack: 'a',
      },
    ],
  },
};

const RawatInap = () => {
  const [currentValue] = useState(3352.96);
  const [projects] = useState(1240);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Overview</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-white text-gray-600 rounded">Statistics</button>
          <button className="px-3 py-1 bg-white text-gray-600 rounded">History</button>
          <button className="px-3 py-1 bg-white text-gray-600 rounded">Payments</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Current Value: ${currentValue.toFixed(2)}</h3>
            <span className="text-gray-500">Last 6 months</span>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <Line data={DummyData.lineData} options={{
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
            <h3 className="font-semibold">October Income</h3>
            <FaEllipsisH className="text-gray-500" />
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <Bar data={DummyData.barData} options={{
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Top Engines</h3>
          {/* Placeholder for pie chart */}
          <div className="h-40 bg-gray-200 rounded flex items-center justify-center">
            Pie Chart Placeholder
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Projects</h3>
          <div className="text-3xl font-bold mb-4">{projects}</div>
          {/* Placeholder for small line chart */}
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Explore Events</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-blue-500 text-white p-2 rounded">Today</button>
            <button className="bg-yellow-500 text-white p-2 rounded">Tomorrow</button>
            <button className="bg-green-500 text-white p-2 rounded">This week</button>
            <button className="bg-pink-500 text-white p-2 rounded">Choose date</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RawatInap;
