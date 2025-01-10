
"use client"
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useToolContext } from "@/context/ToolContext"
import { Images, Image, Highlighter, Underline, Strikethrough, Waves, WavesIcon, Circle, Square, Triangle, Star } from "lucide-react"
import { convertToRgba, crossProduct, findLoop, segmentsIntersect } from "@/lib/canvas";
import type { ConfigureToolsProps, Tool } from "@/types/pdf";
import html2canvas from 'html2canvas';



// Component: ToolResetCanvas
export const ToolResetCanvas = ({ fabricCanvas }: { fabricCanvas: React.MutableRefObject<fabric.Canvas | null> }) => {
    useEffect(() => {
        if (!fabricCanvas.current) return;
        const canvas = fabricCanvas.current;
        canvas.isDrawingMode = false;
        canvas.selection = false;
        // canvas.defaultCursor = "default";
    }, [fabricCanvas]);
    return null;
};
