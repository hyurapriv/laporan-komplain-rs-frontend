import React, { createContext, useContext, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useKomplainUnit from '../../hooks/komplain/useKomplainUnit';

const KomplainUnitContext = createContext();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const KomplainUnitProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  const komplainUnitData = useKomplainUnit();

  const handleMonthYearChange = (month, year) => {
    setError(null);
    try {
      komplainUnitData.updateMonthYear(month, year);
    } catch (err) {
      console.error('Error changing month/year:', err);
      setError('Failed to update month/year. Please try again.');
    }
  };

  const memoizedValue = useMemo(() => ({
    ...komplainUnitData,
    handleMonthYearChange,
    error,
  }), [komplainUnitData, error]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <KomplainUnitContext.Provider value={memoizedValue}>
        {children}
      </KomplainUnitContext.Provider>
    </QueryClientProvider>
  );
};

export const useKomplainUnitContext = () => {
  const context = useContext(KomplainUnitContext);
  if (context === undefined) {
    throw new Error('useKomplainUnitContext must be used within a KomplainUnitProvider');
  }
  return context;
};