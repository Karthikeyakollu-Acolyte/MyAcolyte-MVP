"use client"
import React, { useEffect, useState, useMemo } from "react";
import { fabric } from "fabric";
import { Images, Image, Circle, Square } from "lucide-react"
import { findLoop } from "@/lib/canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IEvent } from "fabric/fabric-impl";
import { useToolContext } from "@/context/ToolContext";

// Types for better type safety
type Point = { x: number; y: number };
type MenuPosition = { top: number; right: number };
type ShapeAction = 'hover' | 'click' | 'leave';

interface PathHandlerProps {
    fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
    setLoopPoints: (points: Point[]) => void;
    setMenuPosition: (position: MenuPosition) => void;
    setMenuVisible: (visible: boolean) => void;
    loopPathRef: React.MutableRefObject<fabric.Path | null>;
    saveLayerContent: (content: fabric.Object[]) => void;
}

export const PathCreatedHandler: React.FC<PathHandlerProps> = ({
    fabricCanvas,
    setLoopPoints: setParentLoopPoints,
    setMenuPosition: setParentMenuPosition,
    setMenuVisible: setParentMenuVisible,
    loopPathRef,
    saveLayerContent
}) => {
    const [state, setState] = useState({
        loopPoints: [] as Point[],
        menuPosition: { top: 0, right: 0 },
        menuVisible: false,
        linePath: null as fabric.Path | null
    });
    const {prevselectedTool,setSelectedTool} = useToolContext()

    useEffect(() => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        const handlePathCreated = (e: IEvent<Event>) => {
            console.log("path created..")
            const path = e.path;
            const points = path.path.map(point => ({ x: point[1], y: point[2] }));
            const loopPoints = findLoop(points);
            
            if (!loopPoints) return;

            const bounds = loopPoints.reduce((acc, p) => ({
                left: Math.min(acc.left, p.x),
                top: Math.min(acc.top, p.y),
                right: Math.max(acc.right, p.x),
                bottom: Math.max(acc.bottom, p.y)
            }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });

            const loopPath = new fabric.Path(
                loopPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' '), 
                {
                    fill: 'rgba(16, 125, 235, 0.3)',
                    stroke: 'blue',
                    strokeWidth: 2,
                    strokeDashArray: [5, 5],
                    selectable: true,
                    hasBorders: false,
                    hasControls: false,
                }
            );

            loopPathRef.current = loopPath;
            const menuPosition = { 
                top: loopPoints[0].y - 10, 
                right: loopPoints[0].x + 100 
            };

            setState({
                loopPoints,
                menuPosition,
                menuVisible: true,
                linePath: path
            });

            setParentLoopPoints(loopPoints);
            setParentMenuPosition(menuPosition);
            setParentMenuVisible(true);
        };

        canvas.on('path:created', handlePathCreated);

        return () => canvas.off('path:created', handlePathCreated);

    }, [fabricCanvas, setParentLoopPoints, setParentMenuPosition, setParentMenuVisible, loopPathRef,prevselectedTool]);

    return state.menuVisible ? (
        <Menu
            {...state}
            fabricCanvas={fabricCanvas}
            loopPathRef={loopPathRef}
            saveLayerContent={saveLayerContent}
            setMenuVisible={(visible) => {
                setState(prev => ({ ...prev, menuVisible: visible }));
                setParentMenuVisible(visible);
            }}
        />
    ) : null;
};

const Menu: React.FC<any> = ({ 
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
    const {prevselectedTool,setSelectedTool} = useToolContext()
    
    const adjustedPosition = useMemo(() => {
        if (!menuVisible) return { top: 0, left: 0 };
        
        const { innerWidth, innerHeight } = window;
        const menuWidth = 250, menuHeight = 60;
        
        return {
            top: Math.min(menuPosition.top, innerHeight - menuHeight - 20),
            left: Math.min(menuPosition.right, innerWidth - menuWidth - 20)
        };
    }, [menuPosition, menuVisible]);

    const handleShapeAction = (shapeType: 'circle' | 'square', action: ShapeAction) => {
        const canvas = fabricCanvas.current;
        if (!canvas || !loopPoints.length) return;
        
        previewShape && canvas.remove(previewShape);

        if (action === 'leave') {
            canvas.add(linePath);
            canvas.renderAll();
            return;
        }

        const bounds = loopPoints.reduce((acc, p) => ({
            left: Math.min(acc.left, p.x),
            top: Math.min(acc.top, p.y),
            right: Math.max(acc.right, p.x),
            bottom: Math.max(acc.bottom, p.y)
        }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });

        const width = bounds.right - bounds.left;
        const height = bounds.bottom - bounds.top;
        const size = Math.min(width, height);

        const shapeConfig = {
            fill: 'transparent',
            stroke: '#2563eb',
            strokeWidth: 2
        };

        const shape = shapeType === 'circle' 
            ? new fabric.Circle({
                ...shapeConfig,
                left: bounds.left + width / 2 - size / 2,
                top: bounds.top + height / 2 - size / 2,
                radius: size / 2
            })
            : new fabric.Rect({
                ...shapeConfig,
                left: bounds.left,
                top: bounds.top,
                width: size,
                height: size
            });

        canvas.remove(linePath);
        canvas.add(shape);
        
        if (action === 'click') {
            canvas.remove(loopPathRef.current);
            setMenuVisible(false);
            saveLayerContent(canvas.getObjects());
            // setSelectedTool(null)
        } else {
            setPreviewShape(shape);
        }
        
        canvas.renderAll();
    };

    const renderButton = (icon: React.ReactNode, tooltip: string, action?: () => void, shapeType?: 'circle' | 'square') => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon"
                    className={`hover:bg-${shapeType ? 'blue' : 'pink'}-100`}
                    {...(shapeType ? {
                        onMouseEnter: () => handleShapeAction(shapeType, 'hover'),
                        onClick: () => handleShapeAction(shapeType, 'click'),
                        onMouseLeave: () => handleShapeAction(shapeType, 'leave')
                    } : { onClick: action })}
                >
                    {icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );

    return (
        <Card className="fixed z-50 shadow-lg bg-white rounded-lg p-2" 
              style={{ 
                  top: adjustedPosition.top, 
                  left: adjustedPosition.left,
                  transform: 'translate(0, -50%)'
              }}>
            <TooltipProvider>
                <div className="flex items-center space-x-2">
                    {renderButton(<Images className="h-5 w-5 text-blue-600" />, "Capture Full Screen")}
                    {renderButton(<Image className="h-5 w-5 text-pink-600" />, "Capture PDF")}
                    {renderButton(<Circle className="h-5 w-5 text-blue-600" />, "Draw Circle", undefined, 'circle')}
                    {renderButton(<Square className="h-5 w-5 text-pink-600" />, "Draw Square", undefined, 'square')}
                </div>
            </TooltipProvider>
        </Card>
    );
};