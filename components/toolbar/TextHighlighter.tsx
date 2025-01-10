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
    const { setfirst } = useSettings()

    const saveLayerContent = useCallback(
        (layerIndex: number | string, content: Object) => {
            setNotes((prevLayers) => {
                return prevLayers.map((layer) => {
                    // If the current layer's index matches the given layerIndex, update the content
                    if (layer.id === layerIndex) {
                        return {
                            ...layer, // Spread the existing layer properties
                            content: content, // Update the content with the new one
                        };
                    }
                    return layer; // Return the layer as is if the index doesn't match
                });
            });
        },
        []
    );

    const applyStyle = (
        style: "highlight" | "underline" | "strikeout" | "squiggly" | "clickable" | "canvas"
    ) => {

        console.log("applying styles")
        const canvas = fabricCanvas.current;
        const selection = window.getSelection();
        console.log(selection, canvas, selectedTextLocal)
        if (!selection || !canvas) return;
        // if (!selection || !canvas || !selectedTextLocal) return;
        const range = selection.getRangeAt(0);
        const clientRects = range.getClientRects();
        const canvasWrapper = document.getElementById("canvas-wrapper");

        if (!canvasWrapper) return;
        canvasWrapper.style.pointerEvents = "none";
        const canvasPosition = canvasWrapper.getBoundingClientRect();
        const canvasElement = fabricCanvas.current?.lowerCanvasEl;
        canvasElement.classList.remove("interactiveLayer")


        Array.from(clientRects).slice(0, 1).forEach((rect) => {
            const adjustLeft = rect.left - canvasPosition.left - 10;
            const adjustTop = rect.top - canvasPosition.top;

            switch (style) {
                case "highlight":
                    console.log("applying highlight")
                    const highlightRect = new fabric.Rect({
                        left: adjustLeft,
                        top: adjustTop,
                        width: rect.width,
                        height: rect.height,
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
                        [adjustLeft, adjustTop + rect.height - 1, adjustLeft + rect.width, adjustTop + rect.height - 1],
                        {
                            stroke: "black",
                            strokeWidth: 1,
                            selectable: false,
                            evented: false,
                            objectId: uuidv4()
                        } as CustomFabricObject<fabric.Line>
                    );
                    canvas.add(underline);
                    break;

                case "strikeout":
                    const strikeout = new fabric.Line(
                        [adjustLeft, adjustTop + rect.height - 10, adjustLeft + rect.width, adjustTop + rect.height - 10],
                        {
                            stroke: "red",
                            strokeWidth: 1,
                            selectable: false,
                            evented: false,
                            objectId: uuidv4()
                        } as CustomFabricObject<fabric.Line>
                    );
                    canvas.add(strikeout);
                    break;

                case "squiggly":
                    const amplitude = 3;
                    const wavelength = 6;
                    let pathData = `M ${adjustLeft} ${adjustTop + rect.height - 2}`;

                    for (let x = adjustLeft; x <= adjustLeft + rect.width; x += wavelength) {
                        pathData += ` q ${wavelength / 4} ${-amplitude}, ${wavelength / 2} 0 t ${wavelength / 2} 0`;
                    }

                    const squigglyLine = new fabric.Path(pathData, {
                        stroke: "blue",
                        strokeWidth: 1,
                        fill: "",
                        selectable: false,
                        evented: false,
                        objectId: uuidv4()
                    } as CustomFabricObject<fabric.Line>);

                    canvas.add(squigglyLine);
                    console.log("added to canvas")
                    break;

                case "clickable":
                    const noteId = `${Date.now()}`; // Unique ID for both clickableRect and newNote
                    const clickableRect = new fabric.Rect({
                        left: adjustLeft,
                        top: adjustTop,
                        width: rect.width,
                        height: rect.height,
                        fill: "lightgreen",
                        opacity: 0.4,
                        selectable: true,
                        evented: true,
                    });

                    const newNote: Note = {
                        id: noteId,
                        position: { top: adjustLeft, left: adjustTop },
                        content: selectedText,
                        isVisible: true
                    };
                    // setNotes((prevNotes) => [...prevNotes, newNote]);
                    const width = fabricCanvas.current?.getWidth();
                    const height = fabricCanvas.current?.getHeight();
                    // setScreenShots((prev) => {
                    //     const width = fabricCanvas.current?.getWidth();
                    //     const height = fabricCanvas.current?.getHeight();

                    //     const updatedShots = [...prev, highlightedText];
                    //     const serializedScreenShots = updatedShots.map((shot) => shot.toJSON());

                    //     // Trigger any necessary side effects after state update
                    //     // handleCanvasChange(currentPage, serializedScreenShots, { width: width, height: height });
                    //     return updatedShots;
                    // });

                    const highlightedText = new fabric.IText(selectedText, {
                        left: adjustLeft, // Same `left` as the rectangle
                        top: adjustTop,   // Same `top` as the rectangle
                        fontSize: fontSize,     // Adjust font size as needed
                        fill: "black",    // Text color
                        selectable: true,
                        evented: true,
                    });

                    handleCanvasChange(currentPage, {
                        type: "text",
                        data: selectedText,
                        position: {
                            left: adjustLeft, // Same `left` as the rectangle
                            top: adjustTop,   // Same `top` as the rectangle
                            fontSize: fontSize,     // Adjust font size as needed
                            fill: "black",    // Text color
                            selectable: true,
                            evented: true,
                            // objectId: uuidv4(),
                        }

                    });
                    setfirst(true)

                    // clickableRect.on("mousedown", () => {
                    //     setNotes((prevNotes) => {
                    //         const existingNote = prevNotes.find(note => note.id === newNote.id);

                    //         if (!existingNote) {
                    //             // Create a new note and set its visibility to true
                    //             const updatedNote = {
                    //                 ...newNote,
                    //                 isVisible: true,  // Set visibility to true
                    //             };

                    //             return [...prevNotes, updatedNote]; // Add the new note to the list
                    //         } else {
                    //             // If the note already exists, set its visibility to true
                    //             const updatedNotes = prevNotes.map(note =>
                    //                 note.id === newNote.id ? { ...note, isVisible: true } : note
                    //             );
                    //             return updatedNotes; // Return the updated notes array
                    //         }
                    //     });



                    // });



                    // clickableRect.on("removed", () => {
                    //     console.log("Highlight deleted:", clickableRect);
                    // });

                    // canvas.on("mousedown", () => {
                    //     setNotes((prevNotes) =>
                    //         prevNotes.map((note) => ({
                    //             ...note,
                    //             visible: false, // Set visible to false
                    //         }))
                    //     );
                    // });

                    // canvas.on("removed", () => {

                    // });

                    // canvas.add(clickableRect);

                    break;

                case "canvas":

                    break;

            }
        });

        canvas.renderAll();
        window.getSelection()?.removeAllRanges();
        setToolbarPosition(null);
        setSelectedText("")
        // setSelectedTextLocal(null);
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
