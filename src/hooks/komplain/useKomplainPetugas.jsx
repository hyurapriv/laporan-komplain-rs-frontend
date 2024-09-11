import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/komplain',
});

const useKomplainPetugas = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = currentDate.getFullYear().toString();

    if (!selectedMonth) setSelectedMonth(currentMonth);
    if (!selectedYear) setSelectedYear(currentYear);
  }, []);

  const fetchData = useCallback(async ({ queryKey }) => {
    const [endpoint, params] = queryKey;
    const response = await api.get(endpoint, { params });
    return response.data;
  }, []);

  const { data: bulanData } = useQuery({ 
    queryKey: ['/bulan'], 
    queryFn: fetchData 
  });

  const { data: petugasData } = useQuery({ 
    queryKey: ['/petugas', { month: selectedMonth, year: selectedYear }], 
    queryFn: fetchData,
    enabled: !!selectedMonth && !!selectedYear
  });

  const updateMonthYear = useCallback((month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  return {
    bulanData,
    petugasData,
    selectedMonth,
    selectedYear,
    updateMonthYear,
  };
};

export default useKomplainPetugas;