import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layouts/Sidebar';
import DataKomplain from './components/pages/Komplain';
import DataKinerja from './components/pages/DataKinerja';
import DataUnit from './components/pages/DataUnit';
import PerubahanData from './components/pages/PerubahanData';
import DataUnitPerubahan from './components/pages/DataUnitPerubahan';
import DataKinerjaPerubahan from './components/pages/DataKinerjaPerubahan';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main 
          className={`flex-1 bg-soft-green transition-all duration-300 ease-in-out ${
            collapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          <div className="container mx-auto px-6 py-8 h-full overflow-y-auto">
            <Routes>
              <Route path="/" element={<DataKomplain />} />
              <Route path="/data-unit" element={<DataUnit />} />
              <Route path="/data-kinerja" element={<DataKinerja />} />
              <Route path="/perubahan-data" element={<PerubahanData />} />
              <Route path="/perubahan-data/data-unit" element={<DataUnitPerubahan />} />
              <Route path="/perubahan-data/data-kinerja" element={<DataKinerjaPerubahan />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
