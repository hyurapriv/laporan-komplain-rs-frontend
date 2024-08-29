import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const DataKomplain = lazy(() => import('./pages/Komplain'));
const DataKinerja = lazy(() => import('./pages/DataKinerja'));
const DataUnit = lazy(() => import('./pages/DataUnit'));
const PermintaanUpdate = lazy(() => import('./pages/PermintaanUpdate'));
const KinerjaPermintaanUpdate = lazy(() => import('./pages/KinerjaPermintaanUpdate'));

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<DataKomplain />} />
      <Route path="/data-unit" element={<DataUnit />} />
      <Route path="/data-kinerja" element={<DataKinerja />} />
      <Route path="/perubahan-data" element={<PermintaanUpdate />} />
      <Route path="/perubahan-data/data-kinerja" element={<KinerjaPermintaanUpdate />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;