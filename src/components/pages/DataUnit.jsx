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
  'Dalam Pengerjaan / Pengecekan Petugas': '#F79D23',
  'Selesai': '#32CD32',
  'Pending': '#3E5F8A'
};

const statusOrder = ['Terkirim', 'Dalam Pengerjaan / Pengecekan Petugas', 'Selesai', 'Pending'];

const unitOrder = [
  'Kategori IGD',
  'Kategori Rawat Jalan',
  'Kategori Rawat Inap',
  'Kategori Penunjang Medis',
  'Kategori Lainnya'
];

const DataUnit = () => {
  const queryClient = useQueryClient();
  const {
    data: dataKomplain,
    setSelectedMonth,
    setSelectedYear,
    getMonthName,
    error,
    loading,
    selectedMonth,
    selectedYear,
    availableMonths
  } = useNewData();

  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    if (availableMonths && availableMonths.length > 0 && !availableMonths.includes(`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`)) {
      const [latestYear, latestMonth] = availableMonths[0].split('-');
      setSelectedYear(parseInt(latestYear, 10));
      setSelectedMonth(latestMonth);
    }
  }, [availableMonths, selectedMonth, selectedYear, setSelectedMonth, setSelectedYear]);

  useEffect(() => {
    if (dataKomplain?.categories) {
      const units = Object.keys(dataKomplain.categories);
      const firstAvailableUnit = unitOrder.find(unit => units.includes(unit));
      if (firstAvailableUnit && !selectedUnit) {
        setSelectedUnit(firstAvailableUnit);
      }
    }
  }, [dataKomplain, selectedUnit]);

  // Configure service chart
  const serviceChartConfig = useMemo(() => {
    if (dataKomplain?.categories && selectedUnit) {
      const unitData = dataKomplain.categories[selectedUnit] || {};
      const labels = Object.keys(unitData);
      const data = labels.map(service => unitData[service]?.Total || 0);
      const backgroundColor = data.map((_, index) => colorPalette[index % colorPalette.length]);

      return {
        labels,
        datasets: [{
          label: 'Jumlah Komplain',
          data,
          backgroundColor,
        }]
      };
    }
    return {
      labels: ['No Data'],
      datasets: [{
        label: 'Jumlah Komplain',
        data: [0],
        backgroundColor: colorPalette[0]
      }]
    };
  }, [dataKomplain, selectedUnit]);

  // Define status colors and order with updated status names
  const statusColors = {
    'Menunggu': '#36A2EB',
    'Proses': '#F79D23',
    'Selesai': '#32CD32',
    'Pending': '#3E5F8A'
  };

  const statusOrder = ['Menunggu', 'Proses', 'Selesai', 'Pending'];

  const statusChartConfig = useMemo(() => {
    if (dataKomplain?.categories && selectedUnit) {
      const unitData = dataKomplain.categories[selectedUnit] || {};
      const statusData = {};
      Object.values(unitData).forEach(service => {
        Object.entries(service).forEach(([status, count]) => {
          // Map old status names to the new ones
          let newStatus;
          switch (status) {
            case 'Terkirim':
              newStatus = 'Menunggu';
              break;
            case 'Dalam Pengerjaan / Pengecekan Petugas':
              newStatus = 'Proses';
              break;
            default:
              newStatus = status;
          }

          if (statusOrder.includes(newStatus)) {
            statusData[newStatus] = (statusData[newStatus] || 0) + count;
          }
        });
      });

      const labels = statusOrder;
      const data = labels.map(status => statusData[status] || 0);
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



  // Calculate total complaints for the selected unit
  const totalKomplainForUnit = useMemo(() => {
    if (dataKomplain?.categories && selectedUnit) {
      return Object.values(dataKomplain.categories[selectedUnit] || {}).reduce((total, service) => total + (service.Total || 0), 0);
    }
    return 0;
  }, [dataKomplain, selectedUnit]);

  // Chart options
  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
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

  const handleMonthChange = (newMonthYear) => {
    const [year, month] = newMonthYear.split('-');
    setSelectedYear(parseInt(year, 10));
    setSelectedMonth(month);
    queryClient.prefetchQuery({
      queryKey: ['newData', parseInt(year, 10), month],
      queryFn: () => fetchNewData(parseInt(year, 10), month)
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
          title={`Laporan Komplain IT Unit ${selectedUnit || ''} Bulan ${getMonthName(parseInt(selectedMonth, 10))} ${selectedYear}`}
          selectedMonth={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
          setSelectedMonth={handleMonthChange}
          getMonthName={getMonthName}
          availableMonths={availableMonths || []}
        />
        <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
          <span className='bg-light-green py-2 px-3 rounded'>{`Total Komplain: ${totalKomplainForUnit}`}</span>
        </h3>

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
                  <Bar data={serviceChartConfig} options={horizontalBarOptions} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">{`Grafik Status Unit: ${selectedUnit}`}</h3>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  <Pie data={statusChartConfig} options={pieChartOptions} />
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default DataUnit;