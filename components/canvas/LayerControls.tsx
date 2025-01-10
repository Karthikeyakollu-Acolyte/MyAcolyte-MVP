"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Trash2, Plus } from 'lucide-react';
import { Layer } from '@/context/CanvasContext';

export const LayerControls: React.FC<{
  layers: Layer[];
  addLayer: () => void;
  toggleLayerVisibility: (index: number) => void;
  deleteLayer: (index: number) => void;
}> = ({ layers, addLayer, toggleLayerVisibility, deleteLayer }) => (
  <div className="fixed top-0 right-0 w-64 bg-white shadow-lg rounded-lg overflow-hidden " style={{zIndex:90}}>

    <div className="p-4 bg-gray-100 border-b border-gray-200">
      <Button onClick={addLayer} className="w-full text-white">
        <Plus className="mr-2 h-4 w-4" /> Add Layer
      </Button>
    </div>
    <ul className="p-2 space-y-2">
      {layers.map((layer, index) => (
        <li key={layer.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{layer.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button size="icon" variant="ghost" onClick={() => toggleLayerVisibility(index)}>
              {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={() => deleteLayer(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
