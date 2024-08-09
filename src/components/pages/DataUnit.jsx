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
    loading
  } = useDummyData();

  const units = useMemo(() => {
    return dataKomplain?.jumlahUnitStatus ? Object.keys(dataKomplain.jumlahUnitStatus) : [];
  }, [dataKomplain]);

  // Use useCallback to avoid re-creating functions on every render
  const updateChartData = useCallback(() => {
    if (dataKomplain && dataKomplain.jumlahLayanan && selectedUnit) {
      const serviceData = dataKomplain.jumlahLayanan[selectedUnit]?.layanan || {};
      const labels = Object.keys(serviceData);
      const datasets = [
        {
          label: 'Jumlah Layanan',
          data: Object.values(serviceData),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#267db3', '#6dc486', '#fad25e', '#ec6444', '#8561c8', '#E67E22'],
        },
      ];
      setServiceChartData({ labels, datasets });
    }

    if (dataKomplain && dataKomplain.jumlahUnitStatus && selectedUnit) {
      const statusData = dataKomplain.jumlahUnitStatus[selectedUnit]?.statuses || {};
      const labels = Object.keys(statusData);
      const datasets = [
        {
          label: 'Jumlah Status',
          data: Object.values(statusData),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ];
      setStatusChartData({ labels, datasets });
    }
  }, [dataKomplain, selectedUnit]);

  useEffect(() => {
    updateChartData();
  }, [updateChartData]);

  useEffect(() => {
    if (units.length > 0 && !selectedUnit) {
      setSelectedUnit(units[0]);
    }
  }, [units, selectedUnit]);

  const hasData = useMemo(() => {
    return dataKomplain && Object.keys(dataKomplain.jumlahLayanan || {}).length > 0 && Object.keys(dataKomplain.jumlahUnitStatus || {}).length > 0;
  }, [dataKomplain]);

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
              <div className="bg-white p-4 rounded-lg shadow">
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
              <div className="bg-white p-4 rounded-lg shadow">
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
