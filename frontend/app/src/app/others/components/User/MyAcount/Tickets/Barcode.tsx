'use client';

import React from 'react';

const lexendSmall = { className: "font-normal text-sm" };

interface BarcodeProps {
  code: string;
}

const Barcode: React.FC<BarcodeProps> = ({ code }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-2">
      <div className="flex flex-col justify-between h-44 w-8">
        {[...Array(32).keys()].map((k) => (
          <div
            key={k}
            className={`bg-black ${k % 2 === 0 ? 'h-2' : 'h-3'} w-full my-[1px]`}
            style={{
              opacity: k % 7 === 0 ? 0.6 : 1,
              borderRadius: '2px',
            }}
          />
        ))}
      </div>
      {/* <div className={`${lexendSmall.className} text-[10px] font-mono text-gray-600 mt-2 tracking-widest text-center`}>
        {code.slice(-8)}
      </div> */}
    </div>
  );
};

export default Barcode;
