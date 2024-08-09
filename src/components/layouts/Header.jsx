import React from 'react';

const Header = ({ title, selectedMonth, setSelectedMonth, getMonthName, availableMonths }) => {
  const formatMonth = (yearMonth) => {
    if (!yearMonth) return 'N/A';
    const [year, month] = yearMonth.split('-');
    const date = new Date(year, parseInt(month, 10) - 1);
    return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  };

  if (!availableMonths || availableMonths.length === 0) return <div>Loading...</div>;

  return (
    <div className='flex justify-between items-center'>
      <h3 className='text-2xl font-bold text-slate-800'>{title}</h3>
      <div className='flex gap-4'>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className='bg-white border border-slate-500 rounded-md p-2 text-center'
        >
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {formatMonth(month)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Header;
