"use client"
import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the types for the refs
interface RefsContextType {
  canvasRef: HTMLCanvasElement | null;
  setCanvasRef: Dispatch<SetStateAction<HTMLCanvasElement | null>>;
  pdfViewerRef: HTMLDivElement | null;
  setPdfViewerRef: Dispatch<SetStateAction<HTMLDivElement | null>>;

}

// Create a context with a default value
const RefsContext = createContext<RefsContextType | undefined>(undefined);

// Provider component
interface RefsProviderProps {
  children: ReactNode;
}

export const RefsProvider: React.FC<RefsProviderProps> = ({ children }) => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [pdfViewerRef, setPdfViewerRef] = useState<HTMLDivElement | null>(null);


  return (
    <RefsContext.Provider value={{ canvasRef, setCanvasRef, pdfViewerRef, setPdfViewerRef }}>
      {children}
    </RefsContext.Provider>
  );
};

// Custom hook for using the context
export const useRefs = (): RefsContextType => {
  const context = useContext(RefsContext);
  if (!context) {
    throw new Error('useRefs must be used within a RefsProvider');
  }
  return context;
};

