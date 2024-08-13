// import React, { useMemo } from 'react';
// import useKomplainData from '../hooks/useDataKomplain';
// import Card from '../ui/Card';
// import BarChart from '../ui/BarChart';
// import { IoSendSharp } from "react-icons/io5";
// import { FaTools, FaCheckCircle } from "react-icons/fa";
// import { MdPendingActions, MdOutlineAccessTimeFilled } from "react-icons/md";
// import Loading from '../ui/Loading';

// const DataKomplain = () => {
//   const {
//     dataKomplain,
//     error,
//     loading,
//     setSelectedMonth,
//     getMonthName,
//   } = useKomplainData();

//   console.log('Loading:', loading); // Debugging log

//   const formatResponseTime = (totalMinutes) => {
//     const hours = Math.floor(totalMinutes / 60);
//     const minutes = Math.round(totalMinutes % 60);
//     return `${hours} jam ${minutes} menit`;
//   };

//   const cards = useMemo(() => [
//     { name: 'Terkirim', icon: <IoSendSharp />, bgColor: 'bg-green', value: dataKomplain.statusCounts?.Terkirim || 0 },
//     { name: 'Dalam Proses', icon: <FaTools />, bgColor: 'bg-green', value: dataKomplain.statusCounts?.['Dalam Pengerjaan / Pengecekan Petugas'] || 0 },
//     { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: dataKomplain.statusCounts?.Selesai || 0 },
//     { name: 'Ditunda', icon: <MdPendingActions />, bgColor: 'bg-green', value: dataKomplain.statusCounts?.pending || 0 },
//     { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-green', value: formatResponseTime(dataKomplain.averageResponseTime?.minutes || 0) },
//   ], [dataKomplain]);

//   const yearMonthOptions = useMemo(() => {
//     return Object.keys(dataKomplain.availableMonths || {}).map(key => {
//       const [year, month] = key.split('-');
//       return {
//         value: key,
//         label: `${getMonthName(`${year}-${month}`)} ${year}`
//       };
//     });
//   }, [dataKomplain.availableMonths, getMonthName]);

//   const barChartData = useMemo(() => {
//     const unitGroups = ['Klinis', 'Non-Klinis', 'Lainnya'];
//     const data = {};

//     unitGroups.forEach(group => {
//       data[group] = {
//         Terkirim: 0,
//         'Dalam Pengerjaan / Pengecekan Petugas': 0,
//         Selesai: 0,
//         Pending: 0
//       };

//       if (dataKomplain.unitCounts && dataKomplain.unitCounts[group]) {
//         Object.values(dataKomplain.unitCounts[group]).forEach(unit => {
//           Object.entries(unit).forEach(([status, count]) => {
//             if (data[group][status] !== undefined) {
//               data[group][status] += count;
//             }
//           });
//         });
//       }
//     });

//     return data;
//   }, [dataKomplain.unitCounts]);

//   if (loading) {
//     return <Loading />;
//   }

//   if (error) return <div className="text-red-500">{error}</div>;

//   const selectedMonth = dataKomplain.selectedMonth || '';
//   const [year, month] = selectedMonth.split('-');

//   return (
//     <section className='px-4 flex-1 pt-10'>
//       <div className='flex justify-between items-center'>
//         <h3 className='text-2xl font-bold text-slate-800'>
//           Data Komplain IT Bulan {getMonthName(`${year}-${month}`)} {year}
//         </h3>
//         <div className='flex gap-4'>
//           <select
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             className='bg-white border border-slate-500 rounded-md p-2 text-center'
//           >
//             <option value="">Pilih Tahun dan Bulan</option>
//             {yearMonthOptions.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <h3 className='ml-1 mt-2 text-lg font-bold text-white'>
//         <span className='bg-light-green py-2 px-3 rounded'>{`Total Komplain: ${dataKomplain.totalComplaints || 0}`}</span>
//       </h3>
//       <div className='grid grid-cols-5 gap-4 mt-14'>
//         {cards.map((card, index) => (
//           <Card
//             key={index}
//             name={card.name}
//             icon={card.icon}
//             bgColor={card.bgColor}
//             value={card.value}
//           />
//         ))}
//       </div>
//       <BarChart data={barChartData} />
//     </section>
//   );
// };

