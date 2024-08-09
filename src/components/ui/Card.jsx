import React from 'react';

const Card = React.memo(({ name, icon, bgColor, value }) => (
  <div className='flex flex-col items-center rounded-lg bg-white shadow-lg px-4 py-6 w-full'>
    <div className='flex items-center space-x-2'>
      <div className={`flex items-center justify-center rounded-full p-2 w-9 h-9 ${bgColor}`}>
        {icon}
      </div>
      <div className='text-slate-800 font-bold text-xl'>{name}</div>
    </div>
    <div className='mt-4 text-xl font-bold text-slate-700'>{value}</div>
  </div>
));

export default Card;