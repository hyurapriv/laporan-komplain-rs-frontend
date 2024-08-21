import React from 'react';

const Header = ({
  title,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  getMonthName,
  availableMonths
}) => {
  const generateMonthYearOptions = () => {
    const sortedMonths = [...availableMonths].sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return yearB - yearA || monthB - monthA;
    });

    return sortedMonths.map(monthYear => {
      const [year, month] = monthYear.split('-');
      return {
        value: monthYear,
        label: `${getMonthName(parseInt(month, 10))} ${year}`
      };
    });
  };

  const options = generateMonthYearOptions();

  const handleChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedYear(parseInt(year, 10));
    setSelectedMonth(parseInt(month, 10));
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        <h3 className='lg:text-2xl text-sm font-bold text-slate-800 break-words'>
          {title}
        </h3>
        <div className='flex gap-4'>
          {availableMonths && availableMonths.length > 0 ? (
            <select
              value={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
              onChange={handleChange}
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
    </div>
  );
};

export default Header;
