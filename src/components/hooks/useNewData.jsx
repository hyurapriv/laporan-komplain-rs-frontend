import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const POLLING_INTERVAL = 30000; // 30 seconds
const STALE_TIME = 25000; // 25 seconds

const fetchNewData = async (year, month) => {
  const formattedMonth = month.toString().padStart(2, '0'); // Ensure month is two digits
  const response = await axios.get('http://localhost:8000/api/new-data', {
    params: { year, month: formattedMonth }
  });
  return response.data;
};

const useNewData = () => {
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const { data, error, isLoading } = useQuery({
    queryKey: ['newData', selectedYear, selectedMonth],
    queryFn: () => fetchNewData(selectedYear, selectedMonth),
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
  });

  const setSelectedMonthAndFetch = useCallback((month) => {
    setSelectedMonth(month);
    queryClient.prefetchQuery({
      queryKey: ['newData', selectedYear, month],
      queryFn: () => fetchNewData(selectedYear, month)
    });
  }, [queryClient, selectedYear]);

  const setSelectedYearAndFetch = useCallback((year) => {
    setSelectedYear(year);
    queryClient.prefetchQuery({
      queryKey: ['newData', year, selectedMonth],
      queryFn: () => fetchNewData(year, selectedMonth)
    });
  }, [queryClient, selectedMonth]);

  const getMonthName = useCallback((monthNumber) => {
    return new Date(selectedYear, monthNumber - 1).toLocaleString('id-ID', { month: 'long' });
  }, [selectedYear]);

  const availableMonths = useMemo(() => {
    return data?.availableMonths || [];
  }, [data]);

  return {
    data: data?.data,
    loading: isLoading,
    error,
    setSelectedMonth: setSelectedMonthAndFetch,
    setSelectedYear: setSelectedYearAndFetch,
    getMonthName,
    availableMonths,
    selectedMonth,
    selectedYear
  };
};

export default useNewData;
