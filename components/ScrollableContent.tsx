"use client"

import { useSettings } from "@/context/SettingsContext";
import Wrapper from "./Wrapper";
import { useEffect, useRef, useState } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Divide, Notebook } from "lucide-react";
import ScrollableTransform from "./pdfcomponents/ScrollabalComponent";
import ExcalidrawComponent from "./canvas/excalidraw/ExcalidrawComponent";
import { Button } from "./ui/button";
import ToggleInfiniteCanvas from "./canvas/ToggleInfiniteCanvas";
import { useTheme } from "@/context/useTheme";

interface ScrollableContentProps {
  isExpanded: boolean;
  id: string;
}

export default function ScrollableContent({ isExpanded, id }: ScrollableContentProps) {
  const a4Height = 297;
  const containerNodeRef = useRef<HTMLDivElement>(null);
  const { first, setfirst, isInfinite } = useSettings();
  const { setcurrentDocumentId } = useSettings();
   const { theme } = useSettings();

  // Set the current document ID whenever `id` changes
  useEffect(() => {
    setcurrentDocumentId(id);
  }, [id, setcurrentDocumentId]);

  // Log the current theme for debugging purposes
  useEffect(() => {
    console.log(theme);
  }, [theme]);

  return (
    <div
    className={`transition-all h-[100vh] w-[100vw] flex justify-center overflow-auto duration-300 ease-in-out 
      ${theme === 'Dark Brown' ? 'bg-[#413F3A]' :
      theme === 'Deep Red' ? 'bg-[#3E2C2D]' :
      theme === 'Midnight Blue' ? 'bg-[#3B454B]' :
      theme === 'Deep Purple' ? 'bg-[#413B4B]' :
      theme === 'Charcoal Black' ? 'bg-[#454545]' :
      theme === 'Very Dark Purple' ? 'bg-[#2D2C3E]' : ''}`}

      ref={containerNodeRef}
    >
      {/* Button to toggle the state of `first` */}
      <Button
        variant={"default"}
        onClick={() => { setfirst(!first); }}
        className="border border-1 p-2 m-2 rounded-md absolute top-96 left-2"
        style={{ zIndex: 20 }}
      >
        <Notebook className="w-8 h-8" />
      </Button>

      {/* Conditional rendering based on `first` state */}
      {!first && (
        <div className="w-[100vw] h-screen">
          <ScrollableTransform>
            <Wrapper id={id} />
          </ScrollableTransform>
          <ToggleInfiniteCanvas />
        </div>
      )}

      {/* This is the PDF note component, rendered when `first` is true */}
      {first && (
        <div className="w-[100vw] h-[99%]" >
          <ExcalidrawComponent id={id} />
        </div>
      )}
    </div>
  );
}
