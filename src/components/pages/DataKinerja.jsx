import React, { useMemo } from 'react';
import { Tables } from '../ui/Tables';
import useDummyData from '../hooks/useDummyData';
import Header from '../layouts/Header';
import Loading from '../ui/Loading';

const DataKinerja = () => {
  const {
    dataKomplain,
    getMonthName,
    setSelectedMonth,
    loadingKomplain,
    errorKomplain,
  } = useDummyData();

  const totalComplaints = useMemo(() => {
    if (!dataKomplain || !dataKomplain.jumlahPetugas) return 0;
    return Object.values(dataKomplain.jumlahPetugas).reduce((acc, value) => acc + value, 0);
  }, [dataKomplain]);

  const tableData = useMemo(() => {
    if (!dataKomplain || !dataKomplain.jumlahPetugas) return [];
    return Object.entries(dataKomplain.jumlahPetugas).map(([name, total]) => ({
      nama: name,
      jumlahPengerjaan: total,
      kontribusi: ((total / totalComplaints) * 100).toFixed(2) + '%',
    }));
  }, [dataKomplain, totalComplaints]);

  if (loadingKomplain) {
    return <Loading />;
  }

  if (errorKomplain) return <div className="text-red-500">{errorKomplain.message}</div>;

  if (!dataKomplain) {
    return <div>No data available</div>;
  }

  return (
    <div className='px-4 flex-1 pt-1'>
      <Header
        title={`Laporan Komplain IT Bulan ${getMonthName(dataKomplain.selectedMonth)}`}
        selectedMonth={dataKomplain.selectedMonth}
        setSelectedMonth={setSelectedMonth}
        getMonthName={getMonthName}
        availableMonths={dataKomplain.availableMonths}
      />
      <h3 className='ml-1 mt-2 text-lg font-bold text-white'>
        <span className='bg-light-green py-2 px-3 rounded'>{`Total Komplain: ${totalComplaints}`}</span>
      </h3>
      <Tables data={tableData} />
    </div>
  );
};

export default DataKinerja;