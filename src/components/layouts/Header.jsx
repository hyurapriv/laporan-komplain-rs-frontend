import React from 'react';

const Header = ({ title, selectedMonth, setSelectedMonth, getMonthName, availableMonths, lastUpdateTime }) => {
  console.log("Header - Available Months:", availableMonths);
  console.log("Header - Selected Month:", selectedMonth);

  // Function to generate month-year options for the dropdown based on availableMonths
  const generateMonthYearOptions = () => {
    return availableMonths.map(monthYear => {
      const [year, month] = monthYear.split('-');
      return {
        value: monthYear,
        label: `${getMonthName(parseInt(month, 10))} ${year}`
      };
    });
  };

  const options = generateMonthYearOptions();
  console.log("Generated options:", options);

  // Function to calculate time difference
  const getTimeDifference = () => {
    if (!lastUpdateTime) return null;
    const now = new Date();
    const lastUpdate = new Date(lastUpdateTime);
    const diffInMinutes = Math.round((now - lastUpdate) / (1000 * 60));
    return diffInMinutes;
  };

  const timeDifference = getTimeDifference();

  return (
    <div className='flex flex-col gap-2'>
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
              aria-label="Select month and year"
            >
              {options.map(option => (
                <option className='lg:text-base text-sm' key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-slate-500">No months available</div>
          )}
        </div>
      </div>
      {timeDifference !== null && (
        <p className='text-sm text-slate-600'>
          Data terakhir masuk sekitar {timeDifference} menit yang lalu
        </p>
      )}
    </div>
  );
};

export default Header;
