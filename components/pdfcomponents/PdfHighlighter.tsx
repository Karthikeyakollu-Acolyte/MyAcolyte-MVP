"use client"
import React, { LegacyRef, useEffect, useRef, useState } from "react";
// import { PdfViewer } from "./PdfViewer";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { CanvasWrapper } from "../canvas/CanvasWrapper"
// import { PDFViewerComponent } from "../Test";
import { PdfViewerComponent } from "./pdfViewerTest";

import { useSettings } from "@/context/SettingsContext";
interface PdfHighlighterProps {
    pdfDocument: PDFDocumentProxy;
    pdfScaleValue?: number;
}

export const PdfHighlighter: React.FC<PdfHighlighterProps> = ({
    pdfDocument,
    pdfScaleValue = 1,
}) => {
    const [isDrawing, setIsDrawing] = useState(true);
    const [pageRects, setPageRects] = useState<DOMRect[]>([]);

    const toggleDrawingMode = () => setIsDrawing(!isDrawing);
    const [findController] = useState<any>({});
    const [eventBus] = useState<any>({});
    const divRef = useRef<HTMLDivElement>(null);  // Fixed ref type
    const { scale, setScale } = useSettings();
    const containerNodeRef = useRef<HTMLDivElement>(null);  // Fixed ref type
    const contentRef = useRef<HTMLDivElement>(null);  // Fixed ref type
    const [isZoomEnable, setIsZoomEnable] = useState(true);


    // useEffect(() => {
    //     const div = divRef.current;
    //     const contentDiv = contentRef.current;
    //     if (!div || !contentDiv) return;

    //     let localScale = 1;
    //     let zoomTimeout;
    //     // div.style.transformOrigin = `top center`;

    //     const onWheel = (e) => {
    //         if (e.ctrlKey) {
    //             e.preventDefault();
    //             // div.style.transformOrigin = `top center`;

    //             // Calculate zoom direction
    //             const delta = e.deltaY > 0 ? -0.1 : 0.1;
    //             const newScale = Math.min(Math.max(localScale + delta, 0.5), 2);


                   
    //                 contentDiv.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;
    //                 contentDiv.style.transform = `scale(${newScale})`;
    //             localScale = newScale;
    //             // setIsZoomEnable(localScale <= 1);

    //             // Clear any existing timeout
    //             clearTimeout(zoomTimeout);

              
    //         }
    //     };

    //     div.addEventListener('wheel', onWheel);

    //     return () => {
    //         div.removeEventListener('wheel', onWheel);
    //         clearTimeout(zoomTimeout);
    //     };
    // }, [setScale]);


    return (
        <div
            className=" scrollbar-hide"
            ref={divRef}
            id="pdf-container"
            style={{
                width: '100%',
                // height: '100%',
                // maxWidth: '100%',
            }}
        >
            <div ref={contentRef} className="h-full">
                <PdfViewerComponent
                    pdfDocument={pdfDocument}
                    onPagesRendered={setPageRects}
                    pdfScaleValue={pdfScaleValue}
                    containerNodeRef={containerNodeRef}
                    isZoomEnable={isZoomEnable}
                />

                {/* <CanvasWrapper pageRects={pageRects} isDrawing={isDrawing} containerNodeRef={containerNodeRef} type="pdf" /> */}
            </div>
        </div>
    );
};


{/* <PDFViewerComponent pdfDocument={pdfDocument}/> */ }
{/* <PdfViewerComponent
                pdfDocument={pdfDocument}
                onPagesRendered={setPageRects}
            /> */}