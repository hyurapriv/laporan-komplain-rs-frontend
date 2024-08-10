import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { FaChartSimple } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdDoubleArrow, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { GiFirstAidKit } from "react-icons/gi";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const mainMenuItem = { name: 'Data Komplain', icon: <FaChartSimple />, path: '/' };
  const subMenuItems = [
    { name: 'Data Unit', icon: <GiFirstAidKit />, path: '/data-unit' },
    { name: 'Data Kinerja', icon: <BsPersonWorkspace />, path: '/data-kinerja' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`fixed top-0 bottom-0 left-0 bg-white border-r border-gray-200 transition-all duration-400 ease-in-out ${collapsed ? 'w-16' : 'w-64'} sidebar`}>
      <div className='flex justify-end items-center mt-5'>
        <button
          className="p-2 text-white text-xl font-bold bg-light-green rounded-md mr-1 transition-transform duration-400 ease-in-out"
          onClick={() => {
            setCollapsed(!collapsed);
            document.body.classList.toggle('sidebar-collapsed');
          }}
        >
          <MdDoubleArrow style={{
            transform: collapsed ? 'rotate(0)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease-in-out',
          }} />
        </button>
      </div>
      <div className='flex justify-center items-center py-6 h-32 w-full mt-10 overflow-hidden'>
        <img src={Logo} className={`w-36 transition-all duration-400 ease-in-out ${collapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} alt="Logo" />
      </div>
      <nav className='mt-20'>
        <div className='mb-2'>
          <div className={`flex items-center w-full font-semibold transition-all duration-400 ease-in-out
            ${isActive(mainMenuItem.path) ? 'bg-light-green text-white' : 'text-gray-600 hover:bg-gray-100'}
            ${collapsed ? 'justify-center' : ''}`}>
            <Link
              to={mainMenuItem.path}
              className="flex items-center w-full px-4 py-3"
            >
              <div className={`${collapsed ? 'mr-0' : 'mr-3'} transition-all duration-300 ease-in-out`}>{mainMenuItem.icon}</div>
              <span className={`transition-all duration-400 ease-in-out ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                {mainMenuItem.name}
              </span>
            </Link>
            {!collapsed && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(!menuOpen);
                }}
                className="p-3 text-current hover:bg-transparent transition-colors duration-300 ease-in-out"
              >
                {menuOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
              </button>
            )}
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
          {subMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center w-full px-4 py-3 font-semibold transition-all duration-300 ease-in-out
                ${isActive(item.path) ? 'bg-light-green text-white' : 'text-gray-600 hover:bg-gray-100'}
                ${collapsed ? 'justify-center' : ''}`}
            >
              <div className={`${collapsed ? 'mr-0' : 'mr-3'} transition-all duration-300 ease-in-out`}>{item.icon}</div>
              <span className={`transition-all duration-300 ease-in-out ${collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}