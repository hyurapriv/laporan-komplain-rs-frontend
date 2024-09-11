import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/komplain',
});

export const useKomplainData = (initialData = {}) => {
  const currentDate = new Date();
  const defaultMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const defaultYear = currentDate.getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(initialData.selectedMonth || defaultMonth);
  const [selectedYear, setSelectedYear] = useState(initialData.selectedYear || defaultYear);

  useEffect(() => {
    if (!selectedMonth || !selectedYear) {
      const currentDate = new Date();
      const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const currentYear = currentDate.getFullYear().toString();

      if (!selectedMonth) setSelectedMonth(currentMonth);
      if (!selectedYear) setSelectedYear(currentYear);
    }
  }, [selectedMonth, selectedYear]);

  const fetchData = useCallback(async ({ queryKey }) => {
    const [endpoint, params] = queryKey;
    const response = await api.get(endpoint, { params });
    return response.data;
  }, []);

  const commonQueryOptions = {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    initialData: null,
  };

  const { data: bulanData } = useQuery({
    queryKey: ['/bulan'],
    queryFn: fetchData,
    ...commonQueryOptions,
    initialData: initialData.bulanData,
  });

  const { data: totalData } = useQuery({
    queryKey: ['/total-data', { month: selectedMonth, year: selectedYear }],
    queryFn: fetchData,
    ...commonQueryOptions,
    initialData: initialData.totalData,
    enabled: !!selectedMonth && !!selectedYear,
  });

  const { data: totalStatus } = useQuery({
    queryKey: ['/total-status', { month: selectedMonth, year: selectedYear }],
    queryFn: fetchData,
    ...commonQueryOptions,
    initialData: initialData.totalStatus,
    enabled: !!selectedMonth && !!selectedYear,
  });

  const { data: totalUnit } = useQuery({
    queryKey: ['/total-unit', { month: selectedMonth, year: selectedYear }],
    queryFn: fetchData,
    ...commonQueryOptions,
    initialData: initialData.totalUnit,
    enabled: !!selectedMonth && !!selectedYear,
  });

  const { data: detailStatus, isLoading: isDetailStatusLoading } = useQuery({
    queryKey: ['/detail-status', { month: selectedMonth, year: selectedYear }],
    queryFn: fetchData,
    ...commonQueryOptions,
    initialData: initialData.detailStatus,
    enabled: !!selectedMonth && !!selectedYear,
  });

  const updateMonthYear = useCallback((month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  }, []);

  return {
    bulanData,
    totalData,
    totalStatus,
    totalUnit,
    detailStatus,
    isDetailStatusLoading,
    selectedMonth,
    selectedYear,
    updateMonthYear,
  };
};
