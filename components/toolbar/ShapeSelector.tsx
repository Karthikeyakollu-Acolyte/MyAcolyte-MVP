"use client"
import React, { useState } from 'react';
import { 
  Diamond, 
  Triangle, 
  Circle, 
  Square, 
  ArrowUpRight, 
  Minus,
  MousePointer
 
} from 'lucide-react';
import ShapeMenu from './ShapeMenu';
import { useSettings } from '@/context/SettingsContext';

const ShapeButton = ({ Icon, isSelected, onClick }) => (
  <button
    className={`w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors ${
      isSelected ? 'bg-gray-100' : ''
    }`}
    onClick={onClick}
  >
    <Icon className="w-4 h-4 text-gray-700" />
  </button>
);

const ShapeSelector = () => {
  const [selectedShape, setSelectedShape] = useState(null);
  const {activeTool, setActiveTool} = useSettings();


  const shapes = [
    {
      id: 'rectangleSelection',
      icon:   MousePointer
    },
    {
      id: 'diamond',
      icon: Diamond
    },
    {
      id: 'circle',
      icon: Circle
    },
    {
      id: 'rectangle',
      icon: Square
    },
    {
      id: 'arrow',
      icon: ArrowUpRight
    },
    {
      id: 'line',
      icon: Minus
    }
  ];

  return (
    <div className="relative">
      <div className="bg-white rounded-full  py-1.5 px-2 flex items-center gap-1 w-fit">
        {shapes.map((shape) => (
          <ShapeButton
            key={shape.id}
            Icon={shape.icon}
            isSelected={selectedShape === shape.id}
            onClick={() => setActiveTool(shape)}
          />
        ))}
      </div>
      { <div className='absolute -top-10'><ShapeMenu/></div> }
      {/* Pointer */}
      <div className="absolute w-3 h-3 bg-white rotate-45 -bottom-1.5 right-16 "/>
    </div>
  );
};

export default ShapeSelector;