

"use client"
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useToolContext } from "@/context/ToolContext"
import { Images, Image, Highlighter, Underline, Strikethrough, Waves, WavesIcon, Circle, Square, Triangle, Star } from "lucide-react"
import { convertToRgba, crossProduct, findLoop, segmentsIntersect } from "@/lib/canvas";
import type { ConfigureToolsProps, Tool } from "@/types/pdf";
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from "uuid";
import type { CustomFabricObject } from "@/types/pdf";
import { useCanvas } from "@/context/CanvasContext";
import { useSettings } from "@/context/SettingsContext";

// Component: ToolDrawing
export const ToolDrawing = ({
  tool,
  brushSize,
  brushColor,
  fabricCanvas,
  includeId
}: {
  tool: string;
  brushSize: number;
  brushColor: string;
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  includeId?: Boolean;
}) => {
  // This is used to keep track of the next available object ID
  let nextObjectId = 1;
  const { rect, handleCanvasChange } = useCanvas();

  const {currentPage} = useSettings()

  useEffect(() => {
    if (!fabricCanvas.current) return;
    const canvas = fabricCanvas.current;
  

  
    // Enable drawing mode and configure brush properties
    if (tool === "pen" || tool === "highlighter") {
      canvas.isDrawingMode = true;
      const drawingBrush = canvas.freeDrawingBrush as fabric.PencilBrush;
      drawingBrush.width = tool === "highlighter" ? 15 : brushSize;
      drawingBrush.color =
        tool === "highlighter" ? convertToRgba(brushColor, 0.3) : brushColor;
  
      if (tool === "highlighter") {
        canvas.on("path:created", function (event) {
          const path = event.path as fabric.Path;
          if (path) {
            path.selectable = false;
            path.evented = false;
  
            if (includeId) {
              path.set({
                objectId: uuidv4(),
              });
            } else {
              canvas.remove(path);
            }
  
            canvas.renderAll();
          }
        });
      } else if (tool === "pen") {
        canvas.on("path:created", function (event) {
          const path = event.path as fabric.Path;
          if (path) {
            path.set({
              objectId: uuidv4(),
            });
            canvas.renderAll();
          }
        });
      }
  
    } else {
      canvas.isDrawingMode = false;
    }
  
    // Cleanup event listeners when the component unmounts or dependencies change
    return () => {
      canvas.off("path:created");
    };
  }, [tool, brushSize, brushColor, fabricCanvas, includeId, currentPage]);
  

  return null;
};
