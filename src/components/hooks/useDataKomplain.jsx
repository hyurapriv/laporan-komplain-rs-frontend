// import { useState, useEffect, useCallback, useMemo } from 'react';
// import axios from 'axios';

// const useKomplainData = () => {
//   const [dataKomplain, setDataKomplain] = useState({
//     totalComplaints: 0,
//     statusCounts: {
//       Terkirim: 0,
//       'Dalam Pengerjaan / Pengecekan Petugas': 0,
//       Selesai: 0,
//       Pending: 0
//     },
//     petugasCounts: {},
//     petugasResponseTimes: {},
//     unitCounts: {},
//     averageResponseTime: { formatted: 'N/A', minutes: 0 },
//     selectedMonth: '',
//     availableMonths: {}
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchKomplainData = useCallback(async (month) => {
//     if (!month) return;

//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:8000/api/komplain-data', {
//         params: { month }
//       });

//       if (response.status === 200) {
//         setDataKomplain(prevState => ({
//           ...prevState,
//           ...response.data,
//           selectedMonth: month // Ensure selectedMonth is updated
//         }));
//       } else {
//         setError(`Unexpected status code: ${response.status}`);
//       }
//     } catch (error) {
//       setError(`Failed to fetch data: ${error.response?.status} - ${error.response?.data?.message || 'Unknown error'}`);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const currentMonth = new Date().toISOString().slice(0, 7);
//     fetchKomplainData(currentMonth);
//   }, [fetchKomplainData]);

//   const setSelectedMonth = useCallback((month) => {
//     const [year, monthStr] = month.split('-');
//     if (!year || !monthStr || monthStr.length !== 2 || isNaN(parseInt(monthStr))) {
//       console.error('Invalid month format:', month);
//       return;
//     }

//     const formattedMonth = `${year}-${monthStr.padStart(2, '0')}`;
//     fetchKomplainData(formattedMonth); // Directly fetch data when month changes
//   }, [fetchKomplainData]);

//   const years = useMemo(() => {
//     const months = Object.keys(dataKomplain.availableMonths);
//     return [...new Set(months.map(month => month.slice(0, 4)))].sort((a, b) => b - a);
//   }, [dataKomplain.availableMonths]);

//   const months = useMemo(() => {
//     const selectedYear = dataKomplain.selectedMonth.slice(0, 4);
//     return Object.keys(dataKomplain.availableMonths)
//       .filter(month => month.startsWith(selectedYear))
//       .sort((a, b) => a.localeCompare(b));
//   }, [dataKomplain.selectedMonth, dataKomplain.availableMonths]);

//   const getMonthName = useCallback((monthCode) => {
//     const [year, month] = monthCode.split('-');
//     if (!year || !month || month.length !== 2 || isNaN(parseInt(month))) {
//       return 'Invalid Date';
//     }

//     const monthNumber = parseInt(month, 10) - 1;
//     const date = new Date(year, monthNumber);
//     if (isNaN(date.getTime())) {
//       return 'Invalid Date';
//     }

//     return date.toLocaleString('id-ID', { month: 'long' });
//   }, []);

//   return {
//     dataKomplain,
//     error,
//     loading,
//     setSelectedMonth,
//     years,
//     months,
//     getMonthName
//   };
// };

// export default useKomplainData;