// export default DataKomplain;

import React, { useMemo, Suspense, lazy } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useDummyData from '../hooks/useDummyData';
import { IoSendSharp } from "react-icons/io5";
import { FaTools, FaCheckCircle } from "react-icons/fa";
import { MdPendingActions, MdOutlineAccessTimeFilled } from "react-icons/md";
import Header from '../layouts/Header';

const Loading = lazy(() => import('../ui/Loading'));
const Card = lazy(() => import('../ui/Card'));
const BarChart = lazy(() => import('../ui/BarChart'));

const Komplain = () => {
  const queryClient = useQueryClient();
  const {
    dataKomplain,
    error,
    loading,
    setSelectedMonth,
    getMonthName,
    selectedMonth,
    averageResponseTimeData
  } = useDummyData();

  React.useEffect(() => {
    if (dataKomplain?.availableMonths && !dataKomplain.availableMonths.includes(selectedMonth)) {
      setSelectedMonth(dataKomplain.availableMonths[0]);
    }
  }, [dataKomplain, selectedMonth, setSelectedMonth]);

  const cards = useMemo(() => {
    const { jumlahStatus = {}, rerataResponTime = {} } = dataKomplain || {};
    return [
      { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-green', value: jumlahStatus?.Terkirim || 0 },
      { name: 'Proses', icon: <FaTools />, bgColor: 'bg-green', value: jumlahStatus?.Proses || 0 },
      { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: jumlahStatus?.Selesai || 0 },
      { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-green', value: jumlahStatus?.Pending || 0 },
      { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-green', value: rerataResponTime?.formatted || 'N/A' },
    ];
  }, [dataKomplain]);

  const hasData = useMemo(() => {
    const { totalKomplain, jumlahUnitStatus } = dataKomplain || {};
    return totalKomplain > 0 && Object.keys(jumlahUnitStatus || {}).length > 0;
  }, [dataKomplain]);

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    queryClient.prefetchQuery({
      queryKey: ['komplainData', newMonth],
      queryFn: () => fetchKomplainData(newMonth)
    });
  };

  return (
    <section className='px-4 flex-1 pt-1'>
      <Header
        title={`Laporan Komplain IT Bulan ${getMonthName(selectedMonth)}`}
        selectedMonth={selectedMonth}
        setSelectedMonth={handleMonthChange}
        getMonthName={getMonthName}
        availableMonths={dataKomplain?.availableMonths || []}
      />
      <h3 className='ml-1 mt-2 text-lg font-bold text-white'>
        <span className='bg-light-green py-2 px-3 rounded'>{`Total Komplain: ${dataKomplain?.totalKomplain || 0}`}</span>
      </h3>
      {loading ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Loading />
        </Suspense>
      ) : error ? (
        <div className="text-red-500">{error.message || 'An error occurred'}</div>
      ) : hasData ? (
        <>
          <div className='grid grid-cols-5 gap-4 mt-14'>
            <Suspense fallback={<div>Loading Cards...</div>}>
              {cards.map((card, index) => (
                <Card key={index} {...card} />
              ))}
            </Suspense>
          </div>
          <Suspense fallback={<div>Loading Bar Chart...</div>}>
            {dataKomplain?.jumlahUnitStatus && <BarChart data={dataKomplain.jumlahUnitStatus} />}
          </Suspense>
        </>
      ) : (
        <div className="mt-14 text-center text-gray-600">
          <p className="text-xl">Tidak ada data komplain untuk bulan ini.</p>
          <p className="mt-2">Silakan pilih bulan lain atau periksa kembali data Anda.</p>
        </div>
      )}
    </section>
  );
};

export default React.memo(Komplain);