import React, { createContext, useContext, useMemo } from 'react';
import useKomplainData from '../hooks/useKomplainData';

const KomplainContext = createContext();

export const KomplainProvider = ({ children }) => {
  const komplainData = useKomplainData();
  const memoizedValue = useMemo(() => komplainData, [komplainData]);
  
  return (
    <KomplainContext.Provider value={memoizedValue}>
      {children}
    </KomplainContext.Provider>
  );
};

export const useKomplainContext = () => {
  const context = useContext(KomplainContext);
  if (context === undefined) {
    throw new Error('useKomplainContext must be used within a KomplainProvider');
  }
  return context;
};