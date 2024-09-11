import React, { memo, useMemo, useCallback } from 'react';
import { useKomplainContext } from '../context/komplain/KomplainContext';
import { useKomplainUnitContext } from '../context/komplain/KomplainUnitContext';

const Header = memo(({ title, lastUpdateTime, contextType }) => {
  const komplainContext = useKomplainContext();
  const komplainUnitContext = useKomplainUnitContext();

  const context = contextType === 'komplainUnit' ? komplainUnitContext : komplainContext;

  const {
    bulanData,
    selectedMonth,
    selectedYear,
    updateMonthYear,
    isLoading
  } = context;

  const getMonthName = useCallback((month) => {
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleString('default', { month: 'long' });
  }, []);

  const monthOptions = useMemo(() => {
    const availableMonths = bulanData?.data_bulan || [];
    return availableMonths.map(month => ({
      value: month.value,
      label: getMonthName(parseInt(month.value, 10)),
    })).filter(option => option.value !== undefined);
  }, [bulanData, getMonthName]);

  const yearOptions = useMemo(() => {
    const availableYears = bulanData?.data_tahun || [];
    return availableYears.map(year => ({
      value: year.value,
      label: year.label,
    })).filter(option => option.value !== undefined);
  }, [bulanData]);

  const handleMonthChange = useCallback((e) => {
    updateMonthYear(e.target.value, selectedYear);
  }, [updateMonthYear, selectedYear]);

  const handleYearChange = useCallback((e) => {
    updateMonthYear(selectedMonth, e.target.value);
  }, [updateMonthYear, selectedMonth]);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        <h3 className='lg:text-2xl text-sm font-bold text-slate-800 break-words'>
          {title}
        </h3>
        <div className='flex gap-4'>
          <select
            value={selectedYear || ''}
            onChange={handleYearChange}
            className='bg-white border border-slate-500 rounded-md p-1 lg:p-2 text-center'
            aria-label="Select year"
            disabled={isLoading}
          >
            {yearOptions.map(option => (
              <option
                className='lg:text-base text-sm'
                key={`year-${option.value}`}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth || ''}
            onChange={handleMonthChange}
            className='bg-white border border-slate-500 rounded-md p-1 lg:p-2 text-center'
            aria-label="Select month"
            disabled={isLoading}
          >
            {monthOptions.map(option => (
              <option
                className='lg:text-base text-sm'
                key={`month-${option.value}`}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {lastUpdateTime && (
        <div className="text-sm text-slate-500">
          Last updated: {new Date(lastUpdateTime).toLocaleString()}
        </div>
      )}
    </div>
  );
});

export default Header;