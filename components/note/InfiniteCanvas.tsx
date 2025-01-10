"use client"
import React, { useEffect, useRef, useState } from 'react'
import { FabricCanvas } from '../canvas/FabricCanvas'
import { TransformWrapper, TransformComponent, MiniMap } from "react-zoom-pan-pinch";
import { useSettings } from '@/context/SettingsContext'
import { useToolContext } from '@/context/ToolContext'
import { Layer, useCanvas } from '@/context/CanvasContext'
import { fabric } from "fabric"
import { scaleStateProps } from '@/types/pdf';
import { Lock, Unlock, Expand } from 'lucide-react';
import { getNoteById, syncNote } from "@/db/note/Note"
import { LayerManagement } from '../canvas/LayerManagement';
import { CanvasLayer } from '../canvas/CanvasLayer';
import { CanvasWrapper } from '../canvas/CanvasWrapper';



const InfiniteCanvas = ({ id }: { id: string }) => {
    const { setcurrentDocumentId } = useSettings()
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


    useEffect(() => {
        setcurrentDocumentId(id)
    }, [id])


    return (
        <div className="border-2 border-gray-300 mt-10 rounded-lg  bg-white overflow-auto scrollbar-hide"
            style={{
                height: 1000, // Infinite or normal height
                width: 2000    // Infinite or normal width
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
                }}
                panning={{
                    allowMiddleClickPan: false,
                    wheelPanning: true,
                    allowLeftClickPan: false,
                    allowRightClickPan: false,

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
                            <TransformComponent >
                                <div className=" notebook   scrollbar-hide"

                                    style={{
                                        height: 1000, // Infinite or normal height
                                        width:2000   // Infinite or normal width
                                    }}
                                >
                                    <CanvasWrapper pageRects={[]} isDrawing={true} type='infinte' />
                                  
                                    {/* <div className="relative " id="canvas-wrapper">
                                       
                                    </div> */}
                                </div>

                            </TransformComponent>


                        </div>


                    </>
                )}

            </TransformWrapper>

            <div className='flex gap-2 flex-col fixed bottom-16 right-8'>
                {/* Infinite Canvas Button */}
                <button
                    // onClick={toggleInfiniteCanvas}
                    className="p-2 bg-gray-700 text-white rounded-full shadow-lg"
                    title="Toggle Infinite Canvas"
                >
                    <Expand size={24} />
                </button>

                {/* Lock Canvas Button */}
                <button
                    // onClick={toggleLockCanvas}
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
