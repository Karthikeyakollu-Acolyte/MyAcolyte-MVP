'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import light from '@/public/lightmode.svg'
import lightbg from '@/public/lightmodebg.svg'
import dark from '@/public/darkmode.svg'
import darkbg from '@/public/darkmodebg.svg'
import { useSettings } from '@/context/SettingsContext';

const ToggleButton = () => {
  const [isDark, setIsDark] = useState(false);
  const {setisDarkFilter} = useSettings()
  return (
    <div className="flex items-center justify-center" style={{zIndex:50}}>
      <div 
        className="relative w-[63px] h-[24.76px] rounded-full overflow-hidden"
      >
        {/* Background images */}
        <div className="absolute inset-0">
          <Image
            src={lightbg}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300
              ${isDark ? 'opacity-0' : 'opacity-100'}`}
          />
          <Image
            src={darkbg}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300
              ${isDark ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Toggle button */}
        <button
          onClick={() =>{ setisDarkFilter(!isDark); setIsDark(!isDark);}}
          className="relative w-full h-full"

        >
          <div
            className={`absolute w-[22px] h-[22px] rounded-full shadow-lg transform transition-transform duration-300 ease-in-out flex items-center justify-center
              ${isDark ? 'translate-x-10' : 'translate-x-1'}`}
          >
            <div className="relative w-full h-full bottom-2.5">
            <Image
                src={light}
                alt="Light mode"
                className={`absolute inset-0 w-full h-full transition-opacity duration-300
                  ${isDark ? 'opacity-0' : 'opacity-100'}`}
              />
              <Image
                src={dark}
                alt="Dark mode"
                className={`absolute inset-0 w-full h-full transition-opacity duration-300
                  ${isDark ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ToggleButton;