import React, { createContext, useContext, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useKomplainData from '../hooks/useKomplainData';

const KomplainContext = createContext();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const KomplainProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  const komplainData = useKomplainData();

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
    <QueryClientProvider client={queryClient}>
      <KomplainContext.Provider value={memoizedValue}>
        {children}
      </KomplainContext.Provider>
    </QueryClientProvider>
  );
};

export const useKomplainContext = () => {
  const context = useContext(KomplainContext);
  if (context === undefined) {
    throw new Error('useKomplainContext must be used within a KomplainProvider');
  }
  return context;
};