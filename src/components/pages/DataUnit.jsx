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

  console.log('dataKomplain:', dataKomplain);
  console.log('serviceChartData:', serviceChartData);
  console.log('loading:', loading);
  console.log('error:', error);

  const units = useMemo(() => {
    const unitList = dataKomplain?.jumlahUnitStatus ? Object.keys(dataKomplain.jumlahUnitStatus) : [];
    console.log('Available units:', unitList);
    return unitList;
  }, [dataKomplain]);

  useEffect(() => {
    if (units.length > 0 && !selectedUnit) {
      console.log('Setting initial selected unit:', units[0]);
      setSelectedUnit(units[0]);
    }

    // Sort availableMonths in descending order
    const sortedMonths = [...availableMonths].sort((a, b) => new Date(b) - new Date(a));
    
    // Set default month to the latest available month if not set
    if (sortedMonths.length > 0 && (!selectedMonth || !sortedMonths.includes(selectedMonth))) {
      const latestMonth = sortedMonths[0]; // Get the latest available month
      console.log('Setting initial selected month to the latest available month:', latestMonth);
      setSelectedMonth(latestMonth);
    }
  }, [units, selectedUnit, availableMonths, selectedMonth, setSelectedMonth]);

  const filteredServiceChartData = useMemo(() => {
    if (serviceChartData && selectedUnit) {
      const filtered = serviceChartData.filter(item => item.unit === selectedUnit);
      console.log('Filtered service chart data:', filtered);
      return filtered;
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
      const labels = statusOrder;
      const data = labels.map(label => statusData[label] || 0);
      const backgroundColor = labels.map(label => statusColors[label]);
      
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

  const hasData = useMemo(() => {
    const result = serviceChartData && serviceChartData.length > 0 && dataKomplain && Object.keys(dataKomplain.jumlahUnitStatus || {}).length > 0;
    console.log('hasData:', result);
    return result;
  }, [serviceChartData, dataKomplain]);

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
        title={`Data Unit ${selectedUnit || ''} Bulan ${getMonthName(selectedMonth)}`}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        getMonthName={getMonthName}
        availableMonths={availableMonths}
      />

      {loading ? (
        <div className="mt-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Loading />
          </Suspense>
        </div>
      ) : error ? (
        <div className="mt-4 text-red-500">{error}</div>
      ) : hasData ? (
        <div className="mt-4">
          <div className="mb-4">
            <label htmlFor="unit-select" className="mr-2">Pilih Unit:</label>
            <select
              id="unit-select"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="bg-white border border-slate-500 rounded-md p-2"
            >
              {units.map((unit) => (
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
