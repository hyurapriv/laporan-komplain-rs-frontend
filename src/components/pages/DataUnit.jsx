import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import useDummyData from '../hooks/useDummyData';
import Header from '../layouts/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Lazy load the components
const Loading = lazy(() => import('../ui/Loading'));
const Bar = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar })));

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
  'Pending': '#A70B17'
};

const statusOrder = ['Terkirim', 'Proses', 'Selesai', 'Pending'];

const DataUnit = () => {
  const {
    dataKomplain,
    setSelectedMonth,
    availableMonths,
    selectedMonth,
    getMonthName,
    error,
    loading,
    serviceChartData
  } = useDummyData();

  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    const units = dataKomplain?.jumlahUnitStatus ? Object.keys(dataKomplain.jumlahUnitStatus) : [];
    if (units.length > 0 && !selectedUnit) {
      setSelectedUnit(units[0]);
    }

    const sortedMonths = [...availableMonths].sort((a, b) => new Date(b) - new Date(a));
    if (sortedMonths.length > 0 && (!selectedMonth || !sortedMonths.includes(selectedMonth))) {
      setSelectedMonth(sortedMonths[0]);
    }
  }, [dataKomplain, availableMonths, selectedMonth, selectedUnit, setSelectedMonth]);

  const filteredServiceChartData = useMemo(() => {
    if (serviceChartData && selectedUnit) {
      return serviceChartData.filter(item => item.unit === selectedUnit);
    }
    return [];
  }, [serviceChartData, selectedUnit]);

  const serviceChartConfig = useMemo(() => {
    const labels = filteredServiceChartData.map(item => item.layanan);
    const data = filteredServiceChartData.map(item => item.jumlah);
    const backgroundColor = data.map((_, index) => colorPalette[index % colorPalette.length]);

    return {
      labels,
      datasets: [{
        label: 'Jumlah Komplain',
        data,
        backgroundColor,
      }]
    };
  }, [filteredServiceChartData]);

  const statusChartConfig = useMemo(() => {
    if (dataKomplain?.jumlahUnitStatus && selectedUnit) {
      const statusData = dataKomplain.jumlahUnitStatus[selectedUnit]?.statuses || {};
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
  }, [dataKomplain, selectedUnit]);

  const totalKomplainForUnit = useMemo(() => {
    if (dataKomplain?.jumlahUnitStatus && selectedUnit) {
      return Object.values(dataKomplain.jumlahUnitStatus[selectedUnit]?.statuses || {}).reduce((a, b) => a + b, 0);
    }
    return 0;
  }, [dataKomplain, selectedUnit]);

  const hasData = useMemo(() => {
    return filteredServiceChartData.length > 0 && dataKomplain?.jumlahUnitStatus;
  }, [filteredServiceChartData, dataKomplain]);

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

  return (
    <section className="px-4 flex-1 pt-1">
      <Header
        title={`Laporan Komplain IT Unit ${selectedUnit || ''} Bulan ${getMonthName(selectedMonth)}`}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        getMonthName={getMonthName}
        availableMonths={availableMonths}
      />
      <h3 className='ml-1 mt-2 text-lg font-bold text-white'>
        <span className='bg-light-green py-2 px-3 rounded'>{`Total Komplain Unit: ${totalKomplainForUnit}`}</span>
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
        <div className="mt-10">
          <div className="mb-4">
            <label htmlFor="unit-select" className="mr-2">Pilih Unit:</label>
            <select
              id="unit-select"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="bg-white border border-slate-500 rounded-md p-2"
            >
              {Object.keys(dataKomplain.jumlahUnitStatus || {}).map((unit) => (
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
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">Status Komplain</h3>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  {statusChartConfig.datasets[0]?.data.length > 0 ? (
                    <Bar data={statusChartConfig} options={chartOptions} />
                  ) : (
                    <p>No status data available for the selected unit</p>
                  )}
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      ) : (
        <div className="mt-14 text-center text-gray-600">
          <p className="text-xl">Tidak ada data untuk unit yang dipilih pada bulan ini.</p>
          <p className="mt-2">Silakan pilih unit atau bulan lain atau periksa kembali data Anda.</p>
        </div>
      )}
    </section>
  );
};

export default React.memo(DataUnit);
