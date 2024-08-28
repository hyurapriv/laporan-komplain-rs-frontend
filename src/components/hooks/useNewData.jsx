import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const POLLING_INTERVAL = 30000; // 30 seconds
const STALE_TIME = 60000; // 60 seconds

const CATEGORIES = {
  "IGD": ["Ambulance", "IGD"],
  "Rawat Jalan": [
    "Klinik Anak",
    "Klinik Bedah",
    "Klinik Gigi",
    "Klinik Jantung",
    "Klinik Konservasi",
    "Klinik Kulit",
    "Klinik Kusta",
    "Klinik Mata",
    "Klinik Obgyn",
    "Klinik Ortopedy",
    "Klinik Penyakit Dalam",
    "Klinik TB",
    "Klinik THT",
    "Klinik Umum"
  ],
  "Rawat Inap": ["Irna Atas", "Irna Bawah", "IBS", "VK", "Perinatology"],
  "Penunjang Medis": ["Farmasi", "Laboratorium", "Admisi / Rekam Medis", "Rehab Medik"],
  "Lainnya": ["Lainnya"]
};

const fetchNewData = async (year, month) => {
  const formattedMonth = month.toString().padStart(2, '0');
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
    cacheTime: 60000,
    refetchInterval: POLLING_INTERVAL,
  });

  const setSelectedMonthAndFetch = useCallback((monthYear) => {
    const [year, month] = monthYear.split('-');
    setSelectedYear(parseInt(year, 10));
    setSelectedMonth(parseInt(month, 10));
    queryClient.prefetchQuery({
      queryKey: ['newData', parseInt(year, 10), parseInt(month, 10)],
      queryFn: () => fetchNewData(parseInt(year, 10), parseInt(month, 10))
    });
  }, [queryClient]);

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
    getMonthName,
    availableMonths,
    selectedMonth,
    selectedYear,
    getCategoryName,
    detailData,
    lastUpdateTime: data?.lastUpdateTime
  };
};

export default useNewData;