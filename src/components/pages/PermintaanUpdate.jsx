import React, { useMemo, Suspense, lazy } from 'react';
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

const PermintaanUpdate = () => {
  const queryClient = useQueryClient();
  const {
    dataUpdate,
    error,
    loading,
    setSelectedMonth,
    getMonthName,
    selectedMonth,
  } = useNewData();

  // Ensure selectedMonth is within the available months
  React.useEffect(() => {
    if (dataUpdate?.availableMonths && !dataUpdate.availableMonths.includes(selectedMonth)) {
      setSelectedMonth(dataUpdate.availableMonths[0]); // Set to the first available month if current month is not available
    }
  }, [dataUpdate, selectedMonth, setSelectedMonth]);

  const cards = useMemo(() => {
    const { jumlahStatus = {}, rerataResponTime = {} } = dataUpdate || {};
    return [
      { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-green', value: jumlahStatus?.Terkirim || 0 },
      { name: 'Proses', icon: <FaTools />, bgColor: 'bg-green', value: jumlahStatus?.Proses || 0 },
      { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: jumlahStatus?.Selesai || 0 },
      { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-green', value: jumlahStatus?.Pending || 0 },
      { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-green', value: rerataResponTime?.formatted || 'N/A' },
    ];
  }, [dataUpdate]);

  const hasData = useMemo(() => {
    const { totalKomplain, jumlahUnitStatus } = dataUpdate || {};
    return totalKomplain > 0 && Object.keys(jumlahUnitStatus || {}).length > 0;
  }, [dataUpdate]);

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    queryClient.prefetchQuery({
      queryKey: ['updateData', newMonth],
      queryFn: () => fetchUpdateData(newMonth)
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <section className='px-2 lg:px-8 xl:px-4 pt-4 lg:pt-1'>
            <Header
              title={`Laporan Permintaan Update Data Bulan ${getMonthName(selectedMonth)}`}
              selectedMonth={selectedMonth}
              setSelectedMonth={handleMonthChange}
              getMonthName={getMonthName}
              availableMonths={dataUpdate?.availableMonths || []}
            />
            <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
              <span className='bg-light-green py-2 px-3 rounded'>{`Total Permintaan: ${dataUpdate?.totalKomplain || 0}`}</span>
            </h3>
            {loading ? (
              <Suspense fallback={<div>Loading...</div>}>
                <Loading />
              </Suspense>
            ) : error ? (
              <div className="text-red-500">{error.message || 'An error occurred'}</div>
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
                <Suspense fallback={<div>Loading Chart...</div>}>
                  {dataUpdate?.jumlahUnitStatus && <BarChart data={dataUpdate.jumlahUnitStatus} />}
                </Suspense>
              </>
            ) : (
              <div className="mt-14 text-center text-gray-600">
                <p className="text-xl">Tidak ada data permintaan update untuk bulan ini.</p>
                <p className="mt-2">Silakan pilih bulan lain atau periksa kembali data Anda.</p>
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default React.memo(PermintaanUpdate);