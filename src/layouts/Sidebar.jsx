import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { FaChartSimple, FaScrewdriverWrench } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdDoubleArrow, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { GiFirstAidKit } from "react-icons/gi";
import { FaFileUpload } from "react-icons/fa";


export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(localStorage.getItem('openMenu') || '');

  useEffect(() => {
    localStorage.setItem('openMenu', openMenu);
  }, [openMenu]);

  const mainMenuItems = [
    { name: 'Dashboard', icon: <FaChartSimple />, path: '/' },
    { name: 'Data Komplain IT', icon: <FaScrewdriverWrench />, path: '/komplain' },
    {
      name: ['Permintaan', 'Update Data IT'],
      icon: <FaFileUpload />,
      path: '/permintaan-update',
      isTwoLines: true
    }
  ];

  const subMenuItems = {
    '/komplain': [
      { name: 'Data Unit', icon: <GiFirstAidKit />, path: '/komplain/data-unit' },
      { name: 'Data Kinerja', icon: <BsPersonWorkspace />, path: '/komplain/data-kinerja' },
    ],
    '/permintaan-update': [
      { name: 'Data Kinerja', icon: <BsPersonWorkspace />, path: '/permintaan-update/data-kinerja' },
    ]
  };

  const isActive = (path) => location.pathname === path;

  const renderMenuItemContent = (menuItem) => (
    <>
      <div className={`flex-shrink-0 ${collapsed ? 'mr-0' : 'mr-3'} transition-all duration-300 ease-in-out`}>
        {menuItem.icon}
      </div>
      {!collapsed && (
        menuItem.isTwoLines ? (
          <div className="flex flex-col leading-tight">
            <span className="text-sm">{menuItem.name[0]}</span>
            <span className="text-sm">{menuItem.name[1]}</span>
          </div>
        ) : (
          <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {menuItem.name}
          </span>
        )
      )}
    </>
  );

  return (
    <div className={`fixed top-0 bottom-0 left-0 bg-white border-r border-gray-200 transition-all duration-400 ease-in-out ${collapsed ? 'w-16' : 'w-64'} sidebar`}>
      <div className='flex justify-end items-center mt-4'>
        <button
          className={`p-2 text-white text-lg font-bold bg-light-green rounded-md mr-1 transition-transform duration-400 ease-in-out ${collapsed ? 'mr-4' : 'opacity-100 scale-100'}`}
          onClick={() => {
            setCollapsed(!collapsed);
            document.body.classList.toggle('sidebar-collapsed');
          }}
        >
          <MdDoubleArrow className={`transform ${collapsed ? 'rotate-0' : 'rotate-180'} transition-transform duration-300 ease-in-out`} />
        </button>
      </div>
      <div className='flex justify-center items-center py-4 h-40 w-full mt-24'>
        <div className={`relative p-8 border-2 border-gray-200 duration-400 ease-in-out ${collapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
          <img src={Logo} className={`w-40 transition-all duration-400 ease-in-out  ${collapsed ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`} alt="Logo" />
        </div>
      </div>
      <nav className='mt-20'>
        {mainMenuItems.map((menuItem, index) => (
          <div key={index} className='mb-1'>
            <div className={`flex items-center w-full font-medium transition-all duration-400 ease-in-out
              ${isActive(menuItem.path) ? 'bg-light-green text-white' : 'text-gray-600 hover:bg-gray-100'}
              ${collapsed ? 'justify-center' : ''}`}>
              <Link
                to={menuItem.path}
                className={`flex items-center w-full px-4 py-3 ${menuItem.isTwoLines ? 'h-16' : 'h-12'}`}
                onClick={() => {
                  setOpenMenu(openMenu === menuItem.path ? '' : menuItem.path);
                }}
              >
                {renderMenuItemContent(menuItem)}
              </Link>
              {!collapsed && menuItem.path === location.pathname && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenu(openMenu === menuItem.path ? '' : menuItem.path);
                  }}
                  className="p-3 text-current hover:bg-transparent transition-colors duration-300 ease-in-out"
                >
                  {openMenu === menuItem.path ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </button>
              )}
            </div>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenu === menuItem.path ? 'max-h-40' : 'max-h-0'}`}>
              {subMenuItems[menuItem.path]?.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center px-8 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-300 ease-in-out ${isActive(item.path) ? 'bg-light-green text-white' : ''}`}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-2 text-sm">{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
