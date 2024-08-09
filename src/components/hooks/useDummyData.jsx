import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const useDummyData = () => {
  const [dataKomplain, setDataKomplain] = useState({
    totalKomplain: 0,
    jumlahStatus: {},
    jumlahPetugas: {},
    jumlahUnit: {},
    jumlahUnitStatus: {},
    jumlahLayanan: {},
    rerataResponTime: { menit: 0, formatted: 'N/A' },
    selectedMonth: '',
    availableMonths: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processServiceData = useCallback((data) => {
    const processedData = [];
    Object.entries(data).forEach(([unitId, unitData]) => {
      Object.entries(unitData.layanan).forEach(([layananName, count]) => {
        processedData.push({
          unit: unitData.unitName,
          layanan: layananName,
          jumlah: count
        });
      });
    });
    return processedData;
  }, []);

  const fetchKomplainData = useCallback(async (month) => {
    setLoading(true);
    setError(null);
    try {
      const cachedData = localStorage.getItem(`komplainData-${month}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setDataKomplain({
          ...parsedData,
          serviceChartData: processServiceData(parsedData.jumlahLayanan)
        });
      } else {
        const response = await axios.get('http://localhost:8000/api/komplain-data', { params: { month } });
        const processedData = {
          ...response.data,
          serviceChartData: processServiceData(response.data.jumlahLayanan)
        };
        localStorage.setItem(`komplainData-${month}`, JSON.stringify(processedData));
        setDataKomplain(processedData);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  }, [processServiceData]);

  useEffect(() => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    fetchKomplainData(currentMonth);
  }, [fetchKomplainData]);

  const setSelectedMonth = (month) => {
    fetchKomplainData(month);
  };

  const getMonthName = (yearMonth) => {
    if (!yearMonth) return 'N/A';
    const [year, month] = yearMonth.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  };

  return {
    dataKomplain,
    loading,
    error,
    setSelectedMonth,
    getMonthName,
    availableMonths: dataKomplain.availableMonths,
    selectedMonth: dataKomplain.selectedMonth,
    serviceChartData: dataKomplain.serviceChartData // Tambahkan ini
  };
};

export default useDummyData;
