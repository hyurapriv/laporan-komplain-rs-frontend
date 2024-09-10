import React, { lazy, Suspense, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import useResponsive from './hooks/useResponsive';
import { KomplainProvider } from './context/KomplainContext';


const Sidebar = lazy(() => import('./layouts/Sidebar'));
const Navbar = lazy(() => import('./layouts/Navbar'));

const routes = [
  { path: '/', component: lazy(() => import('./pages/Dashboard')) },
  { path: '/komplain', component: lazy(() => import('./pages/Komplain')) },
  { path: '/komplain/data-unit', component: lazy(() => import('./pages/DataUnit')) },
  { path: '/komplain/data-kinerja', component: lazy(() => import('./pages/DataKinerja')) },
  { path: '/permintaan-update', component: lazy(() => import('./pages/PermintaanUpdate')) },
  { path: '/permintaan-update/data-kinerja', component: lazy(() => import('./pages/KinerjaPermintaanUpdate')) },
];

const ErrorFallback = ({ error }) => (
  <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong</h2>
    <p className="mb-2">We're sorry, but an error occurred. Please try refreshing the page or contact support if the problem persists.</p>
    <details className="whitespace-pre-wrap">
      <summary>Error details</summary>
      {error.message}
    </details>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { isMobile, isTablet, collapsed, setCollapsed } = useResponsive();

  const layoutStyle = useMemo(() => ({
    marginLeft: !isMobile && !isTablet ? (collapsed ? '4rem' : '16rem') : '0',
  }), [isMobile, isTablet, collapsed]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <KomplainProvider>
            <div className="flex flex-col h-screen overflow-x-hidden">
              <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse" />}>
                <Navbar />
              </Suspense>
              <div className="flex flex-1">
                {!isMobile && (
                  <Suspense fallback={<div className="w-16 bg-gray-100 animate-pulse" />}>
                    <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                  </Suspense>
                )}
                <main
                  className="flex-1 bg-soft-green transition-all duration-300 ease-in-out overflow-y-auto"
                  style={layoutStyle}
                >
                  <div className="container mx-auto px-4 py-6">
                    <Suspense fallback={<div className="h-64 bg-white rounded shadow animate-pulse" />}>
                      <Routes>
                        {routes.map(({ path, component: Component }) => (
                          <Route key={path} path={path} element={<Component />} />
                        ))}
                      </Routes>
                    </Suspense>
                  </div>
                </main>
              </div>
            </div>
          </KomplainProvider>
        </ErrorBoundary>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;