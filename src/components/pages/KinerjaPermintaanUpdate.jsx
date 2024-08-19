import React, { useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import useNewData from '../hooks/useNewData';
import Header from '../layouts/Header';
import Loading from '../ui/Loading';
import { Tables } from '../ui/Tables';
import Footer from '../layouts/Footer';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

// Define fixed colors for specific petugas
const petugasColors = {
  'Adika': '#B414EF',
  'Agus': '#0FBB98',
  'Ali Muhson': '#FFCE56',
  'Bayu': '#A10E48',
  'Ganang': '#C1F39B',
  'Virgie': '#3E5F8A',
};

// Define the fixed order of petugas
const fixedOrder = ['Adika', 'Agus', 'Ali Muhson', 'Bayu', 'Ganang', 'Virgie'];

// Pie Chart Options
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw}%`
      }
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        boxWidth: 14,
        padding: 10,
        font: {
          size: 12
        }
      }
    }
  },
  rotation: Math.PI * -0.5,
  cutout: '50%',
};

const KinerjaPermintaanUpdate = () => {
  const {
    dataUpdate,
    getMonthName,
    setSelectedMonth,
    loading,
    error,
  } = useNewData();

  const totalRequests = useMemo(() => {
    if (!dataUpdate || !dataUpdate.jumlahPetugas) return 0;
    return Object.values(dataUpdate.jumlahPetugas).reduce((acc, count) => acc + count, 0);
  }, [dataUpdate]);

  const tableData = useMemo(() => {
    if (!dataUpdate || !dataUpdate.jumlahPetugas) return [];
    return fixedOrder.map(name => ({
      nama: name,
      jumlahPengerjaan: dataUpdate.jumlahPetugas[name] || 0,
      kontribusi: ((dataUpdate.jumlahPetugas[name] || 0) / totalRequests * 100).toFixed(2) + '%',
    }));
  }, [dataUpdate, totalRequests]);

  const barChartConfig = useMemo(() => {
    if (!dataUpdate || !dataUpdate.jumlahPetugas) return { labels: [], datasets: [] };

    const labels = fixedOrder;
    const data = labels.map(name => dataUpdate.jumlahPetugas[name] || 0);
    const backgroundColor = labels.map(name => petugasColors[name] || '#D3D3D3'); // Default color if name not found

    return {
      labels,
      datasets: [{
        label: 'Jumlah Permintaan Update',
        data,
        backgroundColor,
      }]
    };
  }, [dataUpdate]);

  const pieChartConfig = useMemo(() => {
    if (!dataUpdate || !dataUpdate.jumlahPetugas) return { labels: [], datasets: [] };

    const labels = fixedOrder;
    const data = labels.map(name => ((dataUpdate.jumlahPetugas[name] || 0) / totalRequests * 100).toFixed(2)); // Percentage data
    const backgroundColor = labels.map(name => petugasColors[name] || '#D3D3D3'); // Default color if name not found

    return {
      labels,
      datasets: [{
        label: 'Kontribusi Permintaan (%)',
        data,
        backgroundColor,
      }]
    };
  }, [dataUpdate, totalRequests]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <div className="text-red-500">{error.message}</div>;

  if (!dataUpdate) {
    return <div>No data available</div>;
  }

  return (
    <>
      <div className='px-4 flex-1 pt-1 mb-5'>
        <Header
          title={`Laporan Kinerja Petugas Bulan ${getMonthName(dataUpdate.selectedMonth)}`}
          selectedMonth={dataUpdate.selectedMonth}
          setSelectedMonth={setSelectedMonth}
          getMonthName={getMonthName}
          availableMonths={dataUpdate.availableMonths}
        />
        <h3 className='mt-5 lg:mt-2 text-lg font-bold text-white'>
          <span className='bg-light-green py-2 px-3 rounded'>{`Total Permintaan: ${totalRequests}`}</span>
        </h3>

        <div className="mt-10">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-lg flex-1">
              <h3 className="font-semibold text-sm mb-4">Grafik Kinerja Petugas</h3>
              <div style={{ width: '100%', height: 300 }}>
                <Bar data={barChartConfig} options={{
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
                }} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg flex-1 mt-6 lg:mt-0">
              <h3 className="font-semibold text-sm mb-4">Grafik Kontribusi Petugas (%)</h3>
              <div style={{ width: '100%', height: 300 }}>
                <Pie data={pieChartConfig} options={pieChartOptions} />
              </div>
            </div>
          </div>

          <Tables data={tableData} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default KinerjaPermintaanUpdate;
