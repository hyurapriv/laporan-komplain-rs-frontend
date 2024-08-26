import React, { useState } from 'react';

const Card = ({ name, icon, bgColor, value, hasDetail, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`relative flex flex-col items-center rounded-lg bg-white shadow-lg px-4 py-4 lg:py-6 w-full transition-transform transform ${
        hasDetail ? 'cursor-pointer hover:bg-gray-100 hover:scale-105' : ''
      }`}
      onClick={hasDetail ? onClick : undefined}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className='flex items-center space-x-2'>
        <div className={`flex items-center justify-center rounded-full p-2 w-9 h-9 ${bgColor}`}>
          {icon}
        </div>
        <div className='text-slate-800 font-bold text-base lg:text-xl'>{name}</div>
      </div>
      <div className='mt-4 text-base lg:text-xl font-bold text-slate-700'>{value}</div>
      {hasDetail && showTooltip && (
        <div className="tooltip tooltip-visible">
          Klik untuk melihat detail
        </div>
      )}
    </div>
  );
};

export default React.memo(Card);
