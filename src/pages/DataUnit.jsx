import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useKomplainContext } from '../context/KomplainContext';
import Header from '../layouts/Header';
import Loading from '../components/ui/Loading';
import Footer from '../layouts/Footer';
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

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const colorPalette = [
  '#B414EF', '#0FBB98', '#FFCE56', '#A10E48', '#C1F39B', '#2EE4F3', '#577F8A', '#7CFC00', '#8B008B', '#00CED1', '#FF4500',
  '#1E90FF', '#FF1493', '#32CD32', '#FF8C00', '#4169E1', '#8A2BE2', '#C1FDBB'
];

const statusColors = {
  'Pending': '#F79D23',
  'Dalam Pengerjaan / Pengecekan Petugas': '#36A2EB',
  'Terkirim': '#3E5F8A',
  'Selesai': '#32CD32'
};

const statusOrder = ['Pending', 'Dalam Pengerjaan / Pengecekan Petugas', 'Terkirim', 'Selesai'];

const unitOrder = [
  'Unit IGD',
  'Unit Rawat Jalan',
  'Unit Rawat Inap',
  'Unit Penunjang Medis',
  'Unit Lainnya'
];

const DataUnit = () => {
  const {
    resources,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  } = useKomplainContext();

  const [selectedUnit, setSelectedUnit] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (resources.detailUnit) {
      try {
        const detailUnitData = resources.detailUnit.read();
        if (detailUnitData?.unit) {
          const units = Object.keys(detailUnitData.unit);
          const firstAvailableUnit = unitOrder.find(unit => units.includes(unit));
          if (firstAvailableUnit && !selectedUnit) {
            setSelectedUnit(firstAvailableUnit);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error reading detailUnit data:", error);
        setIsLoading(false);
      }
    }
  }, [resources.detailUnit, selectedUnit]);

  const serviceChartConfig = useMemo(() => {
    if (resources.detailUnit && selectedUnit) {
      try {
        const detailUnitData = resources.detailUnit.read();
        const unitData = detailUnitData?.unit?.[selectedUnit] || {};
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
      } catch (error) {
        console.error("Error creating serviceChartConfig:", error);
      }
    }
    return {
      labels: ['No Data'],
      datasets: [{
        label: 'Jumlah Komplain',
        data: [0],
        backgroundColor: colorPalette[0]
      }]
    };
  }, [resources.detailUnit, selectedUnit]);

  const statusChartConfig = useMemo(() => {
    if (resources.detailUnit && selectedUnit) {
      try {
        const detailUnitData = resources.detailUnit.read();
        const unitData = detailUnitData?.unit?.[selectedUnit] || {};
        const statusData = {};
        Object.values(unitData).forEach(service => {
          statusOrder.forEach(status => {
            statusData[status] = (statusData[status] || 0) + (service[status] || 0);
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
      } catch (error) {
        console.error("Error creating statusChartConfig:", error);
      }
    }
    return {
      labels: statusOrder,
      datasets: [{
        label: 'Jumlah Status',
        data: statusOrder.map(() => 0),
        backgroundColor: statusOrder.map(label => statusColors[label]),
      }]
    };
  }, [resources.detailUnit, selectedUnit]);

  const totalKomplainForUnit = useMemo(() => {
    if (resources.detailUnit && selectedUnit) {
      try {
        const detailUnitData = resources.detailUnit.read();
        return Object.values(detailUnitData?.unit?.[selectedUnit] || {}).reduce((total, service) => total + (service.Total || 0), 0);
      } catch (error) {
        console.error("Error calculating totalKomplainForUnit:", error);
      }
    }
    return 0;
  }, [resources.detailUnit, selectedUnit]);

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

  const getMonthName = (month) => {
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <section className="px-4 flex-1 pt-1">
        <Suspense fallback={<Loading />}>
          <Header
            title={`Laporan Komplain IT Bulan ${getMonthName(selectedMonth)} ${selectedYear}`}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableMonths={resources.bulan?.read()?.data_bulan}
            availableYears={resources.bulan?.read()?.data_tahun}
            lastUpdateTime={resources.totalData?.read()?.lastUpdate}
          />
        </Suspense>

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