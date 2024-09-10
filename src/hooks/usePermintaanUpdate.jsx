import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/permintaan-update',
});

const CACHE_VERSION = 'v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 menit

const createResource = (promise) => {
  let status = 'pending';
  let result;
  let suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    }
  );
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    },
  };
};

const fetchData = async (endpoint, params = {}) => {
  const cacheKey = `${endpoint}_${JSON.stringify(params)}_${CACHE_VERSION}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }

  try {
    const response = await api.get(endpoint, { params });
    const fetchedData = response.data;
    localStorage.setItem(cacheKey, JSON.stringify({ data: fetchedData, timestamp: Date.now() }));
    return fetchedData;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

const usePermintaanUpdate = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [resources, setResources] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Tambahkan state loading

  const createDataResource = useCallback((endpoint, params) => {
    return createResource(fetchData(endpoint, params));
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = currentDate.getFullYear().toString();

    if (!selectedMonth) setSelectedMonth(currentMonth);
    if (!selectedYear) setSelectedYear(currentYear);
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      setIsLoading(true); // Mulai loading saat data diambil
      setResources({
        bulan: createDataResource('/bulan'),
        totalData: createDataResource('/total-data', { month: selectedMonth, year: selectedYear }),
        totalStatus: createDataResource('/total-status', { month: selectedMonth, year: selectedYear }),
        detailStatus: createDataResource('/detail-status', { month: selectedMonth, year: selectedYear }),
        dataHarian: createDataResource('/data-harian', { month: selectedMonth, year: selectedYear }),
        petugas: createDataResource('/petugas', { month: selectedMonth, year: selectedYear }),
      });
      setIsLoading(false); // Matikan loading setelah data selesai diambil
    }
  }, [selectedMonth, selectedYear, createDataResource]);

  const loadPetugas = useCallback(() => {
    setIsLoading(true); // Mulai loading saat loadPetugas dipanggil
    setResources(prev => ({
      ...prev,
      petugas: createDataResource('/petugas', { month: selectedMonth, year: selectedYear }),
    }));
    setIsLoading(false); // Matikan loading setelah data selesai diambil
  }, [selectedMonth, selectedYear, createDataResource]);

  // Define the loadInitialData function
  const loadInitialData = useCallback(() => {
    setIsLoading(true); // Mulai loading saat loadInitialData dipanggil
    setResources(prev => ({
      ...prev,
      totalData: createDataResource('/total-data', { month: selectedMonth, year: selectedYear }),
      totalStatus: createDataResource('/total-status', { month: selectedMonth, year: selectedYear }),
    }));
    setIsLoading(false); // Matikan loading setelah data selesai diambil
  }, [selectedMonth, selectedYear, createDataResource]);

  return {
    resources,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    loadPetugas,
    loadInitialData,  // Include this in the return statement
    isLoading, // Tambahkan isLoading di return
  };
};


export default usePermintaanUpdate;
