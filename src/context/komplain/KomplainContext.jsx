import React, { useState, useMemo } from 'react';
import { useKomplainData } from '../../hooks/komplain/useKomplainData';

export const KomplainContext = React.createContext();

export const KomplainProvider = ({ children, initialData }) => {
  const [error, setError] = useState(null);

  const komplainData = useKomplainData(initialData);

  const handleMonthYearChange = (month, year) => {
    setError(null);
    try {
      komplainData.updateMonthYear(month, year);
    } catch (err) {
      console.error('Error changing month/year:', err);
      setError('Failed to update month/year. Please try again.');
    }
  };

  const memoizedValue = useMemo(() => ({
    ...komplainData,
    handleMonthYearChange,
    error,
  }), [komplainData, error]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <KomplainContext.Provider value={memoizedValue}>
      {children}
    </KomplainContext.Provider>
  );
};

export const useKomplainContext = () => {
  const context = React.useContext(KomplainContext);
  if (context === undefined) {
    throw new Error('useKomplainContext must be used within a KomplainProvider');
  }
  return context;
};
