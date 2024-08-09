import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layouts/Sidebar';
import DataKomplain from './components/pages/DataKomplain';
import DataKinerja from './components/pages/DataKinerja';
import UnitIGD from './components/pages/IGD';
import RawatJalan from './components/pages/RawatJalan';
import RawatInap from './components/pages/RawatInap';
import PenunjangMedis from './components/pages/PenunjangMedis';
import PenunjangNonMedis from './components/pages/PenunjangNonMedis';
import IBS from './components/pages/IBS';

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
              <Route path="/igd" element={<UnitIGD />} />
              <Route path="/rawat-jalan" element={<RawatJalan />} />
              <Route path="/rawat-inap" element={<RawatInap />} />
              <Route path="/penunjang-medis" element={<PenunjangMedis />} />
              <Route path="/penunjang-nonmedis" element={<PenunjangNonMedis />} />
              <Route path="/ibs" element={<IBS />} />
              <Route path="/data-kinerja" element={<DataKinerja />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
