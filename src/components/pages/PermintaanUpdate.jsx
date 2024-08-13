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

const PermintaanUpdate = () => {
  const queryClient = useQueryClient();
  const {
    dataUpdate,
    error,
    loading,
    setSelectedMonth,
    getMonthName,
    selectedMonth,
  } = useDummyData();

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
    <section className='px-4 flex-1 pt-1'>
      <Header
        title={`Laporan Permintaan Update Data Bulan ${getMonthName(selectedMonth)}`}
        selectedMonth={selectedMonth}
        setSelectedMonth={handleMonthChange}
        getMonthName={getMonthName}
        availableMonths={dataUpdate?.availableMonths || []}
      />
      <h3 className='ml-1 mt-2 text-lg font-bold text-white'>
        <span className='bg-light-green py-2 px-3 rounded'>{`Total Permintaan Update Data: ${dataUpdate?.totalKomplain || 0}`}</span>
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
  );
};

export default React.memo(PermintaanUpdate);