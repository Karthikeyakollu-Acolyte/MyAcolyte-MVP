"use client"
import { useState, useEffect, useCallback, useRef } from "react";
import { PdfHighlighter } from "./pdfcomponents/PdfHighlighter"
import { PdfLoader } from "./pdfcomponents/PdfLoader"
import PDFOutlineViewer from './pdfcomponents/PDFOutlineViewer';
import { PDFDocumentProxy, EventBus } from "pdfjs-dist/types/web/pdf_viewer";
import { PDFThumbnailViewer } from "./pdfcomponents/PDFThubnailView";
import InfiniteCanvas from "./canvas/InfiniteCanvas";
import Toolbar from "./toolbar/Toolbar";
import { SideToolbar } from "./toolbar/Sidebar";
import { useCanvas } from "@/context/CanvasContext";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useSettings } from "@/context/SettingsContext";
import SearchCompoent from "./pdfcomponents/SearchCompoent";
import { Divide } from "lucide-react";
import { getAllPdfs, deletePdf, getPdfById } from '@/db/pdf/docs';
import FileUpload from "./dashboard/FileUpload";
import { useRouter } from 'next/router';
import ExcalidrawComponent from "./canvas/excalidraw/ExcalidrawComponent";

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021";

const searchParams = new URLSearchParams(document.location.search);




const Wrapper = ({ id }: { id: string }) => {

    let eventBus: EventBus;
    let linkService: any;
    const [pages, setpages] = useState(1)

    const [pdfFile, setPdfFile] = useState<File | undefined>(undefined);
    const outlineContainerRef = useRef(null);
    // const [first, setfirst] = useState(false)
    const { setRect } = useCanvas()
    const [scale, setScale] = useState(1); // Manage zoom level
    const pdfViewerRef = useRef<HTMLDivElement>(null);
    const [pdfData, setPdfData] = useState<string | null>(null);
    const { first, setfirst, currentDocumentId, setcurrentDocumentId } = useSettings()

    const [zoom, setZoom] = useState(1); // Initial zoom level


    const handleFetchPdf = async () => {


        try {
            const pdf = await getPdfById(currentDocumentId);
            if (pdf) {
                setPdfData(pdf.base64);
            } else {
                // alert('No PDF found with the given ID.');
            }
        } catch (error) {
            console.error('Error fetching PDF:', error);
            // alert('Failed to fetch the PDF. Please try again.');
        }
    };


    useEffect(() => {
        if (!currentDocumentId) {
            return;
        }
        handleFetchPdf()
    }, [currentDocumentId])

    useEffect(() => {
        setcurrentDocumentId(id)
        // console.log(id)
    }, [id])  // This should depend on `id` to update `currentDocumentId` when `id` changes.


    return (
        <div className="w-full  h-full" >
            {/* <button onClick={() => { setfirst(!first) }} className="border border-1 p-2  m-2 rounded-md">Toggle</button> */}

            <PdfLoader
                url={pdfData}
                file={pdfFile}
                beforeLoad={<div>Loading...</div>}>
                {(pdfDocument: PDFDocumentProxy) => (
                    <div className="flex justify-center  bg-black h-full"
                        ref={pdfViewerRef} // Reference for zoom functionality
                        
                    >

                        {!first && (
                            <PdfHighlighter
                                pdfDocument={pdfDocument}
                                pdfScaleValue={zoom}
                            />
                        )}


                        {/* {first && <ExcalidrawComponent id={id} />} */}

                    </div>
                )}
            </PdfLoader>

            {/* <Toolbar /> */}
            {/* <SideToolbar /> */}

        </div>

    )
}

export default Wrapper


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





