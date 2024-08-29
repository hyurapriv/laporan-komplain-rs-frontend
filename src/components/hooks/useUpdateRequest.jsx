import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const POLLING_INTERVAL = 30000; // 30 seconds
const STALE_TIME = 25000; // 25 seconds

const fetchUpdateRequestData = async (year, month) => {
  const formattedMonth = month.toString().padStart(2, '0');
  const response = await axios.get('http://localhost:8000/api/new-update', {
    params: { year, month: formattedMonth }
  });
  return response.data;
};

const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const { data, error, isLoading } = useQuery({
    queryKey: ['updateRequestData', selectedYear, selectedMonth],
    queryFn: () => fetchUpdateRequestData(selectedYear, selectedMonth),
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
  });

  const setSelectedMonthAndFetch = useCallback((month) => {
    setSelectedMonth(month);
    queryClient.prefetchQuery({
      queryKey: ['updateRequestData', selectedYear, month],
      queryFn: () => fetchUpdateRequestData(selectedYear, month)
    });
  }, [queryClient, selectedYear]);

  const setSelectedYearAndFetch = useCallback((year) => {
    setSelectedYear(year);
    queryClient.prefetchQuery({
      queryKey: ['updateRequestData', year, selectedMonth],
      queryFn: () => fetchUpdateRequestData(year, selectedMonth)
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
    petugasCounts: data?.data?.petugasCounts,
    totalStatus: data?.data?.totalStatus,
    totalRequests: data?.data?.totalRequests,
    dailyRequests: data?.data?.dailyRequests,
    averageResponseTime: data?.data?.averageResponseTime,
    averageCompletedResponseTime: data?.data?.averageCompletedResponseTime,
    availableMonths,
    detailDataTerkirim: data?.detailDataTerkirim,
    detailDataProses: data?.detailDataProses,
    detailDataSelesai: data?.detailDataSelesai,
    detailDataPending: data?.detailDataPending,
    loading: isLoading,
    error,
    setSelectedMonth: setSelectedMonthAndFetch,
    setSelectedYear: setSelectedYearAndFetch,
    getMonthName,
    selectedMonth,
    selectedYear,
  };
};

export default useUpdateRequest;