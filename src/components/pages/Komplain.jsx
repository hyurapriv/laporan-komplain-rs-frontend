import React, { useMemo, useEffect, Suspense, lazy, useState } from 'react';
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
const Modal = lazy(() => import('../ui/Modal'));

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
    selectedYear,
    detailData,
    fetchData,
    lastUpdateTime
  } = useNewData();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    if (availableMonths && availableMonths.length > 0) {
      const currentMonthYear = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
      if (!availableMonths.includes(currentMonthYear)) {
        const [latestYear, latestMonth] = availableMonths[0].split('-');
        setSelectedYear(parseInt(latestYear, 10));
        setSelectedMonth(latestMonth);
        fetchData(parseInt(latestYear, 10), latestMonth);
      }
    }
  }, [availableMonths, selectedMonth, selectedYear, setSelectedMonth, setSelectedYear, fetchData]);

  const cards = useMemo(() => {
    const { totalStatus = {}, overallAverageResponTime = '' } = dataKomplain || {};
    return [
      { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-sky-200', value: totalStatus?.Terkirim || 0, hasDetail: true, detailType: 'terkirim', tooltipText: 'Jumlah komplain yang terkirim, namun belum diproses oleh tim IT.' },
      { name: 'Proses', icon: <FaTools />, bgColor: 'bg-yellow-200', value: totalStatus?.["Dalam Pengerjaan / Pengecekan Petugas"] || 0, hasDetail: true, detailType: 'proses', tooltipText: 'Jumlah komplain yang sedang diproses oleh tim IT.' },
      { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: totalStatus?.Selesai || 0, hasDetail: false, tooltipText: 'Jumlah komplain yang sudah berhasil diselesaikan.' },
      { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-slate-300', value: totalStatus?.Pending || 0, hasDetail: true, detailType: 'pending', tooltipText: 'Jumlah komplain yang ditunda.' },
      { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-orange-300', value: overallAverageResponTime || 'N/A', hasDetail: false, tooltipText: 'Rata-rata waktu respon untuk menangani komplain.' },
    ];
  }, [dataKomplain]);

  const hasData = useMemo(() => {
    const { totalStatus } = dataKomplain || {};
    return Object.keys(totalStatus || {}).length > 0;
  }, [dataKomplain]);

  const openModal = (type) => {
    setModalData(detailData[type]);
    setModalTitle(`Detail ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <section className='px-2 lg:px-8 xl:px-4 pt-4 lg:pt-1'>
            <Header
              title={`Laporan Komplain IT Bulan ${getMonthName(selectedMonth)} ${selectedYear}`}
              selectedMonth={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
              setSelectedMonth={setSelectedMonth}
              getMonthName={getMonthName}
              availableMonths={availableMonths}
              lastUpdateTime={lastUpdateTime}
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
                    {cards.map((card, index) => (
                      <Card
                        key={index}
                        {...card}
                        onClick={card.hasDetail ? () => openModal(card.detailType) : undefined}
                      />
                    ))}
                  </Suspense>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                  <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    data={modalData}
                    title={modalTitle}
                  />
                </Suspense>
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