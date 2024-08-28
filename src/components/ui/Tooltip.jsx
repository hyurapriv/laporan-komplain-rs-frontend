// Tooltip.js
import React from 'react';

const Tooltip = ({ message }) => {
  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mt-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg">
      {message}
    </div>
  );
};

export default Tooltip;
