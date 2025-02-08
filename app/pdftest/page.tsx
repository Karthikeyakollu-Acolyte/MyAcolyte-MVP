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
import { debounce } from "lodash";
import PDFPageContainer, { ExcalidrawOverlay } from "@/components/test/PDFPageContainer";
import { TwoFingerScroll } from "@/components/pdfcomponents/TwoFingerScroll";
import Toolbar from "@/components/Toolbar";

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
  const [localZoom, setLocalZoom] = useState(1);
  const [fitToWidth, setFitToWidth] = useState(true);

  const {
    viewMode,
    currentPage,
    setCurrentPage,
    isExpanded,
    setisExpanded,
    setScale,
    setPages,
    setcurrentView,
  } = useSettings();
  const [zoomOrigin, setZoomOrigin] = useState({ x: "50%", y: "50%" });
  const containerRef = useRef(null);

  useEffect(() => {
    // Auto fit when switching to double-page mode
    if (viewMode === "double") {
      setFitToWidth(true);
    }
  }, [viewMode]);


  useEffect(() => {
    const savedPage = localStorage.getItem("lastViewedPage")||1;
    if (savedPage) {
      setCurrentPage(Number(savedPage));
      setTimeout(() => {
        const element = document.querySelector(`[data-page-number="${savedPage}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth",block: 'center' });
        }
      }, 500);
    }
  }, []);

  const handlePageChange = useCallback(
    debounce((pageNumber) => {
      setCurrentPage(pageNumber);
      localStorage.setItem("lastViewedPage", pageNumber);
    }, 500),
    []
  );


  const toggleExpand = () => {
    setisExpanded((prev) => !prev);
    if (!isExpanded) {
      setFitToWidth(true);
    }
  };

  const renderSinglePage = () => (
    <div className="flex flex-col gap-4 items-center">
      {Array.from({ length: numPages }, (_, index) => (
        <PDFPageContainer
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
          onPageInView={handlePageChange}
        />
      ))}
    </div>
  );

  const renderDoublePage = () => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: Math.ceil(numPages / 2) }, (_, index) => (
        <div key={`spread-${index}`} className="flex gap-4 justify-center">
          <PDFPageContainer
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
            onPageInView={handlePageChange}
          />
          {index * 2 + 2 <= numPages && (
            <PDFPageContainer
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
              onPageInView={handlePageChange}
            />
          )}
        </div>
      ))}
    </div>
  );

  const debouncedSetZoom = useCallback(
    debounce((value) => {
      setZoom(value);
      setScale(value);
      // setLocalZoom(1)
    }, 0),
    []
  );
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const scaledWidth = containerWidth * localZoom;
  
      console.log("Current Width:", containerWidth);
      console.log("Scaled Width:", scaledWidth);
    }
  }, [localZoom]);
  

  useEffect(() => {
    setcurrentView("read");
  }, []);

  const handleZoomChange = (value) => {
    setLocalZoom(value[0]);
    debouncedSetZoom(value[0]);
  };

  // const handleZoomChange1 = (zoom, event) => {
  //   console.log(zoom);
  //   setLocalZoom(zoom)
  //   debouncedSetZoom(zoom);
  // };



  return (
    <div className="flex h-full max-w-full  scrollbar-hidden">
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
            value={[localZoom]}
            onValueChange={handleZoomChange}
            className="w-40"
          />
        </div> */}
        <div
          ref={containerRef}
          className="flex-1  p-4  overflow-auto scrollbar-hidden relative  "
          id="scrollableElement"
          // style={
          //   {
          //     // transform: `scale(${localZoom})`,
          //     // transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}`,
          //   }
          // }
        >
          <TwoFingerScroll>
            <Document
              file={url}
              onLoadSuccess={(doc) => {
                setNumPages(doc.numPages);
                setPages(doc.numPages);
              }}
              loading={<Loading message="Loading PDF..." />}
              error={<ErrorComponent message="Failed to load PDF" />}
            >
              <div>
                {viewMode === "single"
                  ? renderSinglePage()
                  : renderDoublePage()}
              </div>
            </Document>
          </TwoFingerScroll>
        </div>
        {/* {true && (
            <div className="w-[100vw] h-[100vh] absolute top-0 left-0">
              <TouchGestureHandler onZoomChange={handleZoomChange1} />
            </div>
          )} */}
      </div>
    </div>
  );
};

const PdfViewer = () => {
  const [pdfData, setPdfData] = useState<string | null>(null);

  const handleFetchPdf = async () => {
    try {
      const pdf = await getPdfById("de1855d7-ccd8-469a-87c4-5aee04295359");
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
    <div className="h-screen w-full overflow-auto bg-slate-400">
      {
      pdfData && <div className=" w-[850px] relative">
       <PDFViewer url={pdfData} />

       <div className="w-[850px] h-full  absolute top-0 left-0">
       <ExcalidrawFabric
        pageIndex={1}
        currentDocumentId={1}
        zoom={1}
      />
       </div>
       </div>
      }

      <Toolbar/>
    </div>
  );
};

export default PdfViewer;
