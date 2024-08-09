import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useDummyData = () => {
  const [dataKomplain, setDataKomplain] = useState({
    totalKomplain: 0,
    jumlahStatus: {},
    jumlahPetugas: {},
    jumlahUnit: {},
    jumlahUnitStatus: {},
    rerataResponTime: { menit: 0, formatted: 'N/A' },
    selectedMonth: '',
    availableMonths: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKomplainData = useCallback(async (month) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/komplain-data', { params: { month } });
      setDataKomplain(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { dataKomplain, loading, error, setSelectedMonth, getMonthName };
};

export default useDummyData;
