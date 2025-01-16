"use client"
import React, { useEffect, useRef, useState } from "react";
import type { ConfigureToolsProps, Tool } from "@/types/pdf";

import {
    PathCreatedHandler,
    TextHighlighter,
    ToolDrawing,
    ToolResetCanvas,
    ToolShapes
} from "../toolbar/ToolComponents"
import DragAndDropTool from "../toolbar/ DragAndDropTool";
import ScratchingEraserCanvas from "../toolbar/ScratchingEraserCanvas";
import KeyEventListener from "../toolbar/KeyEventListener";
import Selection from "../toolbar/Selection";
import { ToolText } from "../toolbar/ToolText";
import Cursors from "../toolbar/Cursors";
import Text from "./Text"; 
import { useToolContext } from "@/context/ToolContext";

const icons = [
    { type: "image", src: "/images/sample-icon.png" },
    { type: "icon", label: "⭐" },
    { type: "icon", label: "🔥" },
];

// Main Component: ConfigureTools
export const ConfigureTools = ({
    tool,
    brushSize,
    brushColor,
    eraserSize,
    fabricCanvas,
    setMenuVisible,
    setMenuPosition,
    loopPathRef,
    setLoopPoints,
    setSelectedTool,
    saveLayerContent
}: ConfigureToolsProps) => {
    const {setPrevSelectedTool,prevselectedTool}= useToolContext()

    useEffect(() => {
       if(tool){
        setPrevSelectedTool(tool)
        console.log("At the point changes the tools with prev ",tool)
       }
       if(tool === "pen"){
        // setSelectedTool(null)
       }
        const canvasWrapper = document.getElementById("canvas-wrapper");
        // console.log(fabricCanvas.current)

        // If canvasWrapper is null, return early
        if (!canvasWrapper) return;

        // Now TypeScript knows canvasWrapper is an HTMLElement
        (canvasWrapper as HTMLElement).style.pointerEvents = "auto";
    }, [tool]);


    return (
        <>
            <ToolResetCanvas fabricCanvas={fabricCanvas} />

            <KeyEventListener fabricCanvas={fabricCanvas} />
            <Cursors fabricCanvas={fabricCanvas}/>
            
            {tool === "pen" || tool === "highlighter" ? (
                <>
                    <ToolDrawing
                        tool={tool}
                        brushSize={brushSize}
                        brushColor={brushColor}
                        fabricCanvas={fabricCanvas}
                        includeId={true}
                    />


                </>
            ) : null}

            {tool === "circle" || tool === "square" || tool === "hexagon" || tool === "star" || tool === "line" || tool === "triangle" ? (
                <ToolShapes
                    tool={tool}
                    fabricCanvas={fabricCanvas}
                    setSelectedTool={setSelectedTool}
                />
            ) : null}

            {(tool === "pen" || prevselectedTool==="pen") && (
                <>
                    <PathCreatedHandler
                        fabricCanvas={fabricCanvas}
                        setLoopPoints={setLoopPoints}
                        setMenuPosition={setMenuPosition}
                        setMenuVisible={setMenuVisible}
                        loopPathRef={loopPathRef}
                        saveLayerContent={saveLayerContent}
                    />

                    {/* <ScratchingEraserCanvas fabricCanvas={fabricCanvas.current} singleStrokeErase={false} /> */}

                </>

            )}

            {tool === "rectangleSelection" && (
                <Selection
                    fabricCanvas={fabricCanvas}
                />
            )}
            {tool === "texthighlighter" && (
                // <TextHighlighter
                //     fabricCanvas={fabricCanvas}
                // />
                <Text fabricCanvas={fabricCanvas}/>
            )}

            {(tool === "objectEraser" || tool === "pixelEraser") && (
                <>
                    <ScratchingEraserCanvas fabricCanvas={fabricCanvas.current} singleStrokeErase={tool === "pixelEraser" ? false : true} />
                    <ToolDrawing
                        tool={"highlighter"}
                        brushSize={brushSize}
                        brushColor={tool !== "pixelEraser" ? brushColor : "white"}
                        fabricCanvas={fabricCanvas}
                        includeId={false}
                    />

                </>
            )}



            {tool === "text" && (
                <>

                    <ToolText
                        fabricCanvas={fabricCanvas}
                        textColor="#000000"
                        fontSize={16}
                        fontFamily="Arial"
                        setSelectedTool={setSelectedTool}
                    />


                </>
            )}




        </>
    );
};

