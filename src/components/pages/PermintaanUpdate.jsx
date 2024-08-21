import React, { useMemo, Suspense, lazy } from 'react';
import useUpdateRequest from '../hooks/useUpdateRequest';
import { IoSendSharp } from "react-icons/io5";
import { FaTools, FaCheckCircle } from "react-icons/fa";
import { MdPendingActions, MdOutlineAccessTimeFilled } from "react-icons/md";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

const Loading = lazy(() => import('../ui/Loading'));
const Card = lazy(() => import('../ui/Card'));
const BarChart = lazy(() => import('../ui/BarChart'));
const DailyRequestsLineChart = lazy(() => import('../ui/LineChart'));

// Function to format time from minutes to hours and minutes
const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${Math.round(minutes)} menit`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours} jam ${mins} menit`;
};

const PermintaanUpdate = () => {
  const {
    data,
    error,
    loading,
    setSelectedMonth,
    setSelectedYear,
    getMonthName,
    selectedMonth,
    selectedYear,
    availableMonths,
  } = useUpdateRequest();

  const cards = useMemo(() => {
    const { totalStatus = {}, averageResponseTime } = data || {};
    return [
      { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-sky-200', value: totalStatus?.Terkirim || 0 },
      { name: 'Proses', icon: <FaTools />, bgColor: 'bg-yellow-200', value: totalStatus?.['Dalam Pengerjaan / Pengecekan Petugas'] || 0 },
      { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: totalStatus?.Selesai || 0 },
      { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-slate-300', value: totalStatus?.Pending || 0 },
      { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-orange-300', value: formatTime(averageResponseTime || 0) },
    ];
  }, [data]);

  const hasData = useMemo(() => {
    return data?.totalRequests > 0;
  }, [data]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <section className='px-2 lg:px-8 xl:px-4 pt-4 lg:pt-1'>
            <Header
              title={`Laporan Permintaan Update Data Bulan ${getMonthName(selectedMonth)} ${selectedYear}`}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              getMonthName={getMonthName}
              availableMonths={availableMonths}
            />
            <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
              <span className='bg-light-green py-2 px-3 rounded'>{`Total Permintaan: ${data?.totalRequests || 0}`}</span>
            </h3>
            {loading ? (
              <Suspense fallback={<div>Loading...</div>}>
                <Loading />
              </Suspense>
            ) : error ? (
              <div className="text-red-500">{error.message || 'An error occurred'}</div>
            ) : (
              <>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 lg:mt-12'>
                  <Suspense fallback={<div className="text-center py-4">Loading Cards...</div>}>
                    {cards.map((card, index) => (
                      <Card key={index} {...card} />
                    ))}
                  </Suspense>
                </div>
                <Suspense fallback={<div>Loading Daily Requests Chart...</div>}>
                  <div className='mt-8 lg:mt-12'>
                    {<DailyRequestsLineChart data={data?.dailyRequests || {}} selectedMonth={selectedMonth} selectedYear={selectedYear} />}
                  </div>
                </Suspense>
              </>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default React.memo(PermintaanUpdate);
