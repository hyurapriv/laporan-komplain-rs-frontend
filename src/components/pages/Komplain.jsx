import React, { useMemo, useEffect, Suspense, lazy } from 'react';
import { IoSendSharp } from "react-icons/io5";
import { FaTools, FaCheckCircle } from "react-icons/fa";
import { MdPendingActions, MdOutlineAccessTimeFilled } from "react-icons/md";
import useNewData from '../hooks/useNewData';

const Header = lazy(() => import('../layouts/Header'));
const Footer = lazy(() => import('../layouts/Footer'));
const Loading = lazy(() => import('../ui/Loading'));
const Card = lazy(() => import('../ui/Card'));
const BarChart = lazy(() => import('../ui/BarChart'));
const Modal = lazy(() => import('../ui/Modal'));

const Komplain = () => {
  const {
    data: dataKomplain,
    error,
    loading,
    setSelectedMonth,
    getMonthName,
    availableMonths,
    selectedMonth,
    selectedYear,
    detailData,
    lastUpdateTime
  } = useNewData();

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState([]);
  const [modalTitle, setModalTitle] = React.useState('');

  useEffect(() => {
    if (availableMonths?.length > 0) {
      const currentMonthYear = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
      if (!availableMonths.includes(currentMonthYear)) {
        setSelectedMonth(availableMonths[0]);
      }
    }
  }, [availableMonths, selectedMonth, selectedYear, setSelectedMonth]);

  const cards = useMemo(() => {
    const { totalStatus = {}, overallAverageResponTime = '' } = dataKomplain || {};
    return [
      { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-sky-200', value: totalStatus?.Terkirim || 0, hasDetail: true, detailType: 'terkirim', tooltipText: 'Jumlah komplain yang terkirim, namun belum diproses oleh tim IT.' },
      { name: 'Proses', icon: <FaTools />, bgColor: 'bg-yellow-200', value: totalStatus?.["Dalam Pengerjaan / Pengecekan Petugas"] || 0, hasDetail: true, detailType: 'proses', tooltipText: 'Jumlah komplain yang sedang diproses oleh tim IT.' },
      { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: totalStatus?.Selesai || 0, hasDetail: true, detailType: 'selesai', tooltipText: 'Jumlah komplain yang sudah berhasil diselesaikan.' },
      { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-slate-300', value: totalStatus?.Pending || 0, hasDetail: true, detailType: 'pending', tooltipText: 'Jumlah komplain yang ditunda.' },
      { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-orange-300', value: overallAverageResponTime || 'N/A', hasDetail: false, tooltipText: 'Rata-rata waktu respon untuk menangani komplain.' },
    ];
  }, [dataKomplain]);

  const hasData = useMemo(() => Object.keys(dataKomplain?.totalStatus || {}).length > 0, [dataKomplain]);

  const openModal = React.useCallback((type) => {
    setModalData(detailData[type]);
    setModalTitle({
      terkirim: 'Detail Data Menunggu',
      proses: 'Detail Data Proses',
      pending: 'Detail Data Pending',
    }[type] || `Detail Data ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    setModalOpen(true);
  }, [detailData]);

  if (loading) return <Suspense fallback={<div className="text-center py-8">Loading...</div>}><Loading /></Suspense>;
  if (error) return <div className="text-red-500 text-center py-8">{error.message || 'An error occurred'}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <section className='px-2 lg:px-8 xl:px-4 pt-4 lg:pt-1'>
          <Suspense fallback={<div>Loading Header...</div>}>
            <Header
              title={`Laporan Komplain IT Bulan ${getMonthName(selectedMonth)} ${selectedYear}`}
              selectedMonth={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
              setSelectedMonth={setSelectedMonth}
              getMonthName={getMonthName}
              availableMonths={availableMonths}
              lastUpdateTime={lastUpdateTime}
            />
          </Suspense>

          <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
            <span className='bg-light-green py-2 px-3 rounded'>
              {`Total Komplain: ${dataKomplain?.totalComplaints || 0}`}
            </span>
          </h3>

          {hasData && (
            <>
              <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 lg:mt-12'>
                {cards.map((card, index) => (
                  <Suspense key={index} fallback={<div>Loading Card...</div>}>
                    <Card
                      {...card}
                      onClick={card.hasDetail ? () => openModal(card.detailType) : undefined}
                    />
                  </Suspense>
                ))}
              </div>
              <Suspense fallback={<div>Loading Modal...</div>}>
                <Modal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  data={modalData}
                  title={modalTitle}
                />
              </Suspense>
              {dataKomplain?.categories && (
                <Suspense fallback={<div className="text-center py-8">Loading Bar Chart...</div>}>
                  <div className="mt-8 lg:mt-12">
                    <BarChart data={dataKomplain.categories} />
                  </div>
                </Suspense>
              )}
            </>
          )}
          {!hasData && <div className="text-center py-8">No data available for the selected month</div>}
        </section>
      </div>
      <Suspense fallback={<div>Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Komplain;