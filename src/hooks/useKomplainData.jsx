import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/komplain',
});

const CACHE_VERSION = 'v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

const useKomplainData = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [resources, setResources] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('komplain');

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

  const loadDataForPage = useCallback((page, month, year) => {
    setIsLoading(true);

    const commonResources = {
      bulan: createDataResource('/bulan'),
    };

    const pageResources = {
      komplain: {
        totalData: createDataResource('/total-data', { month, year }),
        totalStatus: createDataResource('/total-status', { month, year }),
        totalUnit: createDataResource('/total-unit', { month, year }),
        detailStatus: createDataResource('/detail-status', { month, year }),
      },
      'data-unit': {
        detailUnit: createDataResource('/detail-unit', { month, year }),
      },
      'data-kinerja': {
        petugas: createDataResource('/petugas', { month, year }),
      },
    };

    setResources(prevResources => ({
      ...prevResources,
      ...commonResources,
      ...(pageResources[page] || {}),
    }));

    setIsLoading(false);
  }, [createDataResource]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      loadDataForPage(currentPage, selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, currentPage, loadDataForPage]);

  const changePage = useCallback((newPage) => {
    setCurrentPage(newPage);
    loadDataForPage(newPage, selectedMonth, selectedYear);
  }, [loadDataForPage, selectedMonth, selectedYear]);

  const updateMonthYear = useCallback((month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    loadDataForPage(currentPage, month, year);
  }, [currentPage, loadDataForPage]);

  return {
    resources,
    selectedMonth,
    selectedYear,
    updateMonthYear,
    isLoading,
    currentPage,
    changePage,
  };
};

export default useKomplainData;