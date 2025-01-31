"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;
// Loading and Error Component
const Loading = ({ message }) => (
  <div className="text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
    <p className="mt-2 text-gray-600">{message}</p>
  </div>
);
const ErrorComponent = ({ message }) => (
  <div className="text-red-500 text-center">{message}</div>
);

// PDF Page Component with Excalidraw Overlay
const PDFPage = ({
  pageNumber,
  isVisible,
  zoom,
  setZoom,
  pageWidth,
  viewMode,
}) => {
  const containerRef = useRef(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const {
    isDarkFilter,
    ispagesZooming,
    setisPagesZoomingFromGesture,
    currentDocumentId,
  } = useSettings();
  const [pageView, setpageView] = useState();
  const [isPageLoaded, setisPageLoaded] = useState(false);
  const [initialScale, setInitialScale] = useState(1);
  // Combine both refs using callback ref pattern
  const setRefs = (element) => {
    containerRef.current = element;
    inViewRef(element);
  };
  useEffect(() => {
    setZoom((prev: number) => prev + 0.1);
    const timeoutId = setTimeout(() => {
      setZoom((prev: number) => prev - 0.1);
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [viewMode,pageWidth]);

  useEffect(() => {
    if (!isPageLoaded) return;
  console.log(window.innerWidth)
    const targetWidth = viewMode === "double" ? (window.innerWidth/2) : (pageWidth);
    const newScale = targetWidth / pageView.view[2];
  
    setZoom(newScale +0.2);
    setInitialScale(newScale);
  }, [isPageLoaded, viewMode, pageWidth]);
  

  const handleLoadSuccess = (page) => {
    setpageView(page);
    setisPageLoaded(true);
  };
  const handleZoomChange = useCallback(
    (newZoom) => {
      console.log(newZoom) // zoom is resetting to intila position so that whole pages is making small and big
      // setZoom((prevZoom) =>  newZoom);
      setisPagesZoomingFromGesture(true);
    },
    [setZoom]
  );
  useEffect(() => {
    const scrollPad = document.getElementById("scrollPad");
    scrollPad?.addEventListener("", () => {
      console.log("gesture enabled");
    });
  }, []);
  return (
    <div ref={setRefs} className="relative overflow-auto max-w-full">
      {  inView && 
        <div>
          <div
            style={{
              filter: isDarkFilter ? "invert(1)" : "",
            }}
          >
            <Page
              pageNumber={pageNumber}
              scale={zoom} // Sync zoom directly with the PDF page scale
              onLoadSuccess={handleLoadSuccess}
              className="shadow-lg mx-auto rounded-md overflow-hidden"
              renderTextLayer={true}
              renderAnnotationLayer={false}
              loading={`Loading page ${pageNumber}...`}
              error={`Error loading page ${pageNumber}`}
            />
          </div>
          {/* {ispagesZooming && (
            <TouchGestureHandler onZoomChange={handleZoomChange} />
          )}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-auto">
            <ExcalidrawFabric
              pageIndex={pageNumber}
              currentDocumentId={currentDocumentId}
              zoom={zoom / 5} // Sync zoom here for Excalidraw canvas
              setZoom={setZoom}
            />
          </div> */}
        </div>
      }
    </div>
  );
};


const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const ViewMode = {
    SINGLE: "single",
    DOUBLE: "double",
    CAROUSEL: "carousel",
  };
  const {
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    setisPagesZoomingFromGesture,
    setPages
  } = useSettings();
  const containerRef = useRef(null);
  const handleDocumentLoadSuccess = ({ numPages }) => {setNumPages(numPages); setPages(numPages)};
  const handleCarouselScroll = (direction) => {
    if (isTransitioning) return;
    const newPage =
      direction === "next"
        ? Math.min(currentPage + 1, numPages)
        : Math.max(currentPage - 1, 1);
    if (newPage === currentPage) return;
    setIsTransitioning(true);
    setSlideDirection(direction);
    setCurrentPage(newPage);
    setTimeout(() => {
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 300);
  };
  useEffect(() => {
    if (viewMode === ViewMode.CAROUSEL) {
      const handleKeyPress = (e) => {
        if (e.key === "ArrowRight") handleCarouselScroll("next");
        if (e.key === "ArrowLeft") handleCarouselScroll("prev");
      };
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [viewMode, currentPage, isTransitioning]);
  const renderSinglePage = (commonProps) => (
    <div className="flex flex-col gap-4 items-center">
      {Array.from({ length: numPages }, (_, index) => (
        <div key={index}>
          <PDFPage
            pageNumber={index + 1}
            isVisible={index + 1 === currentPage}
            {...commonProps}
            zoom={zoom}
            setZoom={setZoom}
          />
        </div>
      ))}
    </div>
  );
  const renderDoublePage = (commonProps) => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: Math.ceil(numPages / 2) }, (_, index) => (
        <div key={`spread-${index}`} className="flex gap-4 justify-center">
          <PDFPage
            pageNumber={index * 2 + 1}
            isVisible={index * 2 + 1 === currentPage}
            {...commonProps}
            zoom={zoom}
            setZoom={setZoom}
          />
          {index * 2 + 2 <= numPages && (
            <PDFPage
              pageNumber={index * 2 + 2}
              isVisible={index * 2 + 2 === currentPage}
              {...commonProps}
              zoom={zoom}
              setZoom={setZoom}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPages = () => {
    if (!numPages) return null;
    const commonProps = {
      zoom,
      pageWidth: 900,
      viewMode,
    };
    switch (viewMode) {
      case ViewMode.SINGLE:
        return renderSinglePage(commonProps);
      case ViewMode.DOUBLE:
        return renderDoublePage(commonProps);
      case ViewMode.CAROUSEL:
        return null
      default:
        return null;
    }
  };
  const handleZoomChange = (value) => {
    setZoom(value[0]);
    setisPagesZoomingFromGesture(true);
  };
  return (
    <div className="flex h-full max-w-full">
      <div className="flex-1 flex flex-col">
        <div className="fixed top-4 right-4 z-50">
          <Slider
            min={0.5}
            max={4}
            step={0.1}
            value={[zoom]}
            onValueChange={handleZoomChange}
            className="w-40"
          />
        </div>
        <div ref={containerRef} className="flex-1 overflow-auto p-4" id="doc">
          <Document
            file={url}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading={<Loading message="Loading PDF..." />}
            error={<ErrorComponent message="Failed to load PDF" />}
          >
            {renderPages()}
          </Document>
        </div>
      </div>
     <div className="">
     <ThumbnailDiv currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={numPages} scrollToPage={()=>{}}/>
     </div>
    </div>
  );
};
const PdfViewer = ({ id }) => {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const handleFetchPdf = async () => {
    try {
      // d97e169c-ea97-4de6-a2fe-68e3547498e6
      const pdf = await getPdfById(id);
      if (pdf?.base64) {
        // Convert the base64 string to a data URL
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
    <div>
      <PDFViewer url={pdfData} />
      {/* <Toolbar/> */}
     
    </div>
  );
};
export default PdfViewer;