import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const StrokeWidthIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18"/>
  </svg>
);

const ShapeMenu = () => {
  const [strokeColor, setStrokeColor] = useState('#FF5733');
  const [fillColor, setFillColor] = useState('#33FF57');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [opacity, setOpacity] = useState(100);

  return (
    <div className="bg-white rounded-full shadow-lg py-1.5 px-3 flex items-center gap-3 w-[420px]">
      {/* Stroke */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-700 text-xs font-medium">Stroke</span>
        <div className="relative inline-block">
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-6 h-6 opacity-0 absolute cursor-pointer"
          />
          <div 
            className="w-6 h-6 rounded-full cursor-pointer border border-gray-200"
            style={{ backgroundColor: strokeColor }}
          />
        </div>
      </div>

      <div className="h-6 w-px bg-gray-300"/>

      {/* Fill */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-700 text-xs font-medium">Fill</span>
        <div className="relative inline-block">
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="w-6 h-6 opacity-0 absolute cursor-pointer"
          />
          <div 
            className="w-6 h-6 rounded-full cursor-pointer border border-gray-200"
            style={{ backgroundColor: fillColor }}
          />
        </div>
      </div>

      <div className="h-6 w-px bg-gray-300"/>

      {/* Stroke Width */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-700 text-xs font-medium">Stroke</span>
        <div className="bg-gray-100 rounded-lg px-2 py-0.5 flex items-center gap-1.5">
          <StrokeWidthIcon />
          <span className="text-gray-700 text-xs">{strokeWidth}</span>
        </div>
      </div>

      <div className="h-6 w-px bg-gray-300"/>

      {/* Opacity */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-gray-700 text-xs font-medium whitespace-nowrap">Opacity</span>
        <div className="flex-1 px-2 min-w-0">
          <Slider
            value={[opacity]}
            max={100}
            step={1}
            onValueChange={(value) => setOpacity(value[0])}
            className="w-full"
          />
        </div>
        <span className="text-gray-700 text-xs whitespace-nowrap">{opacity}%</span>
      </div>
    </div>
  );
};

export default ShapeMenu;