import React, { useCallback, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { CanvasEventListeners } from './ToolShapes';
import { useToolContext } from '@/context/ToolContext';
import html2canvas from 'html2canvas';
import { useCanvas } from '@/context/CanvasContext';
import { useSettings } from '@/context/SettingsContext';
import { v4 as uuidv4 } from "uuid";
import { CustomFabricObject } from '@/types/pdf';
const Selection = ({
    fabricCanvas
}: {
    fabricCanvas: React.MutableRefObject<fabric.Canvas | null>
}) => {
    const [screenShots, setScreenShots] = useState<fabric.Object[]>([])
    const { setSelectedTool } = useToolContext()
    const { handleCanvasChange } = useCanvas()
    let isDrawingShape = false;
    let rectangle = null
    let shape: fabric.Object | null = null;
    let startX = 0,
        startY = 0;
    const { setfirst, currentPage } = useSettings()

    useEffect(() => {
        if (!fabricCanvas.current) return
        fabricCanvas.current.isDrawingMode = false
    }, [fabricCanvas, currentPage])

    const createShape = useCallback(
        (pointer: fabric.Point, options: any) => {
            const roundedBorder = 10;

            rectangle = new fabric.Rect({
                ...options,
                width: 100,  // Set desired width
                height: 100, // Set desired height
                fill: 'rgba(0, 0, 255, 0.1)', // Transparent blue fill
                stroke: 'blue',  // Blue border color
                strokeWidth: 2,  // Border thickness
                selectable: true, // To prevent the rectangle from being selected
                hasControls: false, // Disable resizing controls
                hasBorders: false, // Disable default borders
            });



            // Animation function for border
            // function animateBorder() {
            //     rectangle.animate('strokeWidth', 5, {
            //         duration: 500,
            //         onChange: rectangle.canvas.renderAll.bind(rectangle.canvas),
            //         onComplete: () => {
            //             rectangle.animate('strokeWidth', 2, {
            //                 duration: 500,
            //                 onChange: rectangle.canvas.renderAll.bind(rectangle.canvas),
            //                 onComplete: animateBorder, // Repeat the animation
            //             });
            //         }
            //     });
            // }
            // animateBorder()
            return rectangle

        },
        []
    );
    const handleHover = (event: "leave" | "enter") => {

        const canvasElement = fabricCanvas.current?.lowerCanvasEl;
        // console.log(canvasElement.classList.add("interactiveLayer"))
        if (!canvasElement) return
        if (event == "enter") {
            canvasElement.classList.add("interactiveLayer")
        } else {
            canvasElement.classList.remove("interactiveLayer")
        }
    }

    const onMouseDown = useCallback(
        (event: fabric.IEvent) => {
            if (!fabricCanvas.current) return;
            const canvas = fabricCanvas.current;
            canvas.isDrawingMode = false
            const pointer = canvas.getPointer(event.e);
            startX = pointer.x;
            startY = pointer.y;

            isDrawingShape = true;
            const options = {
                left: startX,
                top: startY,
                fill: 'transparent',
                stroke: '#000000',
                strokeWidth: 2,
                originX: 'left',
                originY: 'top',
            };

            shape = createShape(pointer, options);
            if (shape) {
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
            canvas.isDrawingMode = false

            if (shape instanceof fabric.Rect || shape instanceof fabric.Triangle) {
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
        [fabricCanvas]
    );

    const onMouseUp = useCallback(() => {
        isDrawingShape = false;
        shape = null;
        setSelectedTool(null)
        validateAndPrepareCapture("pdf")
        // fabricCanvas.current?.remove(rectangle)
        setfirst(true)
    }, []);


    const validateAndPrepareCapture = async (type: "full" | "pdf") => {
        try {

            const { dataURL, left, top } = await initiateCapture(type);
            // Restore menu and add the linePath back after capture

            handleCanvasChange(0,
                {
                    type: "image",
                    data: dataURL,
                    position: {
                        left: left,
                        top: top,
                    }
                });


        } catch (error) {
            console.error("Error capturing screenshot:", error);
        }
    };

    const initiateCapture = async (type: "full" | "pdf") => {



        const Element: HTMLElement = type === "pdf"
            ? document.getElementById("pdfViewer") as HTMLElement
            : document.getElementById("pdf-container") as HTMLElement;

        // Get the bounding box of the rectangle in the canvas
        const boundingRect = rectangle.getBoundingRect();
        const left = boundingRect.left;
        const top = boundingRect.top + 60;
        const width = boundingRect.width;
        const height = boundingRect.height;

        console.log(`Left: ${left}, Top: ${top}, Width: ${width}, Height: ${height}`);

        try {
            // Capture the screenshot of the area using html2canvas
            const canvasScreenshot = await html2canvas(Element, {
                x: left,
                y: top,
                width: width,
                height: height,
                scrollX: 0,
                scrollY: 0,
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                useCORS: true,
                scale: 1,
            });

            // Convert the captured canvas to a data URL
            const dataURL = canvasScreenshot.toDataURL('image/png');
            return { dataURL, left, top };

        } catch (error) {
            console.error("Error capturing screenshot:", error);
            throw error;
        }
    };


    // useEffect(() => {
    //     if (!fabricCanvas.current) return;
    //     const canvas = fabricCanvas.current;
    //     canvas.on('mouse:move', function (e) {
    //         canvas.setCursor(`url("https://img.icons8.com/?size=20&id=rKqQiYPTkVLU&format=png&color=000000") 1 1, auto`);
    //     });

    //     return () => {
    //         canvas.off("mouse:move")
    //     };
    // }, [currentPage])



    return (
        <CanvasEventListeners
            fabricCanvas={fabricCanvas}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        />
    );
};

export default Selection;


