import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const POLLING_INTERVAL = 30000; // 30 detik
const STALE_TIME = 25000; // 25 detik

const fetchKomplainData = async (month) => {
  const cachedData = localStorage.getItem(`komplainData-${month}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  const response = await axios.get('http://localhost:8000/api/komplain-data', { params: { month } });
  localStorage.setItem(`komplainData-${month}`, JSON.stringify(response.data));
  return response.data;
};

const processServiceData = (data) => {
  if (!data || !data.jumlahLayanan) return [];
  return Object.entries(data.jumlahLayanan).flatMap(([unitId, unitData]) =>
    Object.entries(unitData.layanan).map(([layananName, count]) => ({
      unit: unitData.unitName,
      layanan: layananName,
      jumlah: count
    }))
  );
};

const useDummyData = () => {
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const { data: dataKomplain, error, isLoading } = useQuery({
    queryKey: ['komplainData', selectedMonth],
    queryFn: () => fetchKomplainData(selectedMonth),
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
  });

  const serviceChartData = useMemo(() => {
    return processServiceData(dataKomplain);
  }, [dataKomplain]);

  const getMonthName = useCallback((yearMonth) => {
    if (!yearMonth) return 'N/A';
    const [year, month] = yearMonth.split('-');
    return new Date(year, parseInt(month) - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  }, []);

  const setSelectedMonthAndFetch = useCallback((month) => {
    setSelectedMonth(month);
    queryClient.prefetchQuery({
      queryKey: ['komplainData', month],
      queryFn: () => fetchKomplainData(month)
    });
  }, [queryClient]);

  const availableMonths = useMemo(() => {
    return dataKomplain?.availableMonths || [];
  }, [dataKomplain]);

  return {
    dataKomplain,
    loading: isLoading,
    error,
    setSelectedMonth: setSelectedMonthAndFetch,
    getMonthName,
    availableMonths,
    selectedMonth,
    serviceChartData
  };
};

export default useDummyData;