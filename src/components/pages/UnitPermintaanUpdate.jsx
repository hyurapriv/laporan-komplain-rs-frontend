import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import useDummyData from '../hooks/useDummyData';
import Header from '../layouts/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Loading from '../ui/Loading';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Define color palette for service chart
const colorPalette = [
  '#B414EF', '#0FBB98', '#FFCE56', '#A10E48', '#C1F39B', '#2EE4F3', '#577F8A', '#7CFC00', '#8B008B', '#00CED1', '#FF4500',
  '#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4169E1', '#8A2BE2', '#C1FDBB'
];

// Define status colors and order
const statusColors = {
  'Terkirim': '#36A2EB',
  'Proses': '#F79D23',
  'Selesai': '#32CD32',
  'Pending': '#3E5F8A'
};

const statusOrder = ['Terkirim', 'Proses', 'Selesai', 'Pending'];

const UnitPermintaanUpdate = () => {
  const {
    dataUpdate,
    setSelectedMonth,
    availableMonths,
    selectedMonth,
    getMonthName,
    error,
    loading,
    serviceChartDataUpdate
  } = useDummyData();

  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    const units = dataUpdate?.jumlahUnitStatus ? Object.keys(dataUpdate.jumlahUnitStatus) : [];
    if (units.length > 0 && !selectedUnit) {
      setSelectedUnit(units[0]);
    }

    const sortedMonths = [...availableMonths].sort((a, b) => new Date(b) - new Date(a));
    if (sortedMonths.length > 0 && (!selectedMonth || !sortedMonths.includes(selectedMonth))) {
      setSelectedMonth(sortedMonths[0]);
    }
  }, [dataUpdate, availableMonths, selectedMonth, selectedUnit, setSelectedMonth]);

  const filteredServiceChartData = useMemo(() => {
    if (serviceChartDataUpdate && selectedUnit) {
      return serviceChartDataUpdate.filter(item => item.unit === selectedUnit);
    }
    return [];
  }, [serviceChartDataUpdate, selectedUnit]);

  const serviceChartConfig = useMemo(() => {
    const labels = filteredServiceChartData.map(item => item.layanan);
    const data = filteredServiceChartData.map(item => item.jumlah);
    const backgroundColor = data.map((_, index) => colorPalette[index % colorPalette.length]);

    return {
      labels,
      datasets: [{
        label: 'Jumlah Permintaan Update',
        data,
        backgroundColor,
      }]
    };
  }, [filteredServiceChartData]);

  const statusChartConfig = useMemo(() => {
    if (dataUpdate?.jumlahUnitStatus && selectedUnit) {
      const statusData = dataUpdate.jumlahUnitStatus[selectedUnit]?.statuses || {};
      const labels = statusOrder.map(status => status === 'Terkirim' ? 'Menunggu' : status);
      const data = labels.map(label => statusData[label === 'Menunggu' ? 'Terkirim' : label] || 0);
      const backgroundColor = labels.map(label => statusColors[label === 'Menunggu' ? 'Terkirim' : label]);
      return {
        labels,
        datasets: [{
          label: 'Jumlah Status',
          data,
          backgroundColor,
        }]
      };
    }
    return {
      labels: statusOrder,
      datasets: [{
        label: 'Jumlah Status',
        data: statusOrder.map(() => 0),
        backgroundColor: statusOrder.map(label => statusColors[label]),
      }]
    };
  }, [dataUpdate, selectedUnit]);

  const totalUpdateForUnit = useMemo(() => {
    if (dataUpdate?.jumlahUnitStatus && selectedUnit) {
      return Object.values(dataUpdate.jumlahUnitStatus[selectedUnit]?.statuses || {}).reduce((a, b) => a + b, 0);
    }
    return 0;
  }, [dataUpdate, selectedUnit]);

  const hasData = useMemo(() => {
    return filteredServiceChartData.length > 0 && dataUpdate?.jumlahUnitStatus;
  }, [filteredServiceChartData, dataUpdate]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`
        }
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 14, // Size of the legend squares
          padding: 10, // Spacing between legend items
          font: {
            size: 12 // Font size for legend text
          }
        }
      }
    },
    rotation: Math.PI * -0.5, // Rotate pie chart to make it look more 3D
    cutout: '50%', // Make the pie chart appear as a donut
  };

  return (
    <section className="px-4 flex-1 pt-1">
      <Header
        title={`Laporan Permintaan Update Data Unit ${selectedUnit || ''} Bulan ${getMonthName(selectedMonth)}`}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        getMonthName={getMonthName}
        availableMonths={availableMonths}
      />
      <h3 className='ml-1 mt-2 text-lg font-bold text-white'>
        <span className='bg-light-green py-2 px-3 rounded'>{`Total Permintaan Update Data: ${totalUpdateForUnit}`}</span>
      </h3>

      {loading ? (
        <div className="mt-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Loading />
          </Suspense>
        </div>
      ) : error ? (
        <div className="mt-4 text-red-500">{error}</div>
      ) : hasData ? (
        <div className="mt-6">
          <div className="mb-8">
            <label htmlFor="unit-select" className="mr-2">Pilih Unit:</label>
            <select
              id="unit-select"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="bg-white border border-slate-500 rounded-md p-2"
            >
              {Object.keys(dataUpdate.jumlahUnitStatus || {}).map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div>Loading Chart...</div>}>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">Grafik Layanan</h3>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  {filteredServiceChartData.length > 0 ? (
                    <Bar data={serviceChartConfig} options={chartOptions} />
                  ) : (
                    <p>No data available for the selected unit</p>
                  )}
                </div>
              </div>
            </Suspense>

            <Suspense fallback={<div>Loading Chart...</div>}>
              <div className="bg-white p-4 rounded-lg shadow-lg relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">Distribusi Status Permintaan Update</h3>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  {dataUpdate?.jumlahUnitStatus ? (
                    <Pie data={statusChartConfig} options={pieChartOptions} />
                  ) : (
                    <p>No data available for the selected unit</p>
                  )}
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-gray-500">No data available.</div>
      )}
    </section>
  );
};

export default UnitPermintaanUpdate;
