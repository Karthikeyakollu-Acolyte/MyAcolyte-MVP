"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { Plus, Minus } from "lucide-react";
import log from "@/public/addtext.svg";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false }
);

const CustomExcalidraw = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
  const [zoom, setZoom] = useState(1);
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [initialAppState] = useState({
    zoom: { value: 1 },
    scrollX: 0,
    scrollY: 0,
  });

  // Zoom In Function
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2);
    const appState = excalidrawAPI?.getAppState();
    if (!appState) return;

    setZoom(newZoom);
    excalidrawAPI?.updateScene({
      appState: {
        // zoom: { value: newZoom },
      },
    });
  };

  // Zoom Out Function
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    const appState = excalidrawAPI?.getAppState();
    if (!appState) return;

    setZoom(newZoom);
    excalidrawAPI?.updateScene({
      appState: {
        // zoom: { value: newZoom },
      },
    });
  };

  // OnChange handler for Excalidraw to capture scroll changes
  const handleChange = (elements: any, appState: any) => {
    // Update the scroll position and zoom whenever the scene changes
    setScrollX(appState.scrollX);
    setScrollY(appState.scrollY);
    setZoom(appState.zoom.value); // Update zoom based on Excalidraw's appState
  };

  return (
    <div className="relative">
      {/* Zoom Buttons */}
      <div className="fixed top-4 right-4 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          <Minus size={24} />
        </button>
      </div>

      {/* Canvas Container */}
      <div className="w-[50vw] h-[80vh] relative border m-20 overflow-hidden" style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",

          }}>
        <div
          className="w-full h-full flex items-center justify-center flex-col"
          
        >
          <div className="max-w-[600px] mx-auto my-10 p-6 bg-white border-2 border-gray-300 shadow-md rounded-lg">
            <h1 className="text-3xl font-semibold mb-4">PDF-Like Page</h1>
            <p className="text-lg text-gray-700 mb-4">
              This is some sample text that looks like content inside a PDF
              page. The page is styled with a container that resembles a printed
              document, including margins, padding, and shadows.
            </p>
            <p className="text-lg text-gray-700">
              You can add more content here. The layout will maintain the
              PDF-like look with a simple border and a clean background. You can
              also adjust the size of the page or use additional Tailwind
              utilities to tweak the layout.
            </p>
          </div>
        </div>

        {/* Excalidraw Component */}
        <div className="absolute w-[60vh] h-[90vh] top-0 left-0">
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            onChange={handleChange} // Set the onChange handler to capture scroll and zoom
            initialData={{
              appState: {
                ...initialAppState,
                viewBackgroundColor: "transparent",
                currentItemStrokeColor: "#000000",
                currentItemBackgroundColor: "transparent",
                theme: "light",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomExcalidraw;
