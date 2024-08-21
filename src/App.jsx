import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layouts/Sidebar';
import Navbar from './components/layouts/Navbar'; // Import Navbar component
import DataKomplain from './components/pages/Komplain';
import DataKinerja from './components/pages/DataKinerja';
import DataUnit from './components/pages/DataUnit';
import PermintaanUpdate from './components/pages/PermintaanUpdate';
import KinerjaPermintaanUpdate from './components/pages/KinerjaPermintaanUpdate';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar /> {/* Menampilkan Navbar */}
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
          <main 
            className={`flex-1 bg-soft-green transition-all duration-300 ease-in-out ${
              !isMobile && !isTablet && (collapsed ? 'ml-16' : 'ml-64')
            }`}
          >
            <div className="container mx-auto px-6 py-8 h-full overflow-y-auto">
              <Routes>
                <Route path="/" element={<DataKomplain />} />
                <Route path="/data-unit" element={<DataUnit />} />
                <Route path="/data-kinerja" element={<DataKinerja />} />
                <Route path="/perubahan-data" element={<PermintaanUpdate />} />
                <Route path="/perubahan-data/data-kinerja" element={<KinerjaPermintaanUpdate />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
