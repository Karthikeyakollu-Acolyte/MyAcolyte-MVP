"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Rows,
  Columns,
  Layout,
  Plus,
  Minus,
  Scale,
} from "lucide-react";
import { Document, Page, pdfjs, Thumbnail } from "react-pdf";
import { useInView } from "react-intersection-observer";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import ExcalidrawFabric from "@/components/canvas/excalidraw/test/ExcalidrawFabric";
import { getPdfById } from "@/db/pdf/docs";
import { useSettings } from "@/context/SettingsContext";
import { Slider } from "../ui/slider";
import { Excalidraw } from "@excalidraw/excalidraw";
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

const TouchGestureHandler = ({ onZoomChange }) => {
  const initialDistance = useRef(null);
  const currentScale = useRef(1);
  const lastScale = useRef(1);

  useEffect(() => {
    const scrollPad = document.getElementById("scrollPad");

    const calculateDistance = (touch1, touch2) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.hypot(dx, dy);
    };

    // Handle touch pinch gestures
    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        initialDistance.current = calculateDistance(
          event.touches[0],
          event.touches[1]
        );
        lastScale.current = currentScale.current;
        console.log("Pinch gesture started");
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches.length === 2 && initialDistance.current !== null) {
        const currentDistance = calculateDistance(
          event.touches[0],
          event.touches[1]
        );

        const scale = currentDistance / initialDistance.current;
        let targetScale = lastScale.current * scale;

        // Step adjustment (rounded to nearest 0.1)
        targetScale = Math.round(targetScale * 10) / 10;

        // Clamp the scale
        const newScale = Math.max(0.5, Math.min(3, targetScale));

        // Apply the change only if there's a meaningful difference
        if (Math.abs(currentScale.current - newScale) >= 0.1) {
          currentScale.current = newScale;
          onZoomChange(newScale);
          console.log("Current scale (touch):", newScale);
        }

        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      initialDistance.current = null;
      lastScale.current = currentScale.current;
      console.log("Gesture ended");
    };

    // Handle trackpad pinch gesture (using wheel events)
    const handleWheel = (event) => {
      if (event.ctrlKey) {
        const delta = event.deltaY || event.deltaX; // Trackpad delta (vertical or horizontal)
        const scaleChange = delta > 0 ? -0.1 : 0.1; // Adjust zoom direction
        const targetScale = currentScale.current + scaleChange;

        // Step adjustment (rounded to nearest 0.1)
        const newScale = Math.round(targetScale * 10) / 10;

        // Clamp the scale
        if (newScale >= 0.5 && newScale <= 3) {
          currentScale.current = newScale;
          onZoomChange(newScale);
          console.log("Current scale (trackpad):", newScale);
        }

        event.preventDefault();
      }
    };

    // Adding event listeners for touch events
    if (scrollPad) {
      scrollPad.addEventListener("touchstart", handleTouchStart);
      scrollPad.addEventListener("touchmove", handleTouchMove);
      scrollPad.addEventListener("touchend", handleTouchEnd);
      scrollPad.addEventListener("touchcancel", handleTouchEnd);

      // Adding event listener for trackpad gestures (wheel events)
      scrollPad.addEventListener("wheel", handleWheel);
    }

    // Clean up event listeners when component unmounts
    return () => {
      if (scrollPad) {
        scrollPad.removeEventListener("touchstart", handleTouchStart);
        scrollPad.removeEventListener("touchmove", handleTouchMove);
        scrollPad.removeEventListener("touchend", handleTouchEnd);
        scrollPad.removeEventListener("touchcancel", handleTouchEnd);

        // Remove trackpad wheel event listener
        scrollPad.removeEventListener("wheel", handleWheel);
      }
    };
  }, [onZoomChange]);

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-pink-100 opacity-30"
      id="scrollPad"
      style={{ zIndex: 10 }}
    />
  );
};

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
      if (viewMode === "double") {
        // setZoom();
      } else if (viewMode === "carousel") {
        // setZoom(0.9);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [viewMode]);

  const [containerSize, setContainerSize] = useState({
    width: pageWidth,
    height: 0,
  });

  const handleLoadSuccess = (page) => {
    setpageView(page);
    setisPageLoaded(true);
  };
  const handleZoomChange = useCallback(
    (newZoom) => {
      // setZoom((prevZoom) =>  newZoom);
      setisPagesZoomingFromGesture(true);
    },
    [setZoom]
  );

  const handleScaling = () => {
    const defaultPdfWidth = pageView.view[2]; // PDF page's original width
    const defaultPdfHeight = pageView.view[3]; // PDF page's original height

    // Target width is fixed at 300px (you can adjust this value)
    const targetWidth = pageWidth;

    // Calculate scale to fit the page width to target width
    const newScale = targetWidth / defaultPdfWidth;

    // Calculate the corresponding height
    const targetHeight = defaultPdfHeight * newScale;
    // Update state with the calculated dimensions and scale
    if (!zoom) {
      // setZoom(newScale)
    }
    setZoom(newScale);
    setInitialScale(newScale);
    // setzoom2()
    setContainerSize({ width: targetWidth, height: targetHeight });
  };

  useEffect(() => {
    if (!isPageLoaded) return;
    handleScaling();
  }, [isPageLoaded]);

  useEffect(() => {
    const scrollPad = document.getElementById("scrollPad");
    scrollPad?.addEventListener("", () => {
      console.log("gesture enabled");
    });
  }, []);

  return (
    <div ref={setRefs} className="relative border-2 border-pink-200">
      {
        <div>
          <div
            style={{
              // transform:`scale(${zoom})`,
              filter: isDarkFilter ? "invert(1)" : "",
            }}
          >
            <Page
              pageNumber={pageNumber}
              scale={zoom} // Sync zoom directly with the PDF page scale
              onLoadSuccess={handleLoadSuccess}
              className="shadow-lg mx-auto rounded-md overflow-hidden"
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={`Loading page ${pageNumber}...`}
              error={`Error loading page ${pageNumber}`}
            />
          </div>
          {ispagesZooming && (
            <TouchGestureHandler onZoomChange={handleZoomChange} />
          )}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-auto">
            <ExcalidrawFabric
              pageIndex={pageNumber}
              currentDocumentId={currentDocumentId}
              zoom={zoom / 5} // Sync zoom here for Excalidraw canvas
              setZoom={setZoom}
            />
            {/* <Excalidraw/> */}
          </div>
        </div>
      }
    </div>
  );
};

