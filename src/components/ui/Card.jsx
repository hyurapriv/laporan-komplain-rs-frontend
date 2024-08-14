import React from 'react';

const Card = (({ name, icon, bgColor, value }) => (
  <div className='flex flex-col items-center rounded-lg bg-white shadow-lg px-4 py-4 lg:py-6 w-full'>
    <div className='flex items-center space-x-2'>
      <div className={`flex items-center justify-center rounded-full p-2 w-9 h-9 ${bgColor}`}>
        {icon}
      </div>
      <div className='text-slate-800 font-bold text-base lg:text-xl'>{name}</div>
    </div>
    <div className='mt-4 text-base lg:text-xl font-bold text-slate-700'>{value}</div>
  </div>
));

export default React.memo(Card);
