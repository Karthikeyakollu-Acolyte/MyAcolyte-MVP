"use client"
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useSettings } from "@/context/SettingsContext";
import type { PDFViewer, EventBus, PDFFindController } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import { useRefs } from "@/context/sharedRefs";
import * as pdfjsLib from "pdfjs-dist"
import { updatePdf } from "@/db/pdf/docs";
import ReactDOM from "react-dom";
import { useCanvas } from "@/context/CanvasContext";

interface PdfViewerProps {
    pdfDocument: PDFDocumentProxy;
    pdfScaleValue?: number;
    onPagesRendered?: (pageRects: DOMRect[]) => void;
    containerNodeRef:LegacyRef<HTMLDivElement>;
    isZoomEnable:boolean;
}

export const PdfViewerComponent: React.FC<PdfViewerProps> = ({
    pdfDocument,
    pdfScaleValue,
    onPagesRendered,
    containerNodeRef,
    isZoomEnable
    
}) => {
    // const containerNodeRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<PDFViewer | null>(null);
    const pdfViewerInitialized = useRef(false);
    const searchResultsRef = useRef<any[]>([]);


    const findControllerRef = useRef<PDFFindController | null>(null);
    const initialPageDimensions = useRef<{ width: number, height: number } | null>(null); // Store initial page dimensions


    let eventBus: EventBus | undefined;
    const { setPdfViewerRef } = useRefs();
    const {setCurrentPage, setPages, scrollMode,scale,currentPage,currentDocumentId,setScale,isInfinite } = useSettings();
    const {setContainerWidth} = useCanvas()

    const initPDFViewer = async () => {
        const pdfjs = await import("pdfjs-dist/web/pdf_viewer.mjs");
        const eventBus = new pdfjs.EventBus();
        const linkService = new pdfjs.PDFLinkService();
    
        findControllerRef.current = new pdfjs.PDFFindController({
            linkService,
            eventBus,
        });
    
        if (!containerNodeRef.current) {
            throw new Error("Container reference is missing!");
        }
    
        if (!viewerRef.current) {
            viewerRef.current = new pdfjs.PDFViewer({
                container: containerNodeRef.current,
                eventBus,
                textLayerMode: 2,
                removePageBorders: false,
                findController: findControllerRef.current,
                linkService,
            });
        }
    
        // Ensure the link service is aware of the PDF viewer
        linkService.setViewer(viewerRef.current);
    
        findControllerRef.current.setDocument(pdfDocument);
        viewerRef.current.setDocument(pdfDocument);
        
        eventBus.on("pagesinit", onPagesInit);

    };
    


const onPagesInit = (e) => {
    const pdfViewer = viewerRef.current;
    const container = containerNodeRef.current;
    if (pdfViewer && container) {
        console.log("Pages initialized!");
        // Store initial page dimensions if not already stored
        if (!initialPageDimensions.current) {
            storeInitialPageDimensions();
        }


        updateScale(); // Adjust the scale

        setPdfViewerRef(viewerRef);
        setPages(pdfViewer.pagesCount);

        // Render page rects initially
        updatePageRects();
    }
};

const storeInitialPageDimensions = () => {
    const pdfViewer = viewerRef.current;
    if (pdfViewer) {
        const firstPage = pdfViewer.getPageView(0); // Get the first page
        if (firstPage) {
            const pageWidth = firstPage.viewport.width;
            const pageHeight = firstPage.viewport.height;

            // Store initial page dimensions
            initialPageDimensions.current = { width: pageWidth, height: pageHeight };
            // console.log('Initial page dimensions stored:', initialPageDimensions.current);
        }
    }
};

const updateScale = () => {
    const pdfViewer = viewerRef.current;
    const container = containerNodeRef.current;
    if (pdfViewer && container && initialPageDimensions.current) {
        const { width: initialPageWidth } = initialPageDimensions.current; // Get stored initial width
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight

        // Calculate new scale based on initial dimensions
        const newScale = containerWidth / initialPageWidth;
        // console.log("Difrence",pdfViewer.currentScale - newScale)
        pdfViewer.currentScale = newScale; // Set the scale for the PDF viewer
       
        setContainerWidth( newScale)

        setScale(newScale); // Store new scale in your state (or ref if needed)
    }
};


useEffect(() => {
    updateScale(); // Update scale on changes to `isInfinite` or any other trigger
}, [isInfinite]);

    // Function: Update page positions
    const updatePageRects = () => {
        const pdfViewer = viewerRef.current;
        if (pdfViewer && onPagesRendered) {
            const pageRects: DOMRect[] = [];
            
            for (let i = 1; i <= pdfViewer.pagesCount; i++) {
                const pageElement = document.querySelector(
                    `[data-page-number="${i}"]`
                ) as HTMLElement;

                if (pageElement) {
                    const rect = pageElement.getBoundingClientRect();
                    pageRects.push(rect);

                }
            }
            onPagesRendered(pageRects);
        }
    };


    // Initialize the PDF viewer only once, based on the component mounting or pdfDocument changing
    useEffect(() => {
        if (!pdfViewerInitialized.current) {
            initPDFViewer().catch((error) =>
                console.error("PDF Viewer initialization failed", error)
            );
            pdfViewerInitialized.current = true; // Mark as initialized
        }
       

    }, [pdfDocument]); // Only run when pdfDocument changes




    useEffect(()=>{
        const pdfViewer = viewerRef.current;
        if (pdfViewer && currentPage) {
            // Set the scale using viewer's API if available
            pdfViewer.currentPageNumber = currentPage;

        }

    },[currentPage])




    return (

              <div className="relative h-full">
                  <div
               
                    ref={containerNodeRef}
                    className="pdf-container w-full scrollbar-hide absolute "
                    id="pdf-container"
                >
                    <div className="pdfViewer  w-full h-full " id="pdfViewer" />
                </div>
              </div>

    );
};


// export const PdfViewerComponent: React.FC<PdfViewerProps> = ({
//     pdfDocument,
//     pdfScaleValue,
//     onPagesRendered,
// }) => {
//     const containerNodeRef = useRef<HTMLDivElement>(null);
//     const viewerRef = useRef<PDFViewer | null>(null);
//     const pdfViewerInitialized = useRef(false); // Using ref to track initialization

//     let eventBus: EventBus | undefined;
//     const { setPdfViewerRef } = useRefs();
//     const { setPages, scrollMode,scrollToPage } = useSettings();

//     // Function: Initialize the PDF viewer
//     const initPDFViewer = async () => {
//         const pdfjs = await import("pdfjs-dist/web/pdf_viewer.mjs");
//         eventBus = new pdfjs.EventBus();

//         if (!containerNodeRef.current) {
//             throw new Error("Container reference is missing!");
//         }

//         if (!viewerRef.current) {
//             viewerRef.current = new pdfjs.PDFViewer({
//                 // viewerRef.current = new pdfjs.PDFSinglePageViewer({
//                 container: containerNodeRef.current,
//                 eventBus,
//                 textLayerMode: 2,
//                 removePageBorders: false,
//                 annotationMode: 1
//             });
//         }

//         // Set up the event listener for `pagesinit`
//         eventBus.on("pagesinit", onPagesInit);
//         viewerRef.current._currentScale = 1.05
//         // viewerRef.current._currentPageNumber=10
       

//         viewerRef.current.setDocument(pdfDocument);
//     };

//     // Function: Handle the `pagesinit` event
//     const onPagesInit = () => {
//         const pdfViewer = viewerRef.current;
//         if (pdfViewer) {
//             console.log("Pages initialized!");
//             setPdfViewerRef(viewerRef);
//             setPages(pdfViewer.pagesCount);

//             // Render page rects initially
//             updatePageRects();
//         }
//     };

//     // Function: Update page positions
//     const updatePageRects = () => {
//         const pdfViewer = viewerRef.current;
//         if (pdfViewer && onPagesRendered) {
//             const pageRects: DOMRect[] = [];
            
//             for (let i = 1; i <= pdfDocument.numPages; i++) {
//                 const pageElement = document.querySelector(
//                     `[data-page-number="${i}"]`
//                 ) as HTMLElement;

//                 if (pageElement) {
//                     const rect = pageElement.getBoundingClientRect();
//                     pageRects.push(rect);
//                 }
//             }
//             onPagesRendered(pageRects);
//         }
//     };

//     // Debounce resize handler to avoid excessive reflows
//     const handleResize = () => {
//         updatePageRects();
//     };

//     // Initialize the PDF viewer only once, based on the component mounting or pdfDocument changing
//     useEffect(() => {
//         if (!pdfViewerInitialized.current) {
//             initPDFViewer().catch((error) =>
//                 console.error("PDF Viewer initialization failed", error)
//             );
//             pdfViewerInitialized.current = true; // Mark as initialized
//         }
       
        
//         // Add event listener for resize
//         // window.addEventListener("resize", handleResize);
//         // return () => {
//         //     viewerRef.current = null;
//         //     window.removeEventListener("resize", handleResize);
//         // };
//     }, [pdfDocument]); // Only run when pdfDocument changes

//     // Update page rects when scroll mode changes
//     useEffect(() => {
//         // handleResize();
//     }, [scrollMode]); // Recalculate on scrollMode change

//     useEffect(() => {
//         const pdfViewer = viewerRef.current;
//         if (pdfViewer && pdfScaleValue) {
//             // Set the scale using viewer's API if available
//             pdfViewer.currentScale = pdfScaleValue; // Use currentScale to update scale
//             console.log("Scale updated to:", pdfScaleValue);
//             handleResize()

//         }
//     }, [pdfScaleValue]); // Trigger whenever scale changes


