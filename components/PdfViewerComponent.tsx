"use client"

import { useSettings } from "@/context/SettingsContext";
import { useEffect, useRef, useState } from "react";
import ExcalidrawComponent from "./canvas/excalidraw/ExcalidrawComponent";
import PdfViewer from "@/components/test/Test";

interface PdfViewerComponentProps {
  isExpanded: boolean;
  id: string;
}

export default function PdfViewerComponent({ isExpanded, id }: PdfViewerComponentProps) {
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
    className={`transition-all  w-[100vw] flex justify-center  scrollbar-hidden overflow-auto duration-300 pt-10 ease-in-out 
      ${theme === 'Dark Brown' ? 'bg-[#413F3A]' :
      theme === 'Deep Red' ? 'bg-[#3E2C2D]' :
      theme === 'Midnight Blue' ? 'bg-[#3B454B]' :
      theme === 'Deep Purple' ? 'bg-[#413B4B]' :
      theme === 'Charcoal Black' ? 'bg-[#454545]' :
      theme === 'Very Dark Purple' ? 'bg-[#2D2C3E]' : 
      theme === 'light' ? 'bg-[#EEF1F5]' : ''
    }`}

      ref={containerNodeRef}
    >
      {/* Conditional rendering based on `first` state */}
      {!first && (
        <div className="w-[100vw]  pt-10 overflow-hidden">
          <PdfViewer id={id}/>
        </div>
      )}

      {/* This is the PDF note component, rendered when `first` is true */}
      {first && (
        <div className="w-[100vw] h-screen" >
          <ExcalidrawComponent id={id} />
        </div>
      )}
    </div>
  );
}