// Thumbnail Scrollbar Component
const ThumbnailDiv = ({
  currentPage,
  setCurrentPage,
  totalPages,
  scrollToPage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarRef = useRef(null);
  const [draggedPage, setDraggedPage] = useState(currentPage);
  const [page, setpage] = useState(1);
  const { currentDocumentId } = useSettings();
  const [pdfData, setPdfData] = useState<string | null>(null);

  useEffect(() => {
    setpage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    scrollToPage(currentPage);
  }, [draggedPage]);

  const handleFetchPdf = async () => {
    try {
      // d97e169c-ea97-4de6-a2fe-68e3547498e6
      const pdf = await getPdfById(currentDocumentId);
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
  }, [currentDocumentId]);

  const handleDrag = (e) => {
    if (!isDragging || !scrollbarRef.current) return;

    const scrollbar = scrollbarRef.current.getBoundingClientRect();
    const relativeY = Math.max(
      0,
      Math.min(e.clientY - scrollbar.top, scrollbar.height)
    );
    const percentage = relativeY / scrollbar.height;
    const newPage = Math.max(
      1,
      Math.min(Math.ceil(percentage * totalPages), totalPages)
    );
    setpage(newPage);
    setDraggedPage(newPage); // Update draggedPage but don't scroll yet
  };

  const handleDragStart = () => setIsDragging(true);

  const handleDragEnd = () => {
    setIsDragging(false);
    setCurrentPage(draggedPage); // Update the current page
    scrollToPage(draggedPage); // Scroll to the dragged page
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleDrag(e);
    const handleMouseUp = handleDragEnd;

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, draggedPage]);

  return (
    <div className="h-screen absolute top-36">
      <div
        className="flex h-[80%] mt-44 w-full  relative"
        style={{ userSelect: "none" }}
      >
        <div className="absolute right-0 top-0 h-full">
          <div
            ref={scrollbarRef}
            className="w-[6px] h-full  relative rounded-full mr-1"
          >
            <div
              className="absolute right-6 -ml-24   p-2 rounded transform -translate-x-2 flex flex-col justify-center items-center space-y-2"
              style={{
                top: `${((draggedPage - 1) / (totalPages - 1)) * 100}%`,
                transform: "translateY(-50%)",
              }}
            >
              <div>
                {page}/ <span className="text-slate-500">{totalPages}</span>
              </div>
              <Document
                file={pdfData}
                className={" shadow-lg rounded-md overflow-hidden"}
              >
                <div>
                  <Thumbnail pageNumber={page} scale={0.2} />
                </div>
              </Document>
            </div>
            <div
              className="w-[6px] h-[71px] bg-purple-500 cursor-pointer rounded-full transform transition-transform duration-300 hover:scale-150"
              style={{
                position: "absolute",
                top: `${((draggedPage - 1) / (totalPages - 1)) * 100}%`,
                transform: "translateY(-50%)", // Inline transform to adjust position
              }}
              onMouseDown={handleDragStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewMode = {
  SINGLE: "single",
  DOUBLE: "double",
  CAROUSEL: "carousel",
};

const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);

  const {
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    setisPagesZoomingFromGesture,
  } = useSettings();

  const containerRef = useRef(null);

  const handleDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

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

  const renderCarousel = (commonProps) => {
    const visiblePages = [-1, 0, 1]
      .map((offset) => currentPage + offset)
      .filter((pageNum) => pageNum >= 1 && pageNum <= numPages);

    return (
      <div className="w-full h-full flex justify-center items-center relative">
        <button
          onClick={() => handleCarouselScroll("prev")}
          disabled={currentPage === 1 || isTransitioning}
          className="absolute left-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative w-full flex justify-center items-center overflow-hidden">
          {visiblePages.map((pageNum) => {
            const position = pageNum - currentPage;
            const translateX = isTransitioning
              ? slideDirection === "next"
                ? position === 0
                  ? "-100%"
                  : position === 1
                  ? "0"
                  : "100%"
                : position === 0
                ? "100%"
                : position === -1
                ? "0"
                : "-100%"
              : position === 0
              ? "0"
              : position < 0
              ? "-100%"
              : "100%";

            return (
              <div
                key={`page-${pageNum}`}
                className="absolute transform transition-all duration-300"
                style={{
                  transform: `translateX(${translateX})`,
                  opacity: isTransitioning || pageNum === currentPage ? 1 : 0,
                }}
              >
                <PDFPage
                  pageNumber={pageNum}
                  isVisible={true}
                  {...commonProps}
                  zoom={zoom}
                  setZoom={setZoom}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => handleCarouselScroll("next")}
          disabled={currentPage === numPages || isTransitioning}
          className="absolute right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );
  };

  const renderPages = () => {
    if (!numPages) return null;

    const commonProps = {
      zoom,
      pageWidth: 850,
      viewMode,
    };

    switch (viewMode) {
      case ViewMode.SINGLE:
        return renderSinglePage(commonProps);
      case ViewMode.DOUBLE:
        return renderDoublePage(commonProps);
      case ViewMode.CAROUSEL:
        return renderCarousel(commonProps);
      default:
        return null;
    }
  };

  const handleZoomChange = (value) => {
    setZoom(value[0]);
    setisPagesZoomingFromGesture(true);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="fixed top-4 right-4 z-50">
          <Slider
            min={0.5}
            max={3}
            step={0.1}
            value={[zoom]}
            onValueChange={handleZoomChange}
            className="w-40"
          />
        </div>

        <div ref={containerRef} className="flex-1 overflow-auto p-4">
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
