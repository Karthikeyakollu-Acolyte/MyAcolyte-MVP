"use client"
import { useState, useEffect, useCallback, useRef } from "react";
import { PdfHighlighter } from "@/components/pdfcomponents/PdfHighlighter"
import { PdfLoader } from "@/components/pdfcomponents/PdfLoader"
import { PDFDocumentProxy, EventBus } from "pdfjs-dist/types/web/pdf_viewer";
import { useCanvas } from "@/context/CanvasContext";
import { useSettings } from "@/context/SettingsContext";
import {  getPdfById } from '@/db/pdf/docs';
import { useRouter } from 'next/router';

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";

const searchParams = new URLSearchParams(document.location.search);




const Wrapper = ({ id }: { id: string }) => {

    let eventBus: EventBus;
    let linkService: any;
    const [pages, setpages] = useState(1)

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const outlineContainerRef = useRef(null);
    const { setRect } = useCanvas()
    const pdfViewerRef = useRef<HTMLDivElement>(null);
    const [pdfData, setPdfData] = useState<string | null>(null);
    const {currentDocumentId} = useSettings()

    const [zoom, setZoom] = useState(1); // Initial zoom level


    const handleFetchPdf = async () => {
        try {
          const pdf = await getPdfById(currentDocumentId);
          if (pdf?.base64) {
            // Convert the base64 string to a data URL
            const dataUrl = pdf.base64;
            setPdfData(dataUrl);
          }
        } catch (error) {
          console.error('Error fetching PDF:', error);
        }
      };
    
    useEffect(() => {
        if (!currentDocumentId) {
            return;
        }
        handleFetchPdf()
    }, [currentDocumentId])




    return (
        <div className="w-full  h-full" >
            <PdfLoader
                url={pdfData}
                file={pdfFile}
                beforeLoad={<div>Loading...</div>}>
                {(pdfDocument: PDFDocumentProxy) => (
                    <div className="flex justify-center h-full"
                        ref={pdfViewerRef} // Reference for zoom functionality

                    >
                        <PdfHighlighter
                            pdfDocument={pdfDocument}
                            pdfScaleValue={zoom}
                        />


                    </div>
                )}
            </PdfLoader>
        </div>

    )
}

export default Wrapper



  {/* <Toolbar /> */}
  {/* <SideToolbar /> */}
{/* <div className="col-span-1 overflow-y-auto"> */ }
{/* <PDFThumbnailViewer
    linkService={linkService}
    eventBus={eventBus}
    pdfDocument={pdfDocument}
/> */}

{/* <PDFOutlineViewer
    pdfDocument={pdfDocument}
/> */}

// </div>

{/* <PDFThumbnails
                      totalPages={40}
                    /> */}



{/* <PDFViewerComponent pdfDocument={pdfDocument} /> */ }


// working ....
{/* <PdfHighlighter
                            pdfDocument={pdfDocument}
                        /> */}
{/* <PDFOutlineViewer
                            pdfDocument={pdfDocument}
                        /> */}
{/* <PDFThumbnailViewer
                            linkService={linkService}
                            eventBus={eventBus}
                            pdfDocument={pdfDocument}
                        /> */}





