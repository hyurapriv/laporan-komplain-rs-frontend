import React from 'react';
import { Tables } from '../ui/Tables';
import useDummyData from '../hooks/useDummyData';
import Header from '../layouts/Header';
import Loading from '../ui/Loading';

const DataKinerja = () => {
  const { dataKomplain, getMonthName, setSelectedMonth, loading, error } = useDummyData();

  // Calculate total complaints to compute contribution
  const totalComplaints = Object.values(dataKomplain.jumlahPetugas).reduce((acc, value) => acc + value, 0);

  const tableData = Object.entries(dataKomplain.jumlahPetugas).map(([name, total]) => ({
    nama: name,
    jumlahPengerjaan: total,
    kontribusi: ((total / totalComplaints) * 100).toFixed(2) + '%',
  }));

  if (loading) {
    return <Loading />;
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <Header
        title={`Data Komplain IT Bulan ${getMonthName(dataKomplain.selectedMonth)}`}
        selectedMonth={dataKomplain.selectedMonth}
        setSelectedMonth={setSelectedMonth}
        getMonthName={getMonthName}
        availableMonths={dataKomplain.availableMonths} // Pass available months
      />
      <Tables data={tableData} />
    </div>
  );
};

export default DataKinerja;
