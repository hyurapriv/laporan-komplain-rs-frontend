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


import React, { useMemo, useEffect, Suspense, lazy } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import useNewData from '../hooks/useNewData';
import { IoSendSharp } from "react-icons/io5";
import { FaTools, FaCheckCircle } from "react-icons/fa";
import { MdPendingActions, MdOutlineAccessTimeFilled } from "react-icons/md";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

const Loading = lazy(() => import('../ui/Loading'));
const Card = lazy(() => import('../ui/Card'));
const BarChart = lazy(() => import('../ui/BarChart'));

const Komplain = () => {
  const queryClient = useQueryClient();
  const {
    data: dataKomplain,
    error,
    loading,
    setSelectedMonth,
    setSelectedYear,
    getMonthName,
    availableMonths,
    selectedMonth,
    selectedYear
  } = useNewData();

  useEffect(() => {
    console.log("Available Months:", availableMonths); // Log for debugging
    if (availableMonths.length && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth, setSelectedMonth]);

  const cards = useMemo(() => {
    const { totalStatus = {}, overallAverageResponTime = {} } = dataKomplain || {};
    return [
      { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-green', value: totalStatus?.Terkirim || 0 },
      { name: 'Proses', icon: <FaTools />, bgColor: 'bg-yellow', value: totalStatus?.["Dalam Pengerjaan / Pengecekan Petugas"] || 0 },
      { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-blue', value: totalStatus?.Selesai || 0 },
      { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-red', value: totalStatus?.Pending || 0 },
      { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-gray', value: overallAverageResponTime || 'N/A' },
    ];
  }, [dataKomplain]);

  const hasData = useMemo(() => {
    const { totalStatus } = dataKomplain || {};
    return Object.keys(totalStatus || {}).length > 0;
  }, [dataKomplain]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <section className='px-2 lg:px-8 xl:px-4 pt-4 lg:pt-1'>
            <Header
              title={`Laporan Komplain IT Bulan ${getMonthName(selectedMonth)} ${selectedYear}`}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              getMonthName={getMonthName}
              availableMonths={availableMonths}
            />
            <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
              <span className='bg-light-green py-2 px-3 rounded'>
                {`Total Komplain: ${dataKomplain?.totalStatus?.Total || 0}`}
              </span>
            </h3>
            {loading ? (
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <Loading />
              </Suspense>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error.message || 'An error occurred'}</div>
            ) : hasData ? (
              <>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 lg:mt-12'>
                  <Suspense fallback={<div className="text-center py-4">Loading Cards...</div>}>
                    {cards.slice(0, 4).map((card, index) => (
                      <Card key={index} {...card} />
                    ))}
                    <div className="col-span-2 md:col-span-1">
                      <Card {...cards[4]} />
                    </div>
                  </Suspense>
                </div>
                <Suspense fallback={<div className="text-center py-8">Loading Bar Chart...</div>}>
                  {dataKomplain?.units && (
                    <div className="mt-8 lg:mt-12">
                      <BarChart data={dataKomplain.units} />
                    </div>
                  )}
                </Suspense>
              </>
            ) : (
              <div className="text-center py-8">No data available for the selected month</div>
            )}
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Komplain;
