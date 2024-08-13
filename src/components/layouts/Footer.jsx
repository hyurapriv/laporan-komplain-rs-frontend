// src/layouts/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className=" text-gray-900 text-xs font-semibold py-2 text-center mt-14 bottom-0 w-full">
      <p>&copy; {new Date().getFullYear()} RSUD Daha Husada Kediri. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
