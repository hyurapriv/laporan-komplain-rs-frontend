import React, { createContext, useContext, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useKomplainPetugas from '../../hooks/komplain/useKomplainPetugas';

const KomplainPetugasContext = createContext();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const KomplainPetugasProvider = ({ children }) => {
  const [error, setError] = useState(null);
  
  const komplainPetugasData = useKomplainPetugas();

  const handleMonthYearChange = (month, year) => {
    setError(null);
    try {
      komplainPetugasData.updateMonthYear(month, year);
    } catch (err) {
      console.error('Error changing month/year:', err);
      setError('Failed to update month/year. Please try again.');
    }
  };

  const memoizedValue = useMemo(() => ({
    ...komplainPetugasData,
    handleMonthYearChange,
    error,
  }), [komplainPetugasData, error]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <KomplainPetugasContext.Provider value={memoizedValue}>
        {children}
      </KomplainPetugasContext.Provider>
    </QueryClientProvider>
  );
};

export const useKomplainPetugasContext = () => {
  const context = useContext(KomplainPetugasContext);
  if (context === undefined) {
    throw new Error('useKomplainPetugasContext must be used within a KomplainPetugasProvider');
  }
  return context;
};