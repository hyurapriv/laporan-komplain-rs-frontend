import React, { Suspense, lazy, memo, useEffect, useState, useCallback } from 'react';
import { useKomplainContext } from '../context/KomplainContext';
import { IoSendSharp } from "react-icons/io5";
import { FaTools, FaCheckCircle } from "react-icons/fa";
import { MdPendingActions, MdOutlineAccessTimeFilled } from "react-icons/md";
import { ErrorBoundary } from 'react-error-boundary';

const Header = lazy(() => import('../layouts/Header'));
const Footer = lazy(() => import('../layouts/Footer'));
const Loading = lazy(() => import('../components/ui/Loading'));
const Card = memo(lazy(() => import('../components/ui/Card')));
const BarChart = memo(lazy(() => import('../components/ui/BarChart')));
const Modal = lazy(() => import('../components/ui/Modal'));

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

const KomplainContent = () => {
  const {
    resources,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  } = useKomplainContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        resources.detailStatus?.read(),
        resources.bulan?.read(),
        resources.totalData?.read(),
        resources.totalStatus?.read(),
        resources.totalUnit?.read()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [resources]);

  useEffect(() => {
    loadData();
  }, [loadData, selectedMonth, selectedYear]);

  const openModal = useCallback((type) => {
    let detailData;
    try {
      const detailStatus = resources.detailStatus?.read();

      switch (type) {
        case 'terkirim':
          detailData = detailStatus?.detail_data?.detail_data_terkirim || [];
          break;
        case 'proses':
          detailData = detailStatus?.detail_data?.detail_data_proses || [];
          break;
        case 'selesai':
          detailData = detailStatus?.detail_data?.detail_data_selesai || [];
          break;
        case 'pending':
          detailData = detailStatus?.detail_data?.detail_data_pending || [];
          break;
        default:
          detailData = [];
      }

      setModalData(detailData);
      setModalTitle({
        terkirim: 'Detail Data Menunggu',
        proses: 'Detail Data Proses',
        pending: 'Detail Data Pending',
        selesai: 'Detail Data Selesai',
      }[type] || `Detail Data ${type.charAt(0).toUpperCase() + type.slice(1)}`);
      setModalOpen(true);
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  }, [resources.detailStatus]);

  const getIndonesianMonthName = (monthNumber) => {
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const monthIndex = parseInt(monthNumber, 10) - 1; // Convert to zero-based index
    return monthNames[monthIndex] || monthNumber; // Fallback to the number if invalid
  };


  const renderContent = () => {
    if (isLoading) {
      return <Loading />;
    }
    try {
      const bulanData = resources.bulan?.read();
      const totalData = resources.totalData?.read();
      const totalStatus = resources.totalStatus?.read();
      const totalUnit = resources.totalUnit?.read();

      if (!bulanData || !totalData || !totalStatus || !totalUnit) {
        return <Loading />;
      }

      const cards = [
        { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-sky-200', value: totalStatus?.total_status?.['Terkirim'] || 0, hasDetail: true, detailType: 'terkirim', tooltipText: 'Jumlah komplain yang terkirim, namun belum diproses oleh tim IT.' },
        { name: 'Proses', icon: <FaTools />, bgColor: 'bg-yellow-200', value: totalStatus?.total_status?.['Dalam Pengerjaan / Pengecekan Petugas'] || 0, hasDetail: true, detailType: 'proses', tooltipText: 'Jumlah komplain yang sedang diproses oleh tim IT.' },
        { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: totalStatus?.total_status?.['Selesai'] || 0, hasDetail: true, detailType: 'selesai', tooltipText: 'Jumlah komplain yang sudah berhasil diselesaikan.' },
        { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-slate-300', value: totalStatus?.total_status?.['Pending'] || 0, hasDetail: true, detailType: 'pending', tooltipText: 'Jumlah komplain yang ditunda.' },
        { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-orange-300', value: totalData?.respon_time || 'N/A', hasDetail: false, tooltipText: 'Rata-rata waktu respon untuk menangani komplain.' },
        { name: 'Durasi Pengerjaan', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-violet-300', value: totalData?.durasi_pengerjaan || 'N/A', hasDetail: false, tooltipText: 'Rata-rata durasi waktu pengerjaan untuk menyelesaikan komplain.' },
      ];

      return (
        <>
          <h3 className='mt-5 lg:mt-2 text-base lg:text-lg font-bold text-white'>
            <span className='bg-light-green py-2 px-3 rounded'>
              {`Total Komplain: ${totalData?.total_komplain || 0}`}
            </span>
          </h3>

          <div className='grid grid-cols-2 md:grid-cols-6 gap-4 mt-8 lg:mt-12'>
            {cards.map((card, index) => (
              <Suspense key={index} fallback={<div>Loading Card...</div>}>
                <Card {...card} onClick={card.hasDetail ? () => openModal(card.detailType) : undefined} />
              </Suspense>
            ))}
          </div>

          {totalUnit && (
            <Suspense fallback={<div className="text-center py-8">Loading Chart...</div>}>
              <BarChart data={totalUnit} />
            </Suspense>
          )}
        </>
      );
    } catch (error) {
      console.error("Error rendering content:", error);
      throw error;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {
      // Reset the state of your app so the error doesn't happen again
    }}>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <section className='px-2 lg:px-8 xl:px-4 pt-4 lg:pt-1'>
            <Suspense fallback={<Loading />}>
              <Header
                title={`Laporan Komplain IT Bulan ${getIndonesianMonthName(selectedMonth)} ${selectedYear}`}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                availableMonths={resources.bulan?.read()?.data_bulan}
                availableYears={resources.bulan?.read()?.data_tahun}
                lastUpdateTime={resources.totalData?.read()?.lastUpdate}
                isLoading={isLoading}
              />
            </Suspense>

            <Suspense fallback={<Loading />}>
              {renderContent()}
            </Suspense>

            <Suspense fallback={<Loading />}>
              <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                data={modalData}
                title={modalTitle}
              />
            </Suspense>
          </section>
        </div>
        <Suspense fallback={<Loading />}>
          <Footer />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default memo(KomplainContent);