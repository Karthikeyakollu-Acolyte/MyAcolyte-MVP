"use client"
import React, { useEffect } from "react";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { CustomFabricObject } from "@/types/pdf";
interface AddTextProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  setSelectedTool: any;
}

export const ToolText = ({
  fabricCanvas,
  textColor,
  fontSize,
  fontFamily,
  setSelectedTool
}: AddTextProps) => {
  let flag = false
  useEffect(() => {
    if (!fabricCanvas.current) return;
    const canvas = fabricCanvas.current;
    const handleMouseDown = (event: fabric.IEvent) => {
      const pointer = canvas.getPointer(event.e);

      // Create the text object
      const text = new fabric.IText("", {
        left: pointer.x,
        top: pointer.y,
        fill: textColor,
        fontSize: fontSize,
        fontFamily: 'Virgil',
        editable: true,
        selectable: true,
        hasControls: false,
        hasBorders: false,
        cursorColor: "blue",
        textAlign: 'left',
        objectId: uuidv4()
      });

      // Add the text object to the canvas
      canvas.add(text);

      // Set the created text object as the active one
      canvas.setActiveObject(text);

      // Render the canvas to update view
      canvas.renderAll();

      // Manually focus on the text object to ensure the cursor is visible
      text.enterEditing();

      // Optionally, you can also set a timeout to start the cursor blink if needed:
      setTimeout(() => {
        text.setSelectionStart(0); // Optionally set the selection at the start
      }, 0);
    };

    // Handle mouse up event (optional for state management)
    function handleMouseUp() {
      setSelectedTool(null);  // Reset selected tool, if needed
      flag = true;             // Set flag, if required
    }



    // canvas.on('mouse:move', function (e) {
    //   if (!flag) {
    //     canvas.setCursor(`url("https://img.icons8.com/?size=20&id=XA3uAyBFk8kW&format=png&color=000000") 1 40, auto`);
    //     canvas.isDrawingMode = false
    //   } else {
    //     canvas.setCursor('default');
    //     canvas.isDrawingMode = false
    //   }
    // });

    canvas.isDrawingMode = false
    // Add event listener for mouse down
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:up", handleMouseUp);

    // Cleanup the event listener on component unmount
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.on("mouse:up", handleMouseUp);
    };
  }, [fabricCanvas, textColor, fontSize, fontFamily]);

  return null;
};

