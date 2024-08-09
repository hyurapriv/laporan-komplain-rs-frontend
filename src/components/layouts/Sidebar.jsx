import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { FaClinicMedical, FaArrowRight, FaArrowLeft, FaFileMedicalAlt } from "react-icons/fa";
import { FaNotesMedical, FaChartSimple, FaTruckMedical } from "react-icons/fa6";
import { BsPersonWorkspace, BsFillFileMedicalFill} from "react-icons/bs";
import { GiFirstAidKit } from "react-icons/gi";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const menu = [
    { name: 'Data Komplain', icon: <FaChartSimple />, path: '/' },
    { name: 'IGD', icon: <FaTruckMedical />, path: '/igd' },
    { name: 'Rawat Jalan', icon: <GiFirstAidKit />, path: '/rawat-jalan' },
    { name: 'Rawat Inap', icon: <FaClinicMedical />, path: '/rawat-inap' },
    { name: 'Penunjang Medis', icon: <FaNotesMedical />, path: '/penunjang-medis' },
    { name: 'Penunjang Non-Medis', icon: <BsFillFileMedicalFill />, path: '/penunjang-nonmedis' },
    { name: 'IBS', icon: <FaFileMedicalAlt />, path: '/ibs' },
    { name: 'Data Kinerja', icon: <BsPersonWorkspace />, path: '/data-kinerja' },
  ];

  return (
    <div className={`fixed top-0 bottom-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-64'} sidebar`}>
      <div className='flex justify-end items-center mt-5'>
        <button
          className="p-2 text-white text-lg font-bold bg-light-green rounded-md mr-2 transition-transform duration-300 ease-in-out"
          onClick={() => {
            setCollapsed(!collapsed);
            document.body.classList.toggle('sidebar-collapsed');
          }}
        >
          {collapsed ? <FaArrowRight /> : <FaArrowLeft />}
        </button>
      </div>
      <div className='flex justify-center items-center py-6 h-32 w-full mt-10 overflow-hidden'>
        <img src={Logo} className={`w-36 transition-all duration-300 ease-in-out ${collapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} alt="Logo" />
      </div>
      <nav className='mt-20'>
        <ul>
          {menu.map((item, index) => (
            <li key={index} className='mb-4'>
              <Link
                to={item.path}
                className={`flex items-center w-full px-4 py-3 text-gray-600 font-semibold transition-all duration-300 ease-in-out
                  ${location.pathname === item.path ? 'bg-light-green text-white' : 'hover:bg-gray-100'}
                  ${collapsed ? 'justify-center' : ''}`}
              >
                <div className={`${collapsed ? 'mr-0' : 'mr-3'} transition-all duration-300 ease-in-out`}>{item.icon}</div>
                <span className={`transition-all duration-300 ease-in-out ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
