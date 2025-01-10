
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
    // const { setNotes } = useSettings()

    // Handle path creation and menu visibility
    useEffect(() => {
        if (!fabricCanvas.current) return;
        const canvas = fabricCanvas.current;

        const handlePathCreated = (e: any) => {
            const path = e.path;
            const points = path.path.map((point: any) => ({ x: point[1], y: point[2] }));

            const loopPoints = findLoop(points);

            if (loopPoints) {
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
            if (loopPath) {
                // loopPath.off('mousedown');
            }
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





// Component: PathCreatedHandler
const Menu: React.FC<{
    menuVisible: boolean;
    menuPosition: { top: number; right: number };
    loopPoints: { x: number; y: number }[];
    setMenuVisible: (visible: boolean) => void;
    fabricCanvas: any;
    linePath: any;
    loopPathRef: any;
    saveLayerContent: any
}> = ({ menuVisible, menuPosition, loopPoints, setMenuVisible, fabricCanvas, linePath, saveLayerContent, loopPathRef }) => {
    const { setSelectedTool } = useToolContext();
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [previewShape, setPreviewShape] = useState<fabric.Object | null>(null); // For the shape preview
    const { setNotes } = useSettings()
    const { rect, handleCanvasChange } = useCanvas();
    const [screenShots, setScreenShots] = useState<fabric.Object[]>([])
    const { setfirst } = useSettings()

    useEffect(() => {
        if (loopPoints) {
            const left = Math.min(...loopPoints.map(p => p.x));
            const top = Math.min(...loopPoints.map(p => p.y));
            const width = Math.max(...loopPoints.map(p => p.x)) - left;
            const height = Math.max(...loopPoints.map(p => p.y)) - top;

            // console.log(`Left: ${left}, Top: ${top}, Width: ${width}, Height: ${height}`);
        }
    }, [loopPoints]);

    const noteId = `${Date.now()}`;
    const newNote: Note = {
        id: noteId,
        position: { top: 0, left: 0 },
        content: "",
        isVisible: true
    }

    useEffect(() => {
        const loopPath = loopPathRef.current;
        // console.log(loopPath)
        if (!loopPath) return;


        // Use Fabric.js event listener for `mousedown`
        loopPath.on('mousedown', () => {
            console.log("loopPath clicked");
            setNotes((prevNotes) => {
                const existingNote = prevNotes.find(note => note.id === newNote.id);

                if (!existingNote) {
                    // Create a new note and set its visibility to true
                    const updatedNote = {
                        ...newNote,
                        isVisible: true,  // Set visibility to true
                    };

                    return [...prevNotes, updatedNote]; // Add the new note to the list
                } else {
                    // If the note already exists, set its visibility to true
                    const updatedNotes = prevNotes.map(note =>
                        note.id === newNote.id ? { ...note, isVisible: true } : note
                    );
                    return updatedNotes; // Return the updated notes array
                }
            });
            // Add any additional logic you want to trigger when the path is clicked
        });

        // Cleanup the event listener when the component unmounts or loopPathRef changes
        return () => {
            if (loopPath) {
                loopPath.off('mousedown');
            }
        };
    }, [loopPathRef, loopPoints]); // Only re-run this effect when loopPathRef changes




    const createShapePreview = (shapeType: string) => {
        if (!loopPoints || loopPoints.length < 2) return;


        // Calculate bounding box for the loop points
        const left = Math.min(...loopPoints.map(p => p.x));
        const top = Math.min(...loopPoints.map(p => p.y));
        const width = Math.max(...loopPoints.map(p => p.x)) - left;
        const height = Math.max(...loopPoints.map(p => p.y)) - top;

        let shape;

        // Create the shape based on the selected type
        if (shapeType === 'circle') {
            const radius = Math.min(width, height) / 2;
            shape = new fabric.Circle({
                left: left + width / 2 - radius,
                top: top + height / 2 - radius,
                radius: radius,
                fill: 'transparent',
                stroke: 'black',
                strokeWidth: 2,
                objectId: uuidv4()
            }as CustomFabricObject<fabric.Circle>);
        } else if (shapeType === 'rectangle' || shapeType === 'square') {
            if (shapeType === 'square') {
                const size = Math.min(width, height);
                shape = new fabric.Rect({
                    left,
                    top,
                    width: size,
                    height: size,
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 2,
                    objectId: uuidv4()
                } as CustomFabricObject<fabric.Rect>);
            } else {
                shape = new fabric.Rect({
                    left,
                    top,
                    width,
                    height,
                    fill: 'transparent',
                    stroke: 'black',
                    strokeWidth: 2,
                    objectId: uuidv4()
                } as CustomFabricObject<fabric.Rect>);
            }
        }

        return shape;
    };

    const handleShapeHover = (shapeType: string) => {
        // Remove preview shape if already exists
        if (previewShape) {
            fabricCanvas.current.remove(previewShape);
        }

        // Create new preview shape and add it to the canvas
        const shape = createShapePreview(shapeType);
        if (shape) {
            setPreviewShape(shape);
            fabricCanvas.current.remove(linePath)
            fabricCanvas.current.add(shape);
            fabricCanvas.current.renderAll(); // Ensure the canvas updates
        }
    };

    const handleShapeLeave = () => {
        // Remove preview shape if already exists
        if (previewShape) {
            fabricCanvas.current.remove(previewShape);
        }

        fabricCanvas.current.add(linePath)
        const updatedContent = fabricCanvas.current.getObjects();
        // saveLayerContent(updatedContent)

        // fabricCanvas.current.renderAll(); 

    };

    const handleShapeClick = (shapeType: string) => {
        // Remove preview shape before adding the actual shape
        if (previewShape) {
            fabricCanvas.current.remove(previewShape);
        }

        // Create and add the actual shape to the canvas
        const shape = createShapePreview(shapeType);
        if (shape) {
            fabricCanvas.current.add(shape);
            // fabricCanvas.current.remove(loopPathData)

            fabricCanvas.current.remove(loopPathRef.current); // Remove the line path
            // fabricCanvas.current.renderAll();
            setMenuVisible(false)
            const updatedContent = fabricCanvas.current.getObjects();
            // saveLayerContent(updatedContent)
        }
    };



    function selectObjectsInLoop() {
        // Disable the drawing tool (assuming you have a way to toggle it)
        let canvas = fabricCanvas.current
        canvas.isDrawingMode = false;
        canvas.remove(linePath);

        // Calculate the bounding box of the loop
        const left = Math.min(...loopPoints.map(p => p.x));
        const top = Math.min(...loopPoints.map(p => p.y));
        const width = Math.max(...loopPoints.map(p => p.x)) - left;
        const height = Math.max(...loopPoints.map(p => p.y)) - top;

        // Create a bounding rectangle for the loop
        const boundingRect = {
            left: left,
            top: top,
            right: left + width,
            bottom: top + height,
        };

        // Find all objects within the bounding box
        const objectsInsideLoop = canvas.getObjects().filter(obj => {
            const objBounds = obj.getBoundingRect(true);

            // Check if the object is completely within the bounding box
            return (
                objBounds.left >= boundingRect.left &&
                objBounds.top >= boundingRect.top &&
                objBounds.left + objBounds.width <= boundingRect.right &&
                objBounds.top + objBounds.height <= boundingRect.bottom
            );
        });
        fabricCanvas.current.remove(loopPathRef.current)
        // Select the objects inside the loop
        canvas.discardActiveObject(); // Clear any existing selection
        if (objectsInsideLoop.length > 0) {
            const selection = new fabric.ActiveSelection(objectsInsideLoop, {
                canvas: canvas,
            });
            canvas.setActiveObject(selection);
        }

        canvas.requestRenderAll(); // Update the canvas
    }



    const validateAndPrepareCapture = async (type: "full" | "pdf") => {
        if (!loopPoints || loopPoints.length === 0) {
            console.error("No loop points found for capturing screenshot.");
            return;
        }

        try {
            const canvasElement = fabricCanvas.current.lowerCanvasEl;
            const pageIndex = canvasElement.getAttribute('data-page-index');

            setMenuVisible(false);
            fabricCanvas.current.remove(linePath);

            const { dataURL, left, top } = await initiateCapture(type);

            // Restore menu and add the linePath back after capture
            setMenuVisible(true);
            fabricCanvas.current.add(linePath);

            // Create fabric image from the captured data URL
            fabric.Image.fromURL(dataURL, (img) => {
                img.set({
                    left: left,
                    top: top,
                    scaleX: 1,
                    scaleY: 1,
                });

                // Batch state updates for performance
                setScreenShots((prev) => {
                    const updatedShots = [...prev, img];
                    const serializedScreenShots = updatedShots.map((shot) => shot.toJSON());

                    // Trigger any necessary side effects after state update

                    return updatedShots;
                });

                handleCanvasChange(pageIndex, img.toJSON(), { width: rect?.width, height: rect?.height });
                setfirst(true)


            });
        } catch (error) {
            console.error("Error capturing screenshot:", error);
        }
    };

    const initiateCapture = async (type: "full" | "pdf") => {
        const Element: HTMLElement = type === "pdf"
            ? document.getElementById("pdfViewer") as HTMLElement
            : document.getElementById("pdf-container") as HTMLElement;

        // Calculate bounding box dimensions
        const left = Math.min(...loopPoints.map(p => p.x));
        const top = Math.min(...loopPoints.map(p => p.y));
        const right = Math.max(...loopPoints.map(p => p.x));
        const bottom = Math.max(...loopPoints.map(p => p.y));

        const width = right - left;
        const height = bottom - top;

        console.log(`Left: ${left}, Top: ${top}, Width: ${width}, Height: ${height}`);

        try {
            // Capture the region using html2canvas
            const canvas = await html2canvas(Element, {
                x: left,
                y: top,
                width,
                height,
                scrollX: 0,
                scrollY: 0,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                useCORS: true,
                scale: 1, // Increase scale for better resolution if needed
            });

            // Create a new canvas for masking
            const maskedCanvas = document.createElement('canvas');
            maskedCanvas.width = width * 2; // Match scaling factor
            maskedCanvas.height = height * 2;

            const maskedCtx = maskedCanvas.getContext('2d');
            if (!maskedCtx) throw new Error("Failed to create canvas context.");

            // Define and apply the clipping path
            maskedCtx.beginPath();
            maskedCtx.moveTo((loopPoints[0].x - left) * 2, (loopPoints[0].y - top) * 2); // Adjust for scale
            loopPoints.forEach(p =>
                maskedCtx.lineTo((p.x - left) * 2, (p.y - top) * 2)
            );
            maskedCtx.closePath();
            maskedCtx.clip();

            // Draw the captured canvas onto the clipped canvas
            maskedCtx.drawImage(canvas, 0, 0, maskedCanvas.width, maskedCanvas.height);

            // Export the masked region as a Data URL
            const dataURL = maskedCanvas.toDataURL('image/png');
            return { dataURL, left, top };
        } catch (error) {
            console.error("Error capturing screenshot:", error);
            throw error;
        }
    };




    // const initiateCapture = (type: "full" | "pdf") => {
    //     const Element: HTMLElement = type === "pdf"
    //         ? document.getElementById("pdfViewer") as HTMLElement
    //         : document.getElementById("pdf-container") as HTMLElement;

    //     const left = Math.min(...loopPoints.map(p => p.x)) - 20;
    //     const top = Math.min(...loopPoints.map(p => p.y)) - 20;
    //     const right = Math.max(...loopPoints.map(p => p.x)) + 20;
    //     const bottom = Math.max(...loopPoints.map(p => p.y)) + 20;

    //     const width = right - left;
    //     const height = bottom - top;

    //     console.log(`Left: ${left}, Top: ${top}, Width: ${width}, Height: ${height}`);

    //     html2canvas(Element, {
    //         x: left,
    //         y: top,
    //         width,
    //         height,
    //         scrollX: 0,
    //         scrollY: 0,
    //         windowWidth: window.innerWidth,
    //         windowHeight: window.innerHeight,
    //         useCORS: true,
    //         scale: 1,
    //     }).then(canvas => {
    //         // Create a new canvas to apply the custom clipping path
    //         const maskedCanvas = document.createElement('canvas');
    //         const maskedCtx = maskedCanvas.getContext('2d');

    //         if (maskedCtx) {
    //             maskedCanvas.width = canvas.width;
    //             maskedCanvas.height = canvas.height;

    //             // Define the clipping path (loop shape) using your loop points
    //             maskedCtx.beginPath();

    //             // Adjust the points to align with the captured area
    //             maskedCtx.moveTo(loopPoints[0].x - left, loopPoints[0].y - top);
    //             loopPoints.forEach(p => {
    //                 maskedCtx.lineTo(p.x - left, p.y - top); // Subtract left and top here
    //             });

    //             maskedCtx.closePath();
    //             maskedCtx.clip(); // This applies the custom clip based on the loop shape

    //             // Draw the screenshot on the masked canvas
    //             maskedCtx.drawImage(canvas, 0, 0);

    //             // Convert the masked canvas to an image
    //             const dataURL = maskedCanvas.toDataURL('image/png');
    //             const img = document.createElement('img');
    //             img.classList.add("z-999", "absolute", "top-0", "right-0");
    //             img.src = dataURL;
    //             img.style.border = '2px solid white';

    //             // setNotes((prevNotes) => [
    //             //     ...prevNotes,
    //             //     { ...newNote, content: dataURL, position: { top: top, left: left } }
    //             // ]);

    //             // document.body.appendChild(img);
    //             return dataURL
    //         }
    //     }).catch((error) => {
    //         console.error("Error capturing screenshot: ", error);
    //     });
    // };




    return (
        menuVisible && (
            <div
                style={{
                    position: 'absolute',
                    top: menuPosition.top,
                    left: menuPosition.right,
                    backgroundColor: 'white',
                }}
                className="rounded-md"
            >
                <ul className="flex space-x-2">
                    <li>
                        <button onClick={() => { validateAndPrepareCapture("full"); }}>
                            <Images  className="h-6 w-6 text-blue-600" />
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { validateAndPrepareCapture("pdf"); }}>
                            <Image className="h-6 w-6 text-pink-600" />
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { selectObjectsInLoop() }}>
                            <Dice5 className="h-6 w-6 text-pink-600" />
                        </button>
                    </li>
                    <li>
                        <div className="flex space-x-4">
                            <button
                                onMouseEnter={() => handleShapeHover("circle")}
                                onClick={() => handleShapeClick("circle")}
                                onMouseLeave={() => { handleShapeLeave() }}
                            >
                                <Circle className="h-6 w-6 text-pink-600" />
                            </button>
                            <button
                                onMouseEnter={() => handleShapeHover("square")}
                                onClick={() => handleShapeClick("square")}
                                onMouseLeave={() => { handleShapeLeave() }}
                            >
                                <Square className="h-6 w-6 text-blue-600" />
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        )
    );
};