//     return (
//         <div className="overflow-auto ">
//             <div
//                 ref={containerNodeRef}
//                 className="pdf-container scrollbar-hide absolute overflow-auto"
//                 id="pdf-container"
//             >
//                 <div className="pdfViewer w-full" id="pdfViewer" />
//             </div>
//         </div>
//     );
// };







// useEffect(() => {
//     if (!pdfDocument) {
//       console.log('No PDF document available. Exiting useEffect.');
//       return;
//     }
  
//     const generateThumbnail = async () => {
//       try {
//         // console.log('Generating thumbnail...');
        
//         // Get the first page
//         const firstPage = await pdfDocument.getPage(1);
//         // console.log('Fetched the first page of the PDF.');
  
//         // Create a canvas to render the page
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d')!;
//         const viewport = firstPage.getViewport({ scale: 0.5 }); // Adjust scale for thumbnail size
  
//         // console.log('Setting up canvas dimensions.');
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
  
//         // Render the page onto the canvas
//         // console.log('Rendering the first page onto the canvas.');
//         await firstPage.render({
//           canvasContext: context,
//           viewport: viewport,
//         }).promise;
  
//         // Get thumbnail as a Base64 image
//         const thumbnail = canvas.toDataURL('image/png');
//         // console.log('Thumbnail generated successfully.');
  
//         // Call the updatePdf function to save the thumbnail
//         await updatePdf(currentDocumentId, thumbnail);
//         // console.log('Thumbnail saved to IndexedDB with document ID:', currentDocumentId);
//       } catch (error) {
//         console.error('Error generating thumbnail:', error);
//       }
//     };
  
//     generateThumbnail();
//   }, [pdfDocument]);
  





// useEffect(() => {
//     const pdfViewer = viewerRef.current;
//     if (pdfViewer && pdfScaleValue) {
//         // Set the scale using viewer's API if available
//         pdfViewer.currentScale = pdfScaleValue; // Use currentScale to update scale
//         // console.log("Scale updated to:", pdfScaleValue);
//         handleResize()
//     }
// }, [pdfScaleValue]); // Trigger whenever scale changes









        // eventBus.on("pagerendered",(e)=>{
        //     console.log("pagerendered",e.pageNumber)
        //     addEmptyCanvasLayer(e.pageNumber);
        // })
        
    
      
        // /**
        //  * Add an empty canvas layer for a specific page number and enable drawing.
        //  * @param {number} pageNumber
        //  */
        // const addEmptyCanvasLayer = (pageNumber:number) => {
        //     // Locate the container for the specific page
        //     const pageDiv = containerNodeRef.current.querySelector(
        //         `.page[data-page-number="${pageNumber}"]`
        //     ) as HTMLDivElement;
           
    
        //     if (!pageDiv) {
        //         console.error(`Page container for page ${pageNumber} not found.`);
        //         return;
        //     }
    
        //     // Create a canvas element
        //     const canvas = document.createElement("canvas");
        //     const pageWidth = pageDiv.clientWidth;
        //     const pageHeight = pageDiv.clientHeight;
    
        //     canvas.width = pageWidth;
        //     canvas.height = pageHeight;
        //     canvas.style.position = "absolute";
        //     canvas.style.top = "0";
        //     canvas.style.left = "0";
        //     canvas.style.zIndex = "2"; // Ensure it overlays on top of the PDF content
        //     canvas.style.pointerEvents = "auto"; // Allow interaction with the canvas
    
        //     // Append the canvas to the page container
        //     pageDiv.style.position = "relative"; // Ensure the parent container has positioning
        //     // pageDiv.appendChild(canvas);
    
        //     // Enable drawing on the canvas
        //     // enableDrawingOnCanvas(canvas);
        // };
    
        // /**
        //  * Enable drawing functionality on a canvas.
        //  * @param {HTMLCanvasElement} canvas
        //  */
        // const enableDrawingOnCanvas = (canvas) => {
        //     const ctx = canvas.getContext("2d");
        //     let drawing = false;
    
        //     const startDrawing = (event) => {
        //         drawing = true;
        //         ctx.beginPath();
        //         ctx.moveTo(event.offsetX, event.offsetY);
        //     };
    
        //     const draw = (event) => {
        //         if (!drawing) return;
        //         ctx.lineTo(event.offsetX, event.offsetY);
        //         ctx.strokeStyle = "black";
        //         ctx.lineWidth = 2;
        //         ctx.stroke();
        //     };
    
        //     const stopDrawing = () => {
        //         drawing = false;
        //         ctx.closePath();
        //     };
    
        //     // Add event listeners for drawing
        //     canvas.addEventListener("mousedown", startDrawing);
        //     canvas.addEventListener("mousemove", draw);
        //     canvas.addEventListener("mouseup", stopDrawing);
        //     canvas.addEventListener("mouseout", stopDrawing);
        // };