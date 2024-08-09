import React, { useState, useEffect } from 'react';
import PieChart from '../ui/PieChart';
import { Bar } from 'react-chartjs-2';
import useDummyData from '../hooks/useDummyData';
import Header from '../layouts/Header';

const RawatJalan = () => {
  const [pieChartData, setPieChartData] = useState({ labels: [], datasets: [] });
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
  const { dataKomplain, setSelectedMonth, availableMonths, selectedMonth, getMonthName } = useDummyData();

  useEffect(() => {
    if (dataKomplain && dataKomplain.jumlahLayanan) {
      const layananData = dataKomplain.jumlahLayanan['2']?.layanan || {};
      const labels = Object.keys(layananData);
      const datasets = [
        {
          label: 'Jumlah Layanan',
          data: Object.values(layananData),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#267db3', '#6dc486', '#fad25e', '#ec6444', '#8561c8', '#E67E22'],
        },
      ];
      setPieChartData({ labels, datasets });
    }

    if (dataKomplain && dataKomplain.jumlahUnitStatus) {
      const statusData = dataKomplain.jumlahUnitStatus['Rawat Jalan']?.statuses || {};
      const labels = Object.keys(statusData);
      const datasets = [
        {
          label: 'Jumlah Status',
          data: Object.values(statusData),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ];
      setBarChartData({ labels, datasets });
    }
  }, [dataKomplain]);

  return (
    <div className="px-4 flex-1 pt-1">
      <Header
        title="Data Unit Rawat Jalan"
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        getMonthName={getMonthName}
        availableMonths={availableMonths}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Grafik Layanan</h3>
          </div>
          <div style={{ width: '100%', height: '400px' }}>
            <PieChart data={pieChartData} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Status Komplain</h3>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                    ticks: {
                      font: {
                        size: 10,
                      },
                    },
                  },
                  y: {
                    stacked: true,
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
      </div>
    </div>
  );
};

export default RawatJalan;
