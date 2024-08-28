import React from 'react';

const Card = ({ name, icon, bgColor, value, hasDetail, onClick, tooltipText }) => (
  <div
    className={`relative flex flex-col items-center rounded-lg bg-white shadow-lg px-4 py-4 lg:py-6 w-full transition-transform transform ${
      hasDetail ? 'cursor-pointer hover:bg-gray-100 hover:scale-105' : ''
    }`}
    onClick={hasDetail ? onClick : undefined}
  >
    <div className='flex items-center space-x-2'>
      <div className={`flex items-center justify-center rounded-full p-2 w-9 h-9 ${bgColor}`}>
        {icon}
      </div>
      <div className='text-slate-800 font-bold text-base lg:text-xl'>{name}</div>
    </div>
    <div className='mt-4 text-base lg:text-xl font-bold text-slate-700'>{value}</div>

    {/* Tooltip */}
    {tooltipText && (
      <div className="tooltip opacity-0 transition-opacity duration-300 absolute left-1/2 transform -translate-x-1/2 -translate-y-full p-2 text-white text-sm bg-black bg-opacity-70 rounded-lg shadow-lg z-10">
        {tooltipText}
        {/* Tooltip arrow */}
        <div className="tooltip-arrow"></div>
      </div>
    )}
  </div>
);

export default React.memo(Card);
