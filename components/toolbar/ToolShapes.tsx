"use client"
import React, { useCallback, useEffect, useRef } from "react";
import { fabric } from "fabric";
import type { Tool } from "@/types/pdf";
import { v4 as uuidv4 } from "uuid";
import type { CustomFabricObject } from "@/types/pdf";
import { useSettings } from "@/context/SettingsContext";



export const createShape =
  (options: any, shape: string) => {
    const roundedBorder = 10;

    // Create a shape with unique objectId
    const shapeOptions = {
      ...options,
      objectId: uuidv4(), // the object ID for each new shape
    };

    switch (shape) {
      case "circle":
        return new fabric.Circle({
          ...shapeOptions,
          radius: 1,
          strokeWidth: 2,
          strokeLineJoin: "round",
          strokeLineCap: "round",
        } as CustomFabricObject<fabric.Circle>);

      case "square":
        return new fabric.Rect({
          ...shapeOptions,
          width: 1,
          height: 1,
          rx: roundedBorder,
          ry: roundedBorder,
          strokeWidth: 2,
          strokeLineJoin: "round",
          strokeLineCap: "round",
        } as CustomFabricObject<fabric.Rect>);

      case "triangle":
        return new fabric.Triangle({
          ...shapeOptions,
          width: 1,
          height: 1,
          strokeWidth: 2,
        });

      default:
        return null;
    }
  }


export const ToolShapes = ({
  tool,
  fabricCanvas,
  setSelectedTool,
}: {
  tool: string;
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  setSelectedTool: React.Dispatch<React.SetStateAction<Tool>>;
}) => {
  let isDrawingShape = false;
  let shape: CustomFabricObject<fabric.Object> | null = null;
  let startX = 0,
    startY = 0;

  // This is used to keep track of the next available object ID
  let nextObjectId = 1;



  const onMouseDown = useCallback(
    (event: fabric.IEvent) => {
      if (!fabricCanvas.current) return;
      const canvas = fabricCanvas.current;

      canvas.isDrawingMode = false;
      const pointer = canvas.getPointer(event.e);
      startX = pointer.x;
      startY = pointer.y;


      isDrawingShape = true;
      const options = {
        left: startX,
        top: startY,
        fill: "transparent",
        stroke: "#000000",
        strokeWidth: 2,
        originX: "left",
        originY: "top",
      };

      shape = createShape(options, tool);
      canvas.selection = false

      if (shape) {
        console.log(`Created shape with objectId: ${shape.objectId}`); // Log the object ID
        canvas.add(shape);
      }
    },
    [fabricCanvas, createShape]
  );

  const onMouseMove = useCallback(
    (event: fabric.IEvent) => {
      if (!isDrawingShape || !shape || !fabricCanvas.current) return;
      const canvas = fabricCanvas.current;

      const pointer = canvas.getPointer(event.e);
      const width = pointer.x - startX;
      const height = pointer.y - startY;

      if (tool === "circle" && shape instanceof fabric.Circle) {
        const radius = Math.sqrt(width * width + height * height) / 2;
        shape.set({
          radius: radius,
          left: startX + (width < 0 ? width : 0),
          top: startY + (height < 0 ? height : 0),
        });
      } else if (shape instanceof fabric.Rect || shape instanceof fabric.Triangle) {
        shape.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width < 0 ? startX + width : startX,
          top: height < 0 ? startY + height : startY,
        });
      }

      shape.setCoords();
      canvas.renderAll();
    },
    [fabricCanvas, tool]
  );

  const onMouseUp = useCallback(() => {
    isDrawingShape = false;

    shape = null;
    if (fabricCanvas.current) {
      // Re-enable object selection and events
      fabricCanvas.current.getObjects().forEach(obj => {
        obj.selectable = true;
        obj.evented = true;
      });
      fabricCanvas.current.selection = true;
    }
    // setSelectedTool(null);
  }, [setSelectedTool]);



  useEffect(() => {

    if (!fabricCanvas.current) return;
    const canvas = fabricCanvas.current;
    canvas.getObjects().forEach(obj => {
      obj.selectable = false;
      obj.evented = false;
    });
    canvas.isDrawingMode=false
  
  }, [fabricCanvas.current, tool])

  
  return (
    <CanvasEventListeners
      fabricCanvas={fabricCanvas}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};



export const CanvasEventListeners = ({
  fabricCanvas,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: {
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  onMouseDown: (event: fabric.IEvent) => void;
  onMouseMove: (event: fabric.IEvent) => void;
  onMouseUp: () => void;
}) => {
  const { setfirst, currentPage } = useSettings()
  useEffect(() => {
    if (!fabricCanvas.current) return;
    const canvas = fabricCanvas.current;

    // Attach event listeners
    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);

    // Cleanup event listeners
    return () => {
      canvas.off('mouse:down', onMouseDown);
      canvas.off('mouse:move', onMouseMove);
      canvas.off('mouse:up', onMouseUp);
    };
  }, [fabricCanvas, onMouseDown, onMouseMove, onMouseUp, currentPage]);



  return null;
};
