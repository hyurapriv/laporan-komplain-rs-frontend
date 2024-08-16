import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import { FaBars, FaTimes, FaTools, FaUpload } from 'react-icons/fa';
import { BsPersonWorkspace } from "react-icons/bs";
import { GiFirstAidKit } from "react-icons/gi";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      name: 'Data Komplain IT',
      icon: <FaTools />,
      path: '/',
      subMenu: [
        { name: 'Data Unit', path: '/data-unit' },
        { name: 'Data Kinerja', path: '/data-kinerja' }
      ]
    },
    {
      name: 'Permintaan Update Data IT',
      icon: <FaUpload />,
      path: '/perubahan-data',
      subMenu: [
        { name: 'Data Unit', path: '/perubahan-data/data-unit' },
        { name: 'Data Kinerja', path: '/perubahan-data/data-kinerja' }
      ]
    }
  ];

  return (
    <div className="navbar bg-white shadow-md fixed w-full z-50 lg:hidden">
      <div className="flex justify-between items-center p-4">
        <img src={Logo} alt="Logo" className="w-12 h-12" />
        <button
          onClick={toggleMenu}
          className="text-2xl text-gray-600 focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <div className={`transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        <nav className="flex flex-col p-4">
          {menuItems.map((item, index) => (
            <div key={index}>
              <div
                className={`flex items-center py-2 text-lg transition-colors duration-300 cursor-pointer ${
                  isActive(item.path) ? 'text-light-green' : 'text-gray-700'
                }`}
                onClick={() => item.subMenu && toggleDropdown(index)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
                {item.subMenu && (
                  <span className={`ml-auto ${activeDropdown === index ? 'rotate-180' : ''}`}>
                    <FaBars />
                  </span>
                )}
              </div>
              {item.subMenu && activeDropdown === index && (
                <div className="ml-4">
                  {item.subMenu.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`block py-1 text-lg transition-colors duration-300 ${
                        isActive(subItem.path) ? 'text-light-green' : 'text-gray-700'
                      }`}
                      onClick={toggleMenu}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
