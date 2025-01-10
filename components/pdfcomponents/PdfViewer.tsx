"use client"
import React, { useEffect, useRef } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useSettings } from "@/context/SettingsContext";
import type { PDFViewer, EventBus } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import { useRefs } from "@/context/sharedRefs";

interface PdfViewerProps {
    pdfDocument: PDFDocumentProxy;
    pdfScaleValue?: string;
    onPagesRendered?: (pageRects: DOMRect[]) => void;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
    pdfDocument,
    pdfScaleValue = "auto",
    onPagesRendered,
}) => {
    const containerNodeRef = useRef<HTMLDivElement>(null);
    const pdfViewerRef = useRef<any>(null); // Store the viewer instance
    const isInitialized = useRef(false); // Ensure initialization happens only once
    const { setPdfViewerRef } = useRefs();

    const viewerRef = useRef<PDFViewer | null>(null);
    let eventBus: EventBus | undefined;

    // Function: Initialize the PDF viewer
    const initPDFViewer = async () => {
        const pdfjs = await import("pdfjs-dist/web/pdf_viewer.mjs");
        eventBus = new pdfjs.EventBus();

        if (!containerNodeRef.current) {
            throw new Error("Container reference is missing!");
        }

        if (!viewerRef.current) {
            viewerRef.current = new pdfjs.PDFViewer({
                container: containerNodeRef.current,
                eventBus,
                textLayerMode: 2,
                removePageBorders: false,
                annotationMode: 1,
            });
        }

        // Set up the event listener for `pagesinit`
        eventBus.on("pagesinit", onPagesInit);

        viewerRef.current.setDocument(pdfDocument);
        if (viewerRef.current) {
            setPdfViewerRef(viewerRef)
        }

    };


    // Function: Handle the `pagesinit` event
    const onPagesInit = () => {
        const pdfViewer = viewerRef.current
        if (pdfViewer) {
            console.log("Pages initialized!");
            pdfViewer.currentScaleValue = pdfScaleValue;
            pdfViewer.currentScale = 1;
            const pageRects: DOMRect[] = [];
            for (let i = 1; i <= pdfDocument.numPages; i++) {
                const pageElement = document.querySelector(
                    `[data-page-number="${i}"]`
                ) as HTMLElement;

                if (pageElement) {
                    const rect = pageElement.getBoundingClientRect();
                    pageRects.push(rect);
                }
            }
            onPagesRendered?.(pageRects);


        }
    };

    // useEffect(() => {

    //     const initViewer = async () => {
    //         const pdfjs = await import("pdfjs-dist/web/pdf_viewer.mjs");
    //         const eventBus = new pdfjs.EventBus();

    //         if (!containerNodeRef.current || isInitialized.current) {
    //             return;
    //         }

    //         const viewer = new pdfjs.PDFViewer({
    //             container: containerNodeRef.current,
    //             eventBus,
    //             textLayerMode: 2,
    //             removePageBorders: false,
    //         });

    //         viewer.setDocument(pdfDocument);
    //         viewer.currentScaleValue = pdfScaleValue;
    //         pdfViewerRef.current = viewer;
    //         isInitialized.current = true;


    //         eventBus.on("pagesinit", () => {
    //             // rotatePage(1,90);
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


    //             eventBus.on("pagechanging", (evt) => {
    //                 // console.log(`Current Page: ${evt.pageNumber}`);
    //                 // getCaechedPages()
    //                 console.log("chaning..")
    //                 //getVisiblePages()

    //             })

    //             onPagesRendered?.(pageRects);
    //         });


    //     };



    //     initViewer().catch((error) =>
    //         console.error("PDF Viewer initialization failed", error)
    //     );
    // }, [pdfDocument, pdfScaleValue, onPagesRendered]);


    useEffect(() => {
        initPDFViewer().catch((error) => console.error("PDF Viewer initialization failed", error));

        return () => {
            viewerRef.current = null;
        };
    }, [pdfDocument, pdfScaleValue]);



    return (


        <div ref={containerNodeRef} className="pdf-container  absolute overflow-auto" id="pdf-container"  >
            <div className="pdfViewer w-full " id="pdfViewer" ></div>
        </div>)
};


{/* <div ref={containerNodeRef} className="pdf-container absolute  h-full overflow-auto" id="pdf-container">

<div className="pdfViewer w-full " id="pdfViewer"/>

</div> */}