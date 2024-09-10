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
import { useKomplainContext } from '../context/KomplainContext';
import Header from '../layouts/Header';
import Loading from '../components/ui/Loading';
import { Tables } from '../components/ui/Tables';
import Footer from '../layouts/Footer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const petugasColors = {
  'Adika Wicaksana': '#B414EF',
  'Agus': '#0FBB98',
  'Ali Muhson': '#FFCE56',
  'Bayu': '#A10E48',
  'Ganang': '#C1F39B',
  'Virgie': '#3E5F8A',
};

const fixedOrder = ['Adika Wicaksana', 'Agus', 'Ali Muhson', 'Bayu', 'Ganang', 'Virgie'];

const DataKinerja = () => {
  const {
    resources,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    isLoading,
    error
  } = useKomplainContext();

  const data = resources.petugas || {};
  const totalComplaints = useMemo(() => {
    if (!data.petugasCounts) return 0;
    return Object.values(data.petugasCounts).reduce((acc, value) => acc + value, 0);
  }, [data]);

  const tableData = useMemo(() => {
    if (!data.petugasCounts) return [];
    const unsortedData = fixedOrder.map(name => ({
      nama: name,
      jumlahPengerjaan: data.petugasCounts[name] || 0,
      kontribusi: ((data.petugasCounts[name] || 0) / totalComplaints * 100).toFixed(2) + '%',
    }));
    return unsortedData.sort((a, b) => b.jumlahPengerjaan - a.jumlahPengerjaan);
  }, [data, totalComplaints]);

  const barChartConfig = useMemo(() => {
    if (!data.petugasCounts) return { labels: [], datasets: [] };

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

  const totalData = resources.totalData?.read();
  const petugas = resources.petugas?.read();

  const getIndonesianMonthName = (monthNumber) => {
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const monthIndex = parseInt(monthNumber, 10) - 1;
    return monthNames[monthIndex] || monthNumber;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) return <div className="text-red-500">{error}</div>;

  if (!data) {
    return <div>No data available</div>;
  }


  return (
    <>
      <div className='px-4 flex-1 pt-1 mb-5'>
        <Header
          title={`Laporan Komplain IT Bulan ${getIndonesianMonthName(selectedMonth)} ${selectedYear}`}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableMonths={resources.bulan?.read()?.data_bulan}
          availableYears={resources.bulan?.read()?.data_tahun}
          lastUpdateTime={resources.totalData?.read()?.lastUpdate}
          isLoading={isLoading}
        />
       <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
            <span className='bg-light-green py-2 px-3 rounded'>
              {`Total Komplain: ${totalData?.total_komplain || 0}`}
            </span>
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
          <Tables data={petugas.petugas} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DataKinerja;
