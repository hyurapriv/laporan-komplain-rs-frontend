import React, { useMemo, Suspense, lazy, useState, useEffect } from 'react';
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
const Modal = lazy(() => import('../ui/Modal'));

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
    detailDataTerkirim,
    detailDataProses,
    detailDataPending,
  } = useUpdateRequest();

  useEffect(() => {
    console.log("Data updated:", data);
    console.log("Selected Month:", selectedMonth);
    console.log("Selected Year:", selectedYear);
  }, [data, selectedMonth, selectedYear]);

  const handleMonthYearChange = (value) => {
    const [year, month] = value.split('-');
    setSelectedYear(parseInt(year, 10));
    setSelectedMonth(parseInt(month, 10));
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  const cards = useMemo(() => {
    const { totalStatus = {}, averageResponseTime } = data || {};
    return [
      { name: 'Menunggu', icon: <IoSendSharp />, bgColor: 'bg-sky-200', value: totalStatus?.Terkirim || 0, hasDetail: true, detailType: 'terkirim', tooltipText: 'Jumlah komplain yang terkirim, namun belum diproses oleh tim IT.' },
      { name: 'Proses', icon: <FaTools />, bgColor: 'bg-yellow-200', value: totalStatus?.['Dalam Pengerjaan / Pengecekan Petugas'] || 0, hasDetail: true, detailType: 'proses', tooltipText: 'Jumlah komplain yang sedang diproses oleh tim IT.' },
      { name: 'Selesai', icon: <FaCheckCircle />, bgColor: 'bg-green', value: totalStatus?.Selesai || 0, hasDetail: false, tooltipText: 'Jumlah komplain yang sudah berhasil diselesaikan.' },
      { name: 'Pending', icon: <MdPendingActions />, bgColor: 'bg-slate-300', value: totalStatus?.Pending || 0, hasDetail: true, detailType: 'pending', tooltipText: 'Jumlah komplain yang ditunda.' },
      { name: 'Respon Time', icon: <MdOutlineAccessTimeFilled />, bgColor: 'bg-orange-300', value: formatTime(averageResponseTime || 0), hasDetail: false, tooltipText: 'Rata-rata waktu respon untuk menangani komplain.' },
    ];
  }, [data]);

  const hasData = useMemo(() => {
    return data?.totalRequests > 0;
  }, [data]);

  const openModal = (type) => {
    let detailData;
    switch (type) {
      case 'terkirim':
        detailData = detailDataTerkirim;
        break;
      case 'proses':
        detailData = detailDataProses;
        break;
      case 'pending':
        detailData = detailDataPending;
        break;
      default:
        detailData = [];
    }
    setModalData(detailData);
    setModalTitle(`Detail ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <section className='px-2 lg:px-8 xl:px-4 pt-4 lg:pt-1'>
            <Header
              title={`Laporan Permintaan Update Data Bulan ${getMonthName(selectedMonth)} ${selectedYear}`}
              selectedMonth={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
              setSelectedMonth={handleMonthYearChange}
              getMonthName={getMonthName}
              availableMonths={availableMonths}
              lastUpdateTime={data?.lastUpdateTime}
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
            ) : hasData ? (
              <>
                <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 lg:mt-12'>
                  <Suspense fallback={<div className="text-center py-4">Loading Cards...</div>}>
                    {cards.map((card, index) => (
                      <div key={index} className={card.hasDetail ? "cursor-pointer" : ""} onClick={card.hasDetail ? () => openModal(card.detailType) : undefined}>
                        <Card {...card} className={card.hasDetail ? "hover:scale-105" : ""} />
                        {card.hasDetail && (
                          <div className="absolute inset-0 pointer-events-none"></div>
                        )}
                      </div>
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
                <Suspense fallback={<div>Loading Daily Requests Chart...</div>}>
                  <div className='mt-8 lg:mt-12'>
                    {<DailyRequestsLineChart data={data?.dailyRequests || {}} selectedMonth={selectedMonth} selectedYear={selectedYear} />}
                  </div>
                </Suspense>
              </>
            ) : (
              <div className="text-center py-8">No data available for the selected month</div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default React.memo(PermintaanUpdate);