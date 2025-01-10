"use client"
import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

interface CanvasWrapperProps {
    pageRect: DOMRect | null;
    isDrawing: boolean;
}

export const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ pageRect, isDrawing }) => {
    const canvasWrapperRef = useRef<HTMLDivElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        if (canvasWrapperRef.current) {
            const canvasElement = document.createElement("canvas");
            canvasWrapperRef.current.appendChild(canvasElement);
            canvasWrapperRef.current.id=""

            const fabricCanvas = new fabric.Canvas(canvasElement, {
                isDrawingMode: false,
                selection: false,
                backgroundColor: "transparent",
            });

            fabricCanvasRef.current = fabricCanvas;

            // Set default brush properties
            fabricCanvas.freeDrawingBrush.width = 5;
            fabricCanvas.freeDrawingBrush.color = "rgba(0, 0, 255, 0.5)";

            return () => {
                fabricCanvas.dispose();
                // canvasWrapperRef.current.innerHTML = "";
            };
        }
    }, []);

    useEffect(() => {
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.isDrawingMode = isDrawing;
        }
    }, [isDrawing]);

    useEffect(() => {
        if (pageRect && fabricCanvasRef.current) {
            fabricCanvasRef.current.setWidth(pageRect.width);
            fabricCanvasRef.current.setHeight(pageRect.height);
            fabricCanvasRef.current.calcOffset();
        }
        console.log(pageRect)
    }, [pageRect]);

    return (
        <div
            ref={canvasWrapperRef}
            className="canvas-wrapper absolute"
            style={{
                zIndex: 10,
                pointerEvents: isDrawing ? "auto" : "none",
                top: pageRect?.top || 0,
                left: pageRect?.left || 0,
                width: pageRect?.width || 0,
                height: pageRect?.height || 0,
            }}
        ></div>
    );
};
