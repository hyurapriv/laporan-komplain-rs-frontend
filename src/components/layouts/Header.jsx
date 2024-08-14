import React from 'react';

const Header = ({ title, selectedMonth, setSelectedMonth, getMonthName, availableMonths }) => {
  return (
    <div className='flex flex-wrap justify-between items-center gap-4'>
      <h3 className='lg:text-2xl text-sm font-bold text-slate-800 break-words'>
        {title}
      </h3>
      <div className='flex gap-4'>
        {availableMonths && availableMonths.length > 0 ? (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='bg-white border border-slate-500 rounded-md p-1 lg:p-2 text-center'
          >
            {availableMonths.map((month) => (
              <option className='lg:text-base text-sm' key={month} value={month}>
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
