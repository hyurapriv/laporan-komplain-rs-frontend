import React from 'react';

const Header = ({ title, selectedMonth, setSelectedMonth, getMonthName, availableMonths }) => {
  return (
    <div className='flex justify-between items-center'>
      <h3 className='text-2xl font-bold text-slate-800'>{title}</h3>
      <div className='flex gap-4'>
        {availableMonths && availableMonths.length > 0 ? (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='bg-white border border-slate-500 rounded-md p-2 text-center'
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {getMonthName(month)}
              </option>
            ))}
          </select>
        ) : (
          <div>No months available</div>
        )}
      </div>
    </div>
  );
};

export default Header;