import React from 'react';

export const Tables = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 ">
        <caption className="text-lg font-bold my-4">Tabel Kinerja Petugas</caption>
        <thead>
          <tr className="bg-light-green text-white">
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Jumlah Pengerjaan</th>
            {/* <th className="border px-4 py-2">Persentase Pengerjaan</th> */}
            <th className="border px-4 py-2">Kontribusi</th>
            {/* <th className="border px-4 py-2">Respon Time</th> */}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{row.nama}</td>
                <td className="border px-4 py-2">{row.jumlahPengerjaan}</td>
                {/* <td className="border px-4 py-2">{row.persentasePengerjaan}</td> */}
                <td className="border px-4 py-2">{row.kontribusi}</td>
                {/* <td className="border px-4 py-2">{row.responTime}</td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border px-4 py-2 text-center">
                Data belum tersedia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tables;
