"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Highlighter, Underline, Strikethrough, WavesIcon, MousePointerClick, Notebook } from "lucide-react"; // Add MousePointerClick icon
import { useSettings } from "@/context/SettingsContext";
import { CustomFabricObject, Note } from '@/types/pdf';
import { useCanvas } from "@/context/CanvasContext";
import { v4 as uuidv4 } from "uuid";
interface TextHighlighterProps {
    fabricCanvas: React.MutableRefObject<fabric.Canvas | null>;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({ fabricCanvas }) => {
    const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
    const [selectedTextLocal, setSelectedTextLocal] = useState<string | null>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    let canvasWrapper: any = null;
    const { setNotes, setSelectedText, selectedText, currentPage } = useSettings()
    const { rect, handleCanvasChange } = useCanvas();
    const [screenShots, setScreenShots] = useState<fabric.Object[]>([])
    const [fontSize, setfontSize] = useState<number>(1)
    const { setfirst,scale } = useSettings()

    const applyStyle = (
        style: "highlight" | "underline" | "strikeout" | "squiggly" | "clickable" | "canvas"
    ) => {
        const canvas = fabricCanvas.current;
        const selection = window.getSelection();
        if (!selection || !canvas) return;
    
        const range = selection.getRangeAt(0);
        const pdfContainer = document.querySelector(`[data-page-number="${currentPage}"]`);
        const textLayer = pdfContainer?.querySelector('.textLayer');
        if (!textLayer || !pdfContainer) return;
    
        // Get all the scaling factors
        const canvasWrapper = document.getElementById("canvas-wrapper");
        if (!canvasWrapper) return;
    
        const pdfScale = parseFloat(pdfContainer.style.transform?.match(/scale\((.*?)\)/)?.[1] || "1");
        const canvasZoom = canvas.getZoom();
        
        // Get the computed style to check for any additional transforms
        const containerStyle = window.getComputedStyle(pdfContainer);
        const matrix = new DOMMatrix(containerStyle.transform);
        const containerScale = matrix.a; // Gets the X scale factor from the transform matrix
    
        // Calculate the total scaling factor
        const totalScale = pdfScale * canvasZoom * containerScale;
    
        canvasWrapper.style.pointerEvents = "none";
        const canvasPosition = canvasWrapper.getBoundingClientRect();
        const textLayerPosition = textLayer.getBoundingClientRect();
        const pdfContainerPosition = pdfContainer.getBoundingClientRect();
    
        const canvasElement = fabricCanvas.current?.lowerCanvasEl;
        canvasElement.classList.remove("interactiveLayer");
    
        // Function to calculate adjusted position
        const calculateAdjustedPosition = (rect: DOMRect) => {
            // Get the position relative to the PDF container
            const relativeLeft = (rect.left - pdfContainerPosition.left) / totalScale;
            const relativeTop = (rect.top - pdfContainerPosition.top) / totalScale;
    
            // Adjust for canvas position
            const adjustLeft = relativeLeft;
            const adjustTop = relativeTop;
    
            return {
                left: adjustLeft,
                top: adjustTop,
                width: rect.width / totalScale,
                height: rect.height / totalScale
            };
        };
    
        // Get all text nodes within the selection
        const walker = document.createTreeWalker(
            textLayer,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const nodeRange = document.createRange();
                    nodeRange.selectNodeContents(node);
                    return range.intersectsNode(node) 
                        ? NodeFilter.FILTER_ACCEPT 
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );
    
        const selectedNodes = [];
        let node;
        while (node = walker.nextNode()) {
            selectedNodes.push(node);
        }
    
        // Process each text node
        selectedNodes.forEach(textNode => {
            const nodeRange = document.createRange();
            nodeRange.selectNodeContents(textNode);
            
            if (textNode === range.startContainer) {
                nodeRange.setStart(textNode, range.startOffset);
            }
            if (textNode === range.endContainer) {
                nodeRange.setEnd(textNode, range.endOffset);
            }
    
            const clientRects = nodeRange.getClientRects();
    
            Array.from(clientRects).forEach((rect) => {
                const { left: adjustLeft, top: adjustTop, width: adjustedWidth, height: adjustedHeight } 
                    = calculateAdjustedPosition(rect);
    
                switch (style) {
                    case "highlight":
                        const highlightRect = new fabric.Rect({
                            left: adjustLeft,
                            top: adjustTop,
                            width: adjustedWidth,
                            height: adjustedHeight,
                            fill: "yellow",
                            opacity: 0.4,
                            selectable: false,
                            evented: false,
                            globalCompositeOperation: "multiply",
                            objectId: uuidv4()
                        } as CustomFabricObject<fabric.Rect>);
                        canvas.add(highlightRect);
                        break;
    
                    case "underline":
                        const underline = new fabric.Line(
                            [adjustLeft, adjustTop + adjustedHeight,
                             adjustLeft + adjustedWidth, adjustTop + adjustedHeight],
                            {
                                stroke: "black",
                                strokeWidth: 1 / totalScale,
                                selectable: false,
                                evented: false,
                                objectId: uuidv4()
                            } as CustomFabricObject<fabric.Line>
                        );
                        canvas.add(underline);
                        break;
    
                    case "strikeout":
                        const strikeout = new fabric.Line(
                            [adjustLeft, adjustTop + (adjustedHeight/2),
                             adjustLeft + adjustedWidth, adjustTop + (adjustedHeight/2)],
                            {
                                stroke: "red",
                                strokeWidth: 1 / totalScale,
                                selectable: false,
                                evented: false,
                                objectId: uuidv4()
                            } as CustomFabricObject<fabric.Line>
                        );
                        canvas.add(strikeout);
                        break;
    
                    case "squiggly":
                        const amplitude = 2 / totalScale;
                        const wavelength = 4 / totalScale;
                        let pathData = `M ${adjustLeft} ${adjustTop + adjustedHeight - (2/totalScale)}`;
    
                        for (let x = adjustLeft; x <= adjustLeft + adjustedWidth; x += wavelength) {
                            pathData += ` q ${wavelength/4} ${-amplitude}, ${wavelength/2} 0 t ${wavelength/2} 0`;
                        }
    
                        const squigglyLine = new fabric.Path(pathData, {
                            stroke: "blue",
                            strokeWidth: 1 / totalScale,
                            fill: "",
                            selectable: false,
                            evented: false,
                            objectId: uuidv4()
                        } as CustomFabricObject<fabric.Path>);
                        canvas.add(squigglyLine);
                        break;
    
                    case "clickable":
                        handleCanvasChange(currentPage, {
                            type: "text",
                            data: selectedText,
                            position: {
                                left: adjustLeft,
                                top: adjustTop,
                                fontSize: (fontSize / totalScale),
                                fill: "black",
                                selectable: true,
                                evented: true,
                            }
                        });
                        setfirst(true);
                        break;
                }
            });
        });
    
        canvas.renderAll();
        window.getSelection()?.removeAllRanges();
        setToolbarPosition(null);
        setSelectedText("");
    };

    useEffect(() => {
        canvasWrapper = document.getElementById("canvas-wrapper");

        const mainDiv = document.getElementById("pdfViewer");

        if (!canvasWrapper || !fabricCanvas.current) return;
        const canvasElement = fabricCanvas.current.lowerCanvasEl;
        const pageIndex = canvasElement.getAttribute('data-page-index');
        if (!(pageIndex == currentPage)) return


        canvasWrapper.style.pointerEvents = "none";
        mainDiv?.classList.add("overflow-hidden")

        const handleMouseUp = () => {


            const selection: any = window.getSelection();
            const text = selection?.toString().trim();
            console.log(text)
            canvasWrapper.style.pointerEvents = "auto";

            if (text) {
                // Set the selected text in local storage or state
                setSelectedTextLocal(text);
                setSelectedText(text);




                // Get the range of the selected text
                const range = selection.getRangeAt(0);
                const rects = range.getClientRects();
                const lastRect = rects[rects.length - 1];
                const canvasPosition = canvasWrapper.getBoundingClientRect();

                // Get the font size of the selected text
                const selectedElement = range.startContainer.parentElement;
                const computedStyle = window.getComputedStyle(selectedElement);
                const fontSizeString = computedStyle.fontSize;

                setfontSize(parseFloat(fontSizeString))



                // Calculate the position for the toolbar based on the selected text position
                if (lastRect) {
                    setToolbarPosition({
                        top: lastRect.bottom - canvasPosition.top,
                        left: lastRect.right - canvasPosition.left,
                    });


                } else {
                    setToolbarPosition(null);
                }
                // applyStyle("highlight")
            }

            else {
                setToolbarPosition(null);
                setSelectedTextLocal(null);
            }
        };

        mainDiv?.addEventListener("mouseup", handleMouseUp);


        return () => {
            mainDiv?.removeEventListener("mouseup", handleMouseUp);
        };
    }, [fabricCanvas]);




    const handleHover = (event: "leave" | "enter") => {

        const canvasElement = fabricCanvas.current?.lowerCanvasEl;
        if (!canvasElement) return
        if (event == "enter") {
            canvasElement.classList.add("interactiveLayer")
        } else {
            canvasElement.classList.remove("interactiveLayer")
        }
    }

    return (
        <>
            {toolbarPosition && (
                <div
                    ref={toolbarRef}
                    className={`absolute cursor-pointer bg-white border shadow-md p-2 flex space-x-2 z-9999`}
                    style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
                >
                    <button className="p-1 hover:bg-gray-200" onClick={() => applyStyle("highlight")}>
                        <Highlighter size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200" onClick={() => applyStyle("underline")}>
                        <Underline size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200" onClick={() => applyStyle("strikeout")}>
                        <Strikethrough size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200" onClick={() => applyStyle("squiggly")}>
                        <WavesIcon size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200"

                        onClick={() => applyStyle("clickable")}
                        onMouseEnter={() => { handleHover("enter") }}
                        onMouseLeave={() => { handleHover("leave") }}
                    >
                        <Notebook size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200" onClick={() => applyStyle("canvas")}>
                        <MousePointerClick size={16} />
                    </button>
                </div>
            )}
        </>
    );
};
