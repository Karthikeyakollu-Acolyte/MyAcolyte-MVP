"use client";

import { ExcalidrawImperativeAPI, ExcalidrawElement, AppState } from "@excalidraw/excalidraw/types/types";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false }
);

const CustomExcalidraw = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
  const [activeElement, setActiveElement] = useState<ExcalidrawElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  
  


  
  const onChange = (elements: readonly ExcalidrawElement[], state: AppState) => {
    
  
    // Get IDs of selected elements from AppState
    const selectedElementIds = Object.keys(state.selectedElementIds).filter(
      (id) => state.selectedElementIds[id]
    );
  
    if (selectedElementIds.length > 0) {
      // Find the first selected element
      const selectedElement = elements.find((el) => selectedElementIds.includes(el.id));
      console.log(selectedElement)
      if (selectedElement) {
        
        setActiveElement(selectedElement);
        // setMenuPosition({
        //   x: selectedElement.x + selectedElement.width / 2,
        //   y: selectedElement.y - 40,
        // });
      }
    } else {
      // No elements are selected
      setActiveElement(null);
      setMenuPosition(null);
    }
  };
  

  const updateElementProperty = (property: string, value: any) => {
    if (excalidrawAPI && activeElement) {
      excalidrawAPI.updateScene({
        elements: excalidrawAPI.getSceneElements().map((el) =>
          el.id === activeElement.id ? { ...el, [property]: value } : el
        ),
      });
    }
  };

  return (
    <div className="w-screen h-screen relative">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api as ExcalidrawImperativeAPI)}
        onChange={onChange}
      />

      
      {activeElement  && (
        <div
          className="absolute bg-white border shadow-lg p-3 rounded-md z-10"
          style={{
            top: 500,
            left: 500,
            transform: "translate(-50%, -100%)",
          }}
        >
          <h3 className="text-sm font-bold mb-2">Edit Element</h3>
          <div className="space-y-2">
            {/* Example property modification: Stroke Color */}
            <div>
              <label className="text-xs">Stroke Color:</label>
              <input
                type="color"
                className="w-full h-8 p-0 border rounded"
                value={activeElement.strokeColor || "#000000"}
                onChange={(e) => updateElementProperty("strokeColor", e.target.value)}
              />
            </div>

            {/* Example property modification: Stroke Width */}
            <div>
              <label className="text-xs">Stroke Width:</label>
              <input
                type="number"
                className="w-full p-1 border rounded"
                value={activeElement.strokeWidth || 1}
                onChange={(e) => updateElementProperty("strokeWidth", parseInt(e.target.value, 10))}
              />
            </div>

            {/* Example property modification: Opacity */}
            <div>
              <label className="text-xs">Opacity:</label>
              <input
                type="range"
                className="w-full"
                min="0"
                max="100"
                value={activeElement.opacity || 100}
                onChange={(e) => updateElementProperty("opacity", parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default CustomExcalidraw;
