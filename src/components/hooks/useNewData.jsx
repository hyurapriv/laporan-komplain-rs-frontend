import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const POLLING_INTERVAL = 30000; // 30 seconds
const STALE_TIME = 60000; // 60 seconds (increased from 25 seconds)

// Definisikan kategori di sini
const CATEGORIES = {
  "IGD": ["Ambulance", "IGD"],
  "Rawat Jalan": [
    "Klinik Anak",
    // other clinics...
  ],
  "Rawat Inap": ["Irna Atas", "Irna Bawah", "IBS", "VK (bersalin)", "Perinatology"],
  "Penunjang Medis": ["Farmasi", "Laboratorium", "Admisi / Rekam Medis", "Rehab Medik"],
  "Lainnya": ["Lainnya"]
};

// Fetch data function
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
    cacheTime: 60000, // Cache data for 60 seconds
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

  const detailData = useMemo(() => {
    return {
      terkirim: data?.detailData?.detailDataTerkirim || [],
      proses: data?.detailData?.detailDataProses || [],
      pending: data?.detailData?.detailDataPending || []
    };
  }, [data]);

  const getCategoryName = (unit) => {
    for (const [category, units] of Object.entries(CATEGORIES)) {
      if (units.includes(unit)) {
        return category;
      }
    }
    return "Lainnya";
  };

  return {
    data: data?.data,
    loading: isLoading,
    error,
    setSelectedMonth: setSelectedMonthAndFetch,
    setSelectedYear: setSelectedYearAndFetch,
    getMonthName,
    availableMonths,
    selectedMonth,
    selectedYear,
    getCategoryName,
    detailData,
    lastUpdateTime: data?.lastUpdateTime // Ensure this is correctly provided
  };
};

export default useNewData;