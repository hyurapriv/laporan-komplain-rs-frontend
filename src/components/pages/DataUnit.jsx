import React, { useState, useEffect, useMemo, Suspense } from 'react';
import useNewData from '../hooks/useNewData';
import Header from '../layouts/Header';
import { useQueryClient } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Loading from '../ui/Loading';
import Footer from '../layouts/Footer';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

const unitOrder = [
  'Rawat Jalan',
  'Rawat Inap/Rawat Inap Khusus',
  'IGD',
  'Penunjang Medis',
  'Penunjang Non-Medis',
  'IBS'
];

const DataUnit = () => {
  const queryClient = useQueryClient();
  const {
    dataKomplain,
    setSelectedMonth,
    selectedMonth,
    getMonthName,
    error,
    loading,
    serviceChartDataKomplain
  } = useNewData();

  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    if (dataKomplain?.availableMonths && !dataKomplain.availableMonths.includes(selectedMonth)) {
      setSelectedMonth(dataKomplain.availableMonths[0]);
    }
  }, [dataKomplain, selectedMonth, setSelectedMonth]);

  useEffect(() => {
    if (dataKomplain?.jumlahUnitStatus) {
      const units = Object.keys(dataKomplain.jumlahUnitStatus);
      const firstAvailableUnit = unitOrder.find(unit => units.includes(unit));
      if (firstAvailableUnit && !selectedUnit) {
        setSelectedUnit(firstAvailableUnit);
      }
    }
  }, [dataKomplain, selectedUnit]);

  // Filter service chart data based on selected unit
  const filteredServiceChartData = useMemo(() => {
    if (serviceChartDataKomplain && selectedUnit) {
      return serviceChartDataKomplain.filter(item => item.unit === selectedUnit);
    }
    return [];
  }, [serviceChartDataKomplain, selectedUnit]);

  // Configure service chart
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

  // Configure status chart
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

  // Calculate total complaints for the selected unit
  const totalKomplainForUnit = useMemo(() => {
    if (dataKomplain?.jumlahUnitStatus && selectedUnit) {
      return Object.values(dataKomplain.jumlahUnitStatus[selectedUnit]?.statuses || {}).reduce((a, b) => a + b, 0);
    }
    return 0;
  }, [dataKomplain, selectedUnit]);

  // Check if there is data for charts
  const hasData = useMemo(() => {
    return filteredServiceChartData.length > 0 && dataKomplain?.jumlahUnitStatus;
  }, [filteredServiceChartData, dataKomplain]);

  // Chart options
  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Set indexAxis to 'y' for horizontal bars
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 11,
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
          boxWidth: 14,
          padding: 10,
          font: {
            size: 11
          }
        }
      }
    },
    rotation: Math.PI * -0.5,
    cutout: '50%',
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    queryClient.prefetchQuery({
      queryKey: ['komplainData', newMonth],
      queryFn: () => fetchKomplainData(newMonth)
    });
  };

  // Loading and Error Handling
  if (loading) {
    return (
      <div className="mt-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Loading />
        </Suspense>
      </div>
    );
  }

  if (error) {
    return <div className="mt-4 text-red-500">{error.message || 'An error occurred'}</div>;
  }

  return (
    <>
    <section className="px-4 flex-1 pt-1">
      <Header
        title={`Laporan Komplain IT Unit ${selectedUnit || ''} Bulan ${getMonthName(selectedMonth)}`}
        selectedMonth={selectedMonth}
        setSelectedMonth={handleMonthChange}
        getMonthName={getMonthName}
        availableMonths={dataKomplain?.availableMonths || []}
      />
      <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
        <span className='bg-light-green py-2 px-3 rounded'>{`Total Komplain: ${totalKomplainForUnit}`}</span>
      </h3>

      {hasData ? (
        <div className="mt-6">
          <div className="mb-8">
            <label htmlFor="unit-select" className="mr-2">Pilih Unit:</label>
            <select
              id="unit-select"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="bg-white border border-slate-500 rounded-md p-1 text-sm"
            >
              {unitOrder.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div>Loading Chart...</div>}>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">{`Grafik Unit: ${selectedUnit}`}</h3>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  {filteredServiceChartData.length > 0 ? (
                    <Bar data={serviceChartConfig} options={horizontalBarOptions} />
                  ) : (
                    <p>No data available for the selected unit</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">{`Grafik Status Unit: ${selectedUnit}`}</h3>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  {Object.keys(statusChartConfig.datasets[0].data).length > 0 ? (
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
        <p className="mt-4 text-gray-500">No data available for the selected month and unit.</p>
      )}
    </section>
    <Footer />
    </>
  );
};

export default DataUnit;