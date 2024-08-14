// src/layouts/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className=" text-gray-900 text-xs font-semibold py-2 text-center mt-14 bottom-0 w-full">
      <p>&copy; {new Date().getFullYear()} IT RSUD Daha Husada Kediri & <span className='underline'><a href="https://smkkbw.sch.id/web.php?smk=pn" target='_blank'>SMK TI Pelita Nusantara Kediri</a></span>. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
