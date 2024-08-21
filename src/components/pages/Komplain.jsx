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
    console.log("Data Komplain:", dataKomplain);
    console.log("Available Months:", availableMonths);
    console.log("Selected Month:", selectedMonth);
    console.log("Selected Year:", selectedYear);

    if (availableMonths && availableMonths.length > 0 && !availableMonths.includes(`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`)) {
      const [latestYear, latestMonth] = availableMonths[0].split('-');
      console.log("Updating to latest available month:", latestYear, latestMonth);
      setSelectedYear(parseInt(latestYear, 10));
      setSelectedMonth(latestMonth);
    }
  }, [availableMonths, selectedMonth, selectedYear, setSelectedMonth, setSelectedYear, dataKomplain]);

  const cards = useMemo(() => {
    const { totalStatus = {}, overallAverageResponTime = '' } = dataKomplain || {};
    return [
      { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-sky-200', value: totalStatus?.Terkirim || 0 },
      { name: 'Proses', icon: <FaTools />, bgColor: 'bg-yellow-200', value: totalStatus?.["Dalam Pengerjaan / Pengecekan Petugas"] || 0 },
      { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: totalStatus?.Selesai || 0 },
      { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-slate-300', value: totalStatus?.Pending || 0 },
      { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-orange-300', value: overallAverageResponTime || 'N/A' },
    ];
  }, [dataKomplain]);

  const hasData = useMemo(() => {
    const { totalStatus } = dataKomplain || {};
    return Object.keys(totalStatus || {}).length > 0;
  }, [dataKomplain]);

  // Example: Set lastUpdateTime to current time for demonstration purposes
  const lastUpdateTime = new Date().toISOString(); // Replace with actual last update time

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <section className='px-2 lg:px-8 xl:px-4 pt-4 lg:pt-1'>
            <Header
              title={`Laporan Komplain IT Bulan ${getMonthName(parseInt(selectedMonth, 10))} ${selectedYear}`}
              selectedMonth={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
              setSelectedMonth={(value) => {
                const [year, month] = value.split('-');
                setSelectedYear(parseInt(year, 10));
                setSelectedMonth(month);
              }}
              getMonthName={getMonthName}
              availableMonths={availableMonths || []}
              lastUpdateTime={dataKomplain?.lastUpdateTime} // Ensure this is correctly set
            />

            <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
              <span className='bg-light-green py-2 px-3 rounded'>
                {`Total Komplain: ${dataKomplain?.totalComplaints || 0}`}
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
                  {dataKomplain?.categories && (
                    <div className="mt-8 lg:mt-12">
                      <BarChart data={dataKomplain.categories} />
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
