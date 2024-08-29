import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import useUpdateRequest from '../hooks/useUpdateRequest';
import Header from '../layouts/Header';
import Loading from '../ui/Loading';
import { Tables } from '../ui/Tables';
import Footer from '../layouts/Footer';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const KinerjaPermintaanUpdate = () => {
  const {
    data,
    loading,
    error,
    setSelectedMonth,
    setSelectedYear,
    getMonthName,
    availableMonths,
    selectedMonth,
    selectedYear
  } = useUpdateRequest();

  const totalRequests = useMemo(() => {
    if (!data || !data.petugasCounts) return 0;
    return Object.values(data.petugasCounts).reduce((acc, value) => acc + value, 0);
  }, [data]);

  const tableData = useMemo(() => {
    if (!data || !data.petugasCounts) return [];
    const unsortedData = fixedOrder.map(name => ({
      nama: name,
      jumlahPengerjaan: data.petugasCounts[name] || 0,
      kontribusi: totalRequests > 0 ? ((data.petugasCounts[name] / totalRequests) * 100).toFixed(2) + '%' : '0%',
    }));
    return unsortedData.sort((a, b) => b.jumlahPengerjaan - a.jumlahPengerjaan);
  }, [data, totalRequests]);

  const handleMonthYearChange = (value) => {
    const [year, month] = value.split('-');
    setSelectedYear(parseInt(year, 10));
    setSelectedMonth(parseInt(month, 10));
  };

  const barChartConfig = useMemo(() => {
    if (!data || !data.petugasCounts) return { labels: [], datasets: [] };

    const labels = fixedOrder;
    const chartData = labels.map(name => data.petugasCounts[name] || 0);
    const backgroundColor = labels.map(name => petugasColors[name] || '#D3D3D3');

    return {
      labels,
      datasets: [{
        label: 'Jumlah Pengerjaan Petugas',
        data: chartData,
        backgroundColor,
      }]
    };
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  if (error) return <div className="text-red-500">{error.message}</div>;

  if (!data) {
    return <div>No data available</div>;
  }

  const lastUpdateTime = data.lastUpdateTime;

  return (
    <>
      <div className='px-4 flex-1 pt-1 mb-5'>
        <Header
          title={`Laporan Permintaan Update Data Bulan ${getMonthName(selectedMonth)} ${selectedYear}`}
          selectedMonth={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
          setSelectedMonth={handleMonthYearChange}
          getMonthName={getMonthName}
          availableMonths={availableMonths}
          lastUpdateTime={data?.lastUpdateTime}
        />
        <h3 className='mt-5 lg:mt-2 text-lg font-bold text-white'>
          <span className='bg-light-green py-2 px-3 rounded'>{`Total Permintaan: ${data.totalRequests}`}</span>
        </h3>

        <div className="mt-10">
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
          <Tables data={tableData} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default KinerjaPermintaanUpdate;