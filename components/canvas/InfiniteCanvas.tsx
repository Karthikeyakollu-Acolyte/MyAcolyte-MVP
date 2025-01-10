"use client"
import React, { useEffect, useRef, useState } from 'react'
import { FabricCanvas } from './FabricCanvas'
import { TransformWrapper, TransformComponent, MiniMap } from "react-zoom-pan-pinch";
import { useSettings } from '@/context/SettingsContext'
import { useToolContext } from '@/context/ToolContext'
import { useCanvas } from '@/context/CanvasContext'
import { fabric } from "fabric"
import { scaleStateProps } from '@/types/pdf';
import { Lock, Unlock, Expand } from 'lucide-react';


const InfiniteCanvas = (props: any) => {
    const { canvasChanges, rect } = useCanvas();
    const [initialContent, setInitialContent] = useState(() => {
        const savedLayers = localStorage.getItem('infinte');
        return savedLayers ? JSON.parse(savedLayers) : [];
    });

    const [isInfinite, setIsInfinite] = useState(false); // For infinite canvas toggle
    const [isLocked, setIsLocked] = useState(false); // For lock functionality
    const { currentPage } = useSettings()
    const [scaleState, setscaleState] = useState<scaleStateProps>(
        {
            positionX: 0,
            positionY: 0,
            previousScale: 1,
            scale: 1,
        })
    // State to manage the content of the canvas (for pushing new content later)
    const [newObject, setNewObject] = useState<any>([]);

    // This will hold the rectangle details for each page
    const [rectangles, setRectangles] = useState(new Map());

    // useEffect(() => {
    //     const combinedContent = []; // Array to store objects in the specified format
    //     let currentTopPosition = 0; // This will track the current top position

    //     // Sort canvasChanges by pageIndex to ensure correct ordering
    //     const sortedPages = [...canvasChanges].sort((a, b) => a.pageIndex - b.pageIndex);

    //     // Loop through each sorted page and calculate position
    //     sortedPages.forEach(({ pageIndex, canvasContent }) => {
    //         const pageWidth = rect.width;
    //         const pageHeight = rect.height;

    //         // Use currentTopPosition to calculate the top position for the page
    //         const pageTopPosition = currentTopPosition;

    //         // Update currentTopPosition by adding the height of the current page and some spacing
    //         currentTopPosition += pageHeight + 10; // 10 is the spacing between pages

    //         // Create a unique objectId for the page
    //         const pageObjectId = generateUniqueId();

    //         const pageRect = new fabric.Rect({
    //             left: 850 - pageWidth,
    //             top: pageTopPosition,
    //             width: pageWidth,
    //             height: pageHeight,
    //             fill: "#ffeb3b", // Background color (similar to sticky notes)
    //             rx: 10, // Rounded corners (horizontal radius)
    //             ry: 10, // Rounded corners (vertical radius)
    //             selectable: true,
    //             shadow: {
    //                 color: "rgba(0,0,0,0.3)",
    //                 blur: 10,
    //                 offsetX: 5,
    //                 offsetY: 5,
    //             },
    //         });

    //         // Add pageRect to combinedContent with objectId and objectJson
    //         combinedContent.push({
    //             objectId: pageObjectId,
    //             objectJson: pageRect.toJSON(),
    //         });

    //         // Adjust object positions within this page and add them to the combined content
    //         canvasContent.objects.forEach((obj) => {
    //             const adjustedObj = {
    //                 ...obj,
    //                 left: obj.left + pageRect.left,
    //                 top: obj.top + pageRect.top,
    //             };


    //             // Generate unique objectId for each object within the page
    //             const objectId = generateUniqueId();

    //             combinedContent.push({
    //                 objectId: objectId,
    //                 objectJson: adjustedObj,
    //             });
    //         });
    //     });

    //     console.log(combinedContent);
    //     // setInitialContent(combinedContent)
    //     // syncToStorage(combinedContent)
    // }, [canvasChanges]);

    // Helper function to generate a unique ID for objects




    const syncToStorage = (layers?: any) => {
        localStorage.setItem('infinte', JSON.stringify(layers));
    }

    const getVisibleContent = () => {
        if (isInfinite) {
            return initialContent; // Render all pages in infinite view
        } else {
            const firstPage = canvasChanges[currentPage - 1]; // Render only the current page in non-infinite view
            if (!firstPage) return { objects: [] }; // Fallback if no content exists for the page

            // Adjust object positions for the current page
            const adjustedObjects = firstPage.canvasContent.objects.map((obj: any) => ({
                ...obj,
                top: obj.top, // Keep top position as is
                left: obj.left, // Keep left position as is
            }));
            console.log(adjustedObjects)
            return { adjustedObjects }
        }
    };

    useEffect(() => {
        console.log(initialContent)
        
        if (!canvasChanges?.newObject) return
        setNewObject(canvasChanges?.newObject)

    }, [canvasChanges])

    // Function to toggle canvas size (make it infinite)
    const toggleInfiniteCanvas = () => {
        setIsInfinite(prev => !prev);
        console.log("toggled ")
    };

    // Function to toggle lock state of the canvas
    const toggleLockCanvas = () => {
        setIsLocked(prev => !prev);
    };



    return (
        <div className="border-2 border-gray-300  rounded-lg  relative bg-white overflow-auto scrollbar-hide"
            style={{
                height: rect.height,
                width: rect.width
            }}
        >
            <TransformWrapper
                initialScale={1}
                initialPositionX={0}
                initialPositionY={0}
                maxScale={3}
                minScale={1}
                wheel={{
                    step: 3,
                    wheelDisabled: true,
                    touchPadDisabled: false,
                    smoothStep: 0.03,
                    disabled: isLocked
                }}
                panning={{
                    allowMiddleClickPan: false,
                    wheelPanning: true,
                    allowLeftClickPan: false,
                    allowRightClickPan: false,
                    disabled: !isLocked
                }}
                // onTransformed={(e) => { console.log(e) }}
                limitToBounds={true}
                disablePadding={true}

                pinch={{
                    step: 5
                }}

            // disabled={!isLocked}

            >
                {({ }) => (
                    <>
                        <div >
                            <TransformComponent>
                                <div className="canvas-dotted relative overflow-auto scrollbar-hide"

                                    style={{
                                        height: isInfinite ? (canvasChanges.length * rect.height + 1800) : rect.height * scaleState.scale +1800, // Infinite or normal height
                                        width: isInfinite ? 1500 : rect.width * scaleState.scale +1800,   // Infinite or normal width
                                    }}
                                >
                                    <FabricCanvas
                                        rect={{
                                            height: isInfinite ? (canvasChanges.length * rect.height + 1800) : rect.height * scaleState.scale + 1800, // Infinite or normal height


                                            width: isInfinite ? 1500 : rect.width * scaleState.scale + 1800,   // Infinite or normal width
                                        }}
                                        index={-1}
                                        pageIndex={-1}
                                        isDrawing={true}
                                        saveLayerContent={(objectContent) => {
                                            console.log("Saving object content", objectContent);
                                            // setInitialContent(objectContent);
                                            // syncToStorage(objectContent)

                                        }}
                                        initialContent={initialContent}
                                        // scaleState={scaleState}
                                        // newObject={newObject}
                                    />

                                </div>

                            </TransformComponent>


                        </div>


                    </>
                )}

            </TransformWrapper>

            <div className='flex gap-2 flex-col fixed bottom-16 right-8'>
                {/* Infinite Canvas Button */}
                <button
                    onClick={toggleInfiniteCanvas}
                    className="p-2 bg-gray-700 text-white rounded-full shadow-lg"
                    title="Toggle Infinite Canvas"
                >
                    <Expand size={24} />
                </button>

                {/* Lock Canvas Button */}
                <button
                    onClick={toggleLockCanvas}
                    className=" p-2 bg-gray-700 text-white rounded-full shadow-lg"
                    title={isLocked ? "Unlock Canvas" : "Lock Canvas"}
                >
                    {isLocked ? <Unlock size={24} /> : <Lock size={24} />}
                </button>
            </div>

        </div>
    );
};


export default InfiniteCanvas




// useEffect(() => {
//     const combinedContent = { objects: [] };
//     let currentTopPosition = 0; // This will track the current top position

//     // Sort canvasChanges by pageIndex to ensure correct ordering
//     const sortedPages = [...canvasChanges].sort((a, b) => a.pageIndex - b.pageIndex);

//     // Loop through each sorted page and calculate position
//     sortedPages.forEach(({ pageIndex, canvasContent }) => {
//         const pageWidth = rect.width;
//         const pageHeight = rect.height;

//         // Check if the current canvas is the infinite canvas
//         const isInfiniteCanvas = pageIndex === -1;
//         console.log(pageIndex)

//         if (!isInfiniteCanvas) {
//             // Use currentTopPosition to calculate the top position for the page
//             const pageTopPosition = currentTopPosition;

//             // Update currentTopPosition by adding the height of the current page and some spacing
//             currentTopPosition += pageHeight + 10; // 10 is the spacing between pages

//             // Create a rectangle for the page content
//             const pageRect = new fabric.Rect({
//                 left: 0,
//                 top: pageTopPosition, // Use currentTopPosition
//                 width: pageWidth,
//                 height: pageHeight,
//                 fill: 'transparent',
//                 stroke: '#000',
//                 strokeWidth: 2,
//             });

//             // Add the rectangle for this page to the combined content
//             combinedContent.objects.push(pageRect);

//             // Adjust object positions within this page
//             canvasContent.objects.forEach((obj: any) => {
//                 const adjustedObj = {
//                     ...obj,
//                     left: obj.left + pageRect.left,
//                     top: obj.top + pageRect.top,
//                 };
//                 combinedContent.objects.push(adjustedObj);
//             });
//         } else {
//             // For the infinite canvas, add objects without page rectangle logic
//             canvasContent.objects.forEach((obj: any) => {
//                 const adjustedObj = {
//                     ...obj,
//                     left: obj.left, // Infinite canvas uses its own positioning
//                     top: obj.top,
//                 };
//                 combinedContent.objects.push(adjustedObj);
//             });
//         }
//     });

//     setInitialContent(combinedContent);
// }, [canvasChanges]);



// useEffect(() => {
//     const combinedContent = { objects: [] };
//     let currentTopPosition = 0; // This will track the current top position

//     // Sort canvasChanges by pageIndex to ensure correct ordering
//     const sortedPages = [...canvasChanges].sort((a, b) => a.pageIndex - b.pageIndex);

//     // Loop through each sorted page and calculate position
//     sortedPages.forEach(({ pageIndex, canvasContent }) => {
//         const pageWidth = rect.width;
//         const pageHeight = rect.height;

//         // Use currentTopPosition to calculate the top position for the page
//         const pageTopPosition = currentTopPosition;

//         // Update currentTopPosition by adding the height of the current page and some spacing
//         currentTopPosition += pageHeight + 10; // 10 is the spacing between pages

//         // Create a rectangle for the page content
//         const pageRect = new fabric.Rect({
//             left: 0,
//             top: pageTopPosition, // Use currentTopPosition
//             width: pageWidth,
//             height: pageHeight,
//             fill: 'transparent',
//             stroke: '#000',
//             strokeWidth: 2,
//         });

//         // Adjust object positions within this page and add them to the combined content
//         canvasContent.objects.forEach((obj: any) => {
//             const adjustedObj = {
//                 ...obj,
//                 left: obj.left + pageRect.left,
//                 top: obj.top + pageRect.top,
//             };
//             combinedContent.objects.push(adjustedObj);
//         });

//         // Add the rectangle for this page to the combined content
//         combinedContent.objects.push(pageRect);
//     });

//     setInitialContent(combinedContent);

// }, [canvasChanges]);



// useEffect(() => {
//     if (initialContent.objects.length > 0) {
//         console.log("Setting up infinite canvas with combined content");
//     }
// }, [initialContent]);
