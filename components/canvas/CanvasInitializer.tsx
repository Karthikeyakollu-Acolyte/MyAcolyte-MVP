// CanvasInitializer component
"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { fabric } from "fabric";
import type { Rect, CanvasInitializerProps } from "@/types/pdf";




export const CanvasInitializer = ({ canvasRef, fabricCanvas, rect }: CanvasInitializerProps) => {
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric canvas
    const fabricCanvasInstance = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      selection: false,
      backgroundColor: "transparent",
    });

    fabricCanvas.current = fabricCanvasInstance;
    const canvas = fabricCanvasInstance

    
    // Resize Fabric canvas to match dimensions
    fabricCanvasInstance.setWidth(rect.width);
    fabricCanvasInstance.setHeight(rect.height);
    fabricCanvasInstance.calcOffset();

    return () => {
      fabricCanvasInstance.dispose();
    };
  }, [rect]);

  return null;
};
