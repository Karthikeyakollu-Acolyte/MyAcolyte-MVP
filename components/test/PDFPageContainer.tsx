"use client";
import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useInView } from "react-intersection-observer";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useSettings } from "@/context/SettingsContext";
import { debounce } from "lodash";

const ExcalidrawFabric = lazy(() => import('@/components/canvas/excalidraw/test/ExcalidrawFabric'));
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

// Memoized PDFPageView component
const PDFPageView = React.memo(({ pageNumber, zoom, isDarkFilter, onLoad }) => (
  <div style={{ filter: isDarkFilter ? "invert(1)" : "" }}>
    <Page
      pageNumber={pageNumber}
      scale={zoom}
      onLoadSuccess={onLoad}
      className="mx-auto rounded-md overflow-hidden"
      renderTextLayer={true}
      renderAnnotationLayer={false}
      loading={<Loading message={`Loading page ${pageNumber}...`} />}
      error={<ErrorComponent message={`Error loading page ${pageNumber}`} />}
    />
  </div>
));

// Memoized ExcalidrawOverlay component
const ExcalidrawOverlay = React.memo(({
  pageNumber,
  currentDocumentId,
  zoom,
  setZoom,
  scrollPdf,
}) => (
  <div
    className="absolute top-0 left-0 w-full h-full"
    id={`excalidraw-page-${pageNumber}`}
    style={{ pointerEvents: scrollPdf ? "none" : "auto" }}
  >
    <Suspense fallback={null}>
      <ExcalidrawFabric
        pageIndex={pageNumber}
        currentDocumentId={currentDocumentId}
        zoom={zoom / 5}
        setZoom={setZoom}
      />
    </Suspense>
  </div>
));

// Memoized PDFPageContainer component
const PDFPageContainer = ({
  pageNumber,
  zoom,
  setZoom,
  pageWidth,
  viewMode,
  fitToWidth,
  isExpanded,
  scaledWidth,
  onPageInView
}) => {
  const containerRef = useRef(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px 0px",
    triggerOnce: false,
  });
  const [pageView, setPageView] = useState();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { isDarkFilter, currentDocumentId, scrollPdf } = useSettings();
  useEffect(() => {
    if (inView) {
      onPageInView(pageNumber);
      console.log(pageNumber)
    }
  }, [inView, pageNumber, onPageInView]);

  // Combine refs
  const setRefs = useCallback((node) => {
    containerRef.current = node;
    inViewRef(node);
  }, [inViewRef]);

  // Memoized load success handler
  const handleLoadSuccess = useCallback((page) => {
    setPageView(page);
    setIsPageLoaded(true);
  }, []);

  // Debounce the zoom adjustment to prevent flickering
  const debouncedSetZoom = useCallback(
    debounce((newZoom) => {
      setZoom(newZoom);


    },0), // 200ms debounce time (adjust this value as needed)
    [setZoom]
  );

  // Calculate zoom only when necessary
  useEffect(() => {
    if (!isPageLoaded || !pageView) return;

    const calculateZoom = () => {
      const targetWidth = isExpanded
        ? pageWidth
        : viewMode === ViewMode.SINGLE
        ? 800 
        : pageWidth;
      return targetWidth / pageView.view[2];
    };

    if (fitToWidth) {
      const newZoom = calculateZoom();
      debouncedSetZoom(newZoom); // Use the debounced setter
    }
  }, [isPageLoaded, pageView, fitToWidth, isExpanded, pageWidth, viewMode, debouncedSetZoom]);

  // Only render content when in view or nearby
  return (
    <div ref={setRefs} className="scrollbar-hidden max-w-full relative"
    >
      {(true) && (
        <div className="w-full">
          <PDFPageView
            pageNumber={pageNumber}
            zoom={zoom}
            scaledWidth={scaledWidth}
            isDarkFilter={isDarkFilter}
            onLoad={handleLoadSuccess}
          />
          {/* Uncomment this section for Excalidraw overlay */}
          {isPageLoaded && (
            <ExcalidrawOverlay
              pageNumber={pageNumber}
              currentDocumentId={currentDocumentId}
              zoom={zoom}
              setZoom={setZoom}
              scrollPdf={scrollPdf}
            />
          )}
        </div>
      )}
    </div>
  );
};


export default React.memo(PDFPageContainer);