
"use client"
import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { useToolContext } from "@/context/ToolContext"
import { Images, Image, Circle, Square, Notebook, Dice5 } from "lucide-react"
import { findLoop } from "@/lib/canvas";
import html2canvas from 'html2canvas';
import { useSettings } from "@/context/SettingsContext";
import { CustomFabricObject, Note } from "@/types/pdf";
import { useCanvas } from "@/context/CanvasContext";
import { v4 as uuidv4 } from "uuid";


import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export const PathCreatedHandler = ({
    fabricCanvas,
    setLoopPoints,
    setMenuPosition,
    setMenuVisible,
    loopPathRef,
    saveLayerContent
}: {
    fabricCanvas: React.MutableRefObject<fabric.Canvas | null>,
    setLoopPoints: (points: any) => void,
    setMenuPosition: (position: { top: number; right: number }) => void,
    setMenuVisible: (visible: boolean) => void,
    loopPathRef: React.MutableRefObject<fabric.Path | null>,
    saveLayerContent: any
}) => {
    const [loopPoints, setLocalLoopPoints] = useState<{ x: number, y: number }[]>([]);
    const [menuPosition, setLocalMenuPosition] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
    const [menuVisible, setLocalMenuVisible] = useState(false);
    const [linePath, setLinePath] = useState(null)
    const [loopPath, setloopPath] = useState(null)
    let loopPathData: any = null

    useEffect(() => {
        if (!fabricCanvas.current) return;
        const canvas = fabricCanvas.current;

        const handlePathCreated = (e: any) => {
            const path = e.path;
            const points = path.path.map((point: any) => ({ x: point[1], y: point[2] }));

            const loopPoints = findLoop(points);
            

            if (loopPoints) {
                console.log("Path created and detectedd")
                const left = Math.min(...loopPoints.map(p => p.x));
                const top = Math.min(...loopPoints.map(p => p.y));
                const width = Math.max(...loopPoints.map(p => p.x)) - left;
                const height = Math.max(...loopPoints.map(p => p.y)) - top;
                if (!left || !top || !width || !height) return;

                setLocalLoopPoints(loopPoints);
                setLoopPoints(loopPoints);

                // Convert loop points to path data
                loopPathData = loopPoints.map(point => ['L', point.x, point.y]);
                loopPathData[0][0] = 'M';  // Close the path

                // Create the dotted lasso-like path
                const loopPath = new fabric.Path(loopPathData, {
                    fill: 'rgba(16, 125, 235, 0.3)',  // Semi-transparent red fill
                    stroke: 'blue',                // Blue stroke color
                    strokeWidth: 2,                // Slightly thicker stroke
                    strokeDashArray: [5, 5],       // Dotted line style (5px line, 5px gap)
                    selectable: true,             // Make the loop path non-selectable
                    hasBorders: false,             // Disable borders
                    hasControls: false,            // Disable controls (resize, rotate)
                });

                // Optionally, add the loop path to the canvas
                // canvas.add(loopPath);
                let dashOffset = 0;

                function animateLasso() {
                    // Create the animation effect by adjusting strokeDashArray
                    loopPath.set({
                        strokeDashArray: [5, 5],  // Keep the basic pattern of dashes and gaps
                        strokeDashOffset: dashOffset
                    });

                    // Animate the dashOffset to simulate the movement of the dots
                    fabric.util.animate({
                        startValue: dashOffset,
                        endValue: dashOffset + 10,  // Adjust the value to determine how far the dots move
                        duration: 1000,  // Animation duration in milliseconds
                        easing: fabric.util.ease.easeOutQuad,  // Easing function for smooth movement
                        onChange: function (value) {
                            // Update the dashOffset to make the dots move
                            dashOffset = value;
                            loopPath.set({ strokeDashOffset: dashOffset });
                            canvas.renderAll();
                        },
                        onComplete: function () {
                            // Loop the animation by resetting dashOffset
                            animateLasso();
                        }
                    });
                }
                // animateLasso();
                setLinePath(path);
                canvas.renderAll();

                // Store reference for further usage
                loopPathRef.current = loopPath;

                // Position menu at the start of the loop
                const firstPoint = loopPoints[0];
                const menuPosition = { top: firstPoint.y - 10, right: firstPoint.x + 100 };
                setLocalMenuPosition(menuPosition);
                setMenuPosition(menuPosition);
                setLocalMenuVisible(true);
                setMenuVisible(true);

            }
        };


        canvas.on('path:created', handlePathCreated);
        return () => {
            canvas.off('path:created', handlePathCreated);
        };
    }, [fabricCanvas, setLoopPoints, setMenuPosition, setMenuVisible, loopPathRef]);

    return (
        <>
            <Menu
                menuVisible={menuVisible}
                menuPosition={menuPosition}
                loopPoints={loopPoints}
                setMenuVisible={setLocalMenuVisible}
                fabricCanvas={fabricCanvas}
                linePath={linePath}
                saveLayerContent={saveLayerContent}
                loopPathRef={loopPathRef}



            />
        </>
    );
};





const Menu: React.FC<{
    menuVisible: boolean;
    menuPosition: { top: number; right: number };
    loopPoints: { x: number; y: number }[];
    setMenuVisible: (visible: boolean) => void;
    fabricCanvas: any;
    linePath: any;
    loopPathRef: any;
    saveLayerContent: any;
}> = ({ 
    menuVisible, 
    menuPosition, 
    loopPoints, 
    setMenuVisible, 
    fabricCanvas, 
    linePath, 
    saveLayerContent, 
    loopPathRef 
}) => {
    const [previewShape, setPreviewShape] = useState<fabric.Object | null>(null);
    
    // Ensure menu stays within viewport bounds
    const adjustedPosition = React.useMemo(() => {
        if (!menuVisible) return { top: 0, left: 0 };
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const menuWidth = 250; // Approximate menu width
        const menuHeight = 60; // Approximate menu height
        
        let left = menuPosition.right;
        let top = menuPosition.top;
        
        // Adjust horizontal position if menu would overflow viewport
        if (left + menuWidth > viewportWidth) {
            left = viewportWidth - menuWidth - 20;
        }
        
        // Adjust vertical position if menu would overflow viewport
        if (top + menuHeight > viewportHeight) {
            top = viewportHeight - menuHeight - 20;
        }
        
        return { top, left };
    }, [menuPosition, menuVisible]);

    // Handle shape preview and creation
    const handleShapeAction = (shapeType: string, action: 'hover' | 'click' | 'leave') => {
        if (!fabricCanvas.current || !loopPoints.length) return;

        const canvas = fabricCanvas.current;
        
        // Remove existing preview if any
        if (previewShape) {
            canvas.remove(previewShape);
        }

        if (action === 'leave') {
            canvas.add(linePath);
            canvas.renderAll();
            return;
        }

        // Calculate shape dimensions
        const left = Math.min(...loopPoints.map(p => p.x));
        const top = Math.min(...loopPoints.map(p => p.y));
        const width = Math.max(...loopPoints.map(p => p.x)) - left;
        const height = Math.max(...loopPoints.map(p => p.y)) - top;

        let shape;
        if (shapeType === 'circle') {
            const radius = Math.min(width, height) / 2;
            shape = new fabric.Circle({
                left: left + width / 2 - radius,
                top: top + height / 2 - radius,
                radius,
                fill: 'transparent',
                stroke: '#2563eb',
                strokeWidth: 2
            });
        } else if (shapeType === 'square') {
            const size = Math.min(width, height);
            shape = new fabric.Rect({
                left,
                top,
                width: size,
                height: size,
                fill: 'transparent',
                stroke: '#2563eb',
                strokeWidth: 2
            });
        }

        if (shape) {
            canvas.remove(linePath);
            canvas.add(shape);
            
            if (action === 'click') {
                canvas.remove(loopPathRef.current);
                setMenuVisible(false);
                const updatedContent = canvas.getObjects();
                saveLayerContent(updatedContent);
            } else {
                setPreviewShape(shape);
            }
            
            canvas.renderAll();
        }
    };

    if (!menuVisible) return null;

    return (
        <Card className="fixed z-50 shadow-lg bg-white rounded-lg p-2" 
              style={{ 
                  top: adjustedPosition.top, 
                  left: adjustedPosition.left,
                  transform: 'translate(0, -50%)'
              }}>
            <TooltipProvider>
                <div className="flex items-center space-x-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-blue-100"
                                onClick={() => validateAndPrepareCapture("full")}>
                                <Images className="h-5 w-5 text-blue-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Capture Full Screen</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-pink-100"
                                onClick={() => validateAndPrepareCapture("pdf")}>
                                <Image className="h-5 w-5 text-pink-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Capture PDF</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-blue-100"
                                onMouseEnter={() => handleShapeAction("circle", "hover")}
                                onClick={() => handleShapeAction("circle", "click")}
                                onMouseLeave={() => handleShapeAction("circle", "leave")}>
                                <Circle className="h-5 w-5 text-blue-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Draw Circle</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="hover:bg-pink-100"
                                onMouseEnter={() => handleShapeAction("square", "hover")}
                                onClick={() => handleShapeAction("square", "click")}
                                onMouseLeave={() => handleShapeAction("square", "leave")}>
                                <Square className="h-5 w-5 text-pink-600" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Draw Square</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </Card>
    );
};