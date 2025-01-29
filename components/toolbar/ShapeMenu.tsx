"use clinet"
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from './TextMenu';
import stroke from "@/public/stroke.svg"
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';

const StrokeWidthIcon = () => (
  <Image alt="stroke" src={stroke}/>
);

const ShapeMenu = () => {
  // State management
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [opacity, setOpacity] = useState(100);
  const {activeTool, setActiveTool} = useSettings();


  // Text constants
  const strokeText = "Stroke";
  const fillText = "Fill";
  const opacityText = "Opacity";

  // Handler functions
  const onStrokeColorChange = (color) => {
    setStrokeColor(color);
    // Add any additional logic here
    setActiveTool((prevTool) => ({...prevTool, strokeColor: color}));
  };

  const onFillColorChange = (color) => {
    setFillColor(color);
    // Add any additional logic here
    setActiveTool((prevTool) => ({...prevTool, fillColor: color}));
  };

  const onStrokeWidthChange = (width) => {
    setStrokeWidth(width);
    // Add any additional logic here
    setActiveTool((prevTool) => ({...prevTool, strokeWidth: width}));
  };

  const onOpacityChange = (value) => {
    setOpacity(value);
    // Add any additional logic here
    setActiveTool((prevTool) => ({...prevTool, opacity:value }));

  };

  return (
    <div className="bg-white rounded-full shadow-lg py-1.5 px-3 flex items-center gap-3 w-[500px] relative">
      {/* Stroke */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-700 text-xs font-medium">{strokeText}</span>
        <ColorPicker 
          onChange={onStrokeColorChange}
        />
      </div>

      <div className="h-6 w-px bg-gray-300"/>

      {/* Fill */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-700 text-xs font-medium">{fillText}</span>
        <ColorPicker 
          onChange={onFillColorChange}
        />
      </div>

      <div className="h-6 w-px bg-gray-300"/>

      {/* Stroke Width */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-700 text-xs font-medium">{strokeText}</span>
        <div className="bg-gray-100 rounded-lg px-2 py-0.5 flex items-center gap-1.5">
          <StrokeWidthIcon />
          <span className="text-gray-700 text-xs">{strokeWidth}</span>
        </div>
      </div>

      <div className="h-6 w-px bg-gray-300"/>

      {/* Opacity */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-gray-700 text-xs font-medium whitespace-nowrap">{opacityText}</span>
        <div className="flex-1 px-2 min-w-0">
          <Slider
            value={[opacity]}
            max={100}
            step={1}
            onValueChange={(value) => onOpacityChange(value[0])}
            className="w-full"
          />
        </div>
        <span className="text-gray-700 text-xs whitespace-nowrap">{opacity}%</span>
      </div>
      {/* <div className="absolute w-3 h-3 bg-white rotate-45 -bottom-1.5 right-8 shadow-xl"/> */}
    </div>
  );
};

export default ShapeMenu;