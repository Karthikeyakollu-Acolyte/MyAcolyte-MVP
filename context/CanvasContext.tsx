"use client"
// CanvasContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { fabric } from 'fabric';

// Define types for the context state and the values passed to the context
interface CanvasChange {
  pageIndex: number;
  newObject: {
    type:string;
    data:string,
    position:object
  };
}

interface CanvasContextType {
  canvasChanges: CanvasChange[];
  handleCanvasChange: (pageIndex: number, canvasContent: object) => void;
  rect: { width: number, height: number };
  setRect: any;
  handleCanvasChangeRealtime: any;
  containerWidth:number;
  setContainerWidth:any;
}

// Create a context with the appropriate type
const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

// Custom hook to use the canvas context
export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};

// Define the CanvasProvider component props type
interface CanvasProviderProps {
  children: ReactNode;
}
export interface Layer {
  id: string;
  visible: boolean;
  content: Object; // The content for each layer (for each page)
  name: string;
}


// CanvasProvider component that will wrap the app
export const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [canvasChanges, setCanvasChanges] = useState<CanvasChange>();
  const [rect, setRect] = useState<{ width: number, height: number }>({ width: 800, height: 900 })
  const [containerWidth, setContainerWidth] = useState<number>(0)
  
  // Method to add or update changes in the canvas list
  const handleCanvasChange = useCallback(
    (
      pageIndex: number,
      newObject: any // Changed from 'newObjects' to a single object
    ) => {
      // Update the canvas change state with the new object
      setCanvasChanges(() => {
       const updatedChanges= {
          pageIndex,
          newObject, // Store only the new object for that page
        };

        return updatedChanges;
      });
    },
    []
  );




  // Method to add or update changes in the canvas list
  const handleCanvasChangeRealtime = useCallback(
    (pageIndex: number, canvasContent: any, rect: { width: number, height: number }) => {
      setCanvasChanges((prevChanges) => {
        const updatedChanges = [...prevChanges];
        const existingChangeIndex = prevChanges.findIndex(change => change.pageIndex === pageIndex);

        if (existingChangeIndex !== -1) {
          updatedChanges[existingChangeIndex] = { pageIndex, canvasContent };
        } else {
          updatedChanges.push({ pageIndex, canvasContent });
        }

        return updatedChanges;
      });
    }, []);


  return (
    <CanvasContext.Provider value={{ canvasChanges, handleCanvasChange, rect, setRect, handleCanvasChangeRealtime, containerWidth, setContainerWidth }}>
      {children}
    </CanvasContext.Provider>
  );
};
