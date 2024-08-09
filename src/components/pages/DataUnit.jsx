import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
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
  'Terkirim': '#36A2EB',  // Blue
  'Proses': '#F79D23',    // Yellow
  'Selesai': '#32CD32',   // Green
  'Pending': '#A70B17'    // Orange
};

const statusOrder = ['Terkirim', 'Proses', 'Selesai', 'Pending'];

const DataUnit = () => {
  const [serviceChartData, setServiceChartData] = useState({ labels: [], datasets: [] });
  const [statusChartData, setStatusChartData] = useState({ labels: [], datasets: [] });
  const [selectedUnit, setSelectedUnit] = useState('');
  const {
    dataKomplain,
    setSelectedMonth,
    availableMonths,
    selectedMonth,
    getMonthName,
    error,
    loading,
    serviceChartData: processedServiceChartData
  } = useDummyData();

  const units = useMemo(() => {
    return dataKomplain?.jumlahUnitStatus ? Object.keys(dataKomplain.jumlahUnitStatus) : [];
  }, [dataKomplain]);

  const updateChartData = useCallback(() => {
    if (processedServiceChartData && selectedUnit) {
      const filteredData = processedServiceChartData.filter(item => item.unit === selectedUnit);
      const labels = filteredData.map(item => item.layanan);
      const data = filteredData.map(item => item.jumlah);
      const backgroundColor = data.map((_, index) => colorPalette[index % colorPalette.length]);
      
      const datasets = [
        {
          label: 'Jumlah Komplain',
          data: data,
          backgroundColor: backgroundColor,
        },
      ];
      setServiceChartData({ labels, datasets });
    }

    if (dataKomplain && dataKomplain.jumlahUnitStatus && selectedUnit) {
      const statusData = dataKomplain.jumlahUnitStatus[selectedUnit]?.statuses || {};
      const orderedLabels = statusOrder.filter(status => statusData.hasOwnProperty(status));
      const data = orderedLabels.map(label => statusData[label]);
      const backgroundColor = orderedLabels.map(label => statusColors[label]);
      
      const datasets = [
        {
          label: 'Jumlah Status',
          data: data,
          backgroundColor: backgroundColor,
        },
      ];
      setStatusChartData({ labels: orderedLabels, datasets });
    }
  }, [dataKomplain, selectedUnit, processedServiceChartData]);

  useEffect(() => {
    updateChartData();
  }, [updateChartData]);

  useEffect(() => {
    if (units.length > 0 && !selectedUnit) {
      setSelectedUnit(units[0]);
    }
  }, [units, selectedUnit]);

  const hasData = useMemo(() => {
    return processedServiceChartData && processedServiceChartData.length > 0 && dataKomplain && Object.keys(dataKomplain.jumlahUnitStatus || {}).length > 0;
  }, [processedServiceChartData, dataKomplain]);

  return (
    <section className="px-4 flex-1 pt-1">
      <Header
        title="Data Unit"
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
                  <Bar
                    data={serviceChartData}
                    options={{
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
                    }}
                  />
                </div>
              </div>
            </Suspense>

            <Suspense fallback={<div>Loading Chart...</div>}>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm">Status Komplain</h3>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  <Bar
                    data={statusChartData}
                    options={{
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
                    }}
                  />
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