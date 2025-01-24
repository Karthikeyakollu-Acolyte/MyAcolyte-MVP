"use client";

import { AppState, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false }
);


const CustomExcalidraw = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
  const [scale, setScale] = useState(1);

  const handleZoom = (direction: 'in' | 'out') => {
    const newScale = direction === 'in' ? scale + 0.2 : scale - 0.2;
    setScale(Math.max(0.2, Math.min(3, newScale)));
  };

  const handleChange = (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
  ) => {
    console.log(appState)
  };

  return (
    <div 
      className="relative w-[80vw] h-[80vh]"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center'
      }}
    >
      <div className="absolute top-4 -right-20 z-10 flex flex-col gap-2" style={{ transform: `scale(${1/scale})` }}>
        <button
          onClick={() => handleZoom('in')}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="w-full h-full border m-10">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api as ExcalidrawImperativeAPI)}
        onPointerUpdate={() => {
          if (!excalidrawAPI) return;
          excalidrawAPI.setActiveTool({ type: "freedraw" });
        }}
        onChange={handleChange}
      />
      </div>
    </div>
  );
};

export default CustomExcalidraw;

