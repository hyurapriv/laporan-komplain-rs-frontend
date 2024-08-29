import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import useResponsive from './components/hooks/useResponsive';

const Sidebar = lazy(() => import('./components/layouts/Sidebar'));
const Navbar = lazy(() => import('./components/layouts/Navbar'));
const DataKomplain = lazy(() => import('./components/pages/Komplain'));
const DataKinerja = lazy(() => import('./components/pages/DataKinerja'));
const DataUnit = lazy(() => import('./components/pages/DataUnit'));
const PermintaanUpdate = lazy(() => import('./components/pages/PermintaanUpdate'));
const KinerjaPermintaanUpdate = lazy(() => import('./components/pages/KinerjaPermintaanUpdate'));

const ErrorFallback = ({ error }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{ color: 'red' }}>{error.message}</pre>
  </div>
);

function App() {
  const { isMobile, isTablet, collapsed, setCollapsed } = useResponsive();

  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="flex flex-col h-screen overflow-hidden">
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
          </Suspense>
          <div className="flex flex-1 overflow-hidden">
            {!isMobile && (
              <Suspense fallback={<div>Loading...</div>}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
              </Suspense>
            )}
            <main 
              className={`flex-1 bg-soft-green transition-all duration-300 ease-in-out ${
                !isMobile && !isTablet && (collapsed ? 'ml-16' : 'ml-64')
              }`}
            >
              <div className="container mx-auto px-6 py-8 h-full overflow-y-auto">
                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<DataKomplain />} />
                    <Route path="/data-unit" element={<DataUnit />} />
                    <Route path="/data-kinerja" element={<DataKinerja />} />
                    <Route path="/perubahan-data" element={<PermintaanUpdate />} />
                    <Route path="/perubahan-data/data-kinerja" element={<KinerjaPermintaanUpdate />} />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;