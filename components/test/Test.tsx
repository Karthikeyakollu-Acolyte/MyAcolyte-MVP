"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useInView } from "react-intersection-observer";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import ExcalidrawFabric from "@/components/canvas/excalidraw/test/ExcalidrawFabric";
import { getPdfById } from "@/db/pdf/docs";
import { useSettings } from "@/context/SettingsContext";
import { Slider } from "../ui/slider";
import { ThumbnailDiv } from "./ThumbnailDiv";
import { TouchGestureHandler } from "./TouchGestureHandler";
import { debounce } from "lodash";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

const Loading = ({ message }) => (
  <div className="text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
    <p className="mt-2 text-gray-600">{message}</p>
  </div>
);

const ErrorComponent = ({ message }) => (
  <div className="text-red-500 text-center">{message}</div>
);



const ViewMode = {
  SINGLE: "single",
  DOUBLE: "double",
  CAROUSEL: "carousel",
};

const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [fitToWidth, setFitToWidth] = useState(true);
  const { viewMode, currentPage, setCurrentPage, isExpanded, setisExpanded,setScale,setPages } =
    useSettings();
    const [zoomOrigin, setZoomOrigin] = useState({ x: "50%", y: "50%" });
  const containerRef = useRef(null);

  useEffect(() => {
    // Auto fit when switching to double-page mode
    if (viewMode === "double") {
      setFitToWidth(true);
    }
  }, [viewMode]);

  const handleZoomChange = (value) => {
    setZoom(value[0]);
    setScale(value[0])
  };



  const toggleExpand = () => {
    setisExpanded((prev) => !prev);
    if (!isExpanded) {
      setFitToWidth(true);
    }
  };

  const renderSinglePage = () => (
    <div className="flex flex-col gap-4 items-center">
      {Array.from({ length: numPages }, (_, index) => (
        <PDFPage
          key={index + 1}
          pageNumber={index + 1}
          isVisible={index + 1 === currentPage}
          zoom={zoom}
          setZoom={setZoom}
          pageWidth={containerRef?.current?.offsetWidth}
          viewMode={viewMode}
          fitToWidth={fitToWidth}
          setFitToWidth={setFitToWidth}
          isExpanded={isExpanded}
        />
      ))}
    </div>
  );

  const renderDoublePage = () => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: Math.ceil(numPages / 2) }, (_, index) => (
        <div key={`spread-${index}`} className="flex gap-4 justify-center">
          <PDFPage
            key={index * 2 + 1}
            pageNumber={index * 2 + 1}
            isVisible={index * 2 + 1 === currentPage}
            zoom={zoom}
            setZoom={setZoom}
            pageWidth={containerRef?.current?.offsetWidth / 2}
            viewMode={viewMode}
            fitToWidth={true} // Always fit to width for double-page view
            setFitToWidth={setFitToWidth}
            isExpanded={isExpanded}
          />
          {index * 2 + 2 <= numPages && (
            <PDFPage
              key={index * 2 + 2}
              pageNumber={index * 2 + 2}
              isVisible={index * 2 + 2 === currentPage}
              zoom={zoom}
              setZoom={setZoom}
              pageWidth={containerRef?.current?.offsetWidth / 2}
              viewMode={viewMode}
              fitToWidth={true}
              setFitToWidth={setFitToWidth}
              isExpanded={isExpanded}
            />
          )}
        </div>
      ))}
    </div>
  );




  return (
    <div className="flex h-full max-w-full">
      <div className="flex-1 flex flex-col">
        {/* <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={toggleExpand}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            {isExpanded ? "Normal Width" : "Expand to Full Width"}
          </button>
          <Slider
            min={0.5}
            max={4}
            step={0.1}
            value={[zoom]}
            onValueChange={handleZoomChange}
            className="w-40"
          />
        </div> */}
        <div ref={containerRef} className="flex-1 overflow-auto p-4 scrollbar-hidden"
        >
          <Document
            file={url}
            onLoadSuccess={(doc) => {setNumPages(doc.numPages); setPages(doc.numPages)}}
            loading={<Loading message="Loading PDF..." />}
            error={<ErrorComponent message="Failed to load PDF" />}
          >
            {viewMode === "single" ? renderSinglePage() : renderDoublePage()}
          </Document>
        </div>
      </div>
    </div>
  );
};




const PDFPage = ({
  pageNumber,
  isVisible,
  zoom,
  setZoom,
  pageWidth,
  viewMode,
  fitToWidth,
  setFitToWidth,
  isExpanded,
}) => {
  const containerRef = useRef(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [pageView, setPageView] = useState();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { ispagesZooming, currentDocumentId } = useSettings();

  const setRefs = (element) => {
    containerRef.current = element;
    inViewRef(element);
  };

  const handleLoadSuccess = (page) => {
    setPageView(page);
    setIsPageLoaded(true);
  };
  const handleZoomChange = (zoom,event) => {
    console.log(zoom);
    // if(zoom<1 && zoom> 5) return
    setZoom(zoom)
  };
let targetWidth
  useEffect(() => {
    if (!isPageLoaded) return;
    if(viewMode===ViewMode.SINGLE){
     targetWidth = isExpanded ? pageWidth : 800;
    }else{
      targetWidth = isExpanded ? pageWidth : pageWidth;
    }
    // const targetWidth = isExpanded ? pageWidth : pageWidth;
    const newScale = targetWidth / pageView.view[2];

    if (fitToWidth) {
      setZoom(newScale);
    }
  }, [isPageLoaded, pageView, fitToWidth, isExpanded]);

  return (
    <div ref={setRefs} className={`relative overflow-auto scrollbar-hidden max-w-full `}>
      {inView && (
        <div className="w-full" >
          <div style={{ filter: false ? "invert(1)" : "" }}>
            <Page
              pageNumber={pageNumber}
              scale={zoom}
              onLoadSuccess={handleLoadSuccess}
              className="mx-auto overflow-hidden rounded-md"
              renderTextLayer={true}
              renderAnnotationLayer={false}
              loading={<Loading message={`Loading page ${pageNumber}...`} />}
              error={
                <ErrorComponent message={`Error loading page ${pageNumber}`} />
              }
            />
          
          </div>
          {true && (
            <div className="w-[100vw] absolute top-0 left-0">
              <TouchGestureHandler onZoomChange={handleZoomChange} />
            </div>
          )}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-auto">
            <ExcalidrawFabric
              pageIndex={pageNumber}
              currentDocumentId={currentDocumentId}
              zoom={zoom / 5} // Sync zoom here for Excalidraw canvas
              setZoom={setZoom}
            />
          </div>
        </div>
      )}
    </div>
  );
};




const PdfViewer = ({ id }) => {
  const [pdfData, setPdfData] = useState<string | null>(null);

  const handleFetchPdf = async () => {
    try {
      const pdf = await getPdfById(id);
      if (pdf?.base64) {
        const dataUrl = pdf.base64;
        setPdfData(dataUrl);
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  useEffect(() => {
    handleFetchPdf();
  }, []);

  return (
    <div className="h-screen w-full">
      {pdfData && <PDFViewer url={pdfData} />}
    </div>
  );
};

export default PdfViewer;
