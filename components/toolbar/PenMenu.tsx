"use client"
import React, { useEffect, useState } from 'react';
import { Slider } from "@/components/ui/slider";
import stroke from "@/public/stroke.svg"
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';

const StrokeWidthIcon = () => (
  <Image alt="stroke" src={stroke}/>
);

const PenMenu = () => {
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [opacity, setOpacity] = useState(75);
  const {activeTool, setActiveTool} = useSettings();

  // Handle stroke width change
  const onStrokeChange = (value: number[]) => {
    setStrokeWidth(value[0]);
    // If you need to update this in a parent component or context, 
    // you can add that logic here
    setActiveTool((prevTool) => ({...prevTool, strokeWidth: value[0]}));
  };


  useEffect(()=>{
    console.log(activeTool)
  },[activeTool])
  // Handle opacity change
  const onOpacityChange = (value: number[]) => {
    setOpacity(value[0]);
    setActiveTool((prevTool) => ({...prevTool, opacity: value[0]}));
  
  };

  return (
    <div className="bg-white rounded-full py-1.5 px-3 flex items-center gap-4 w-64 relative">
      {/* Stroke Width */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-700 text-xs">Stroke</span>
        <div className="bg-gray-100 rounded px-1.5 py-0.5 flex items-center gap-0.5">
          {StrokeWidthIcon()}
          <span className="text-gray-700 text-xs font-medium">{strokeWidth}</span>
        </div>
        <div className="w-20">
          <Slider
            value={[strokeWidth]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => onStrokeChange(value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-gray-200"/>

      {/* Opacity */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-gray-700 text-xs">Opacity</span>
        <div className="flex-1">
          <Slider
            value={[opacity]}
            max={100}
            step={1}
            onValueChange={(value) => onOpacityChange(value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PenMenu;