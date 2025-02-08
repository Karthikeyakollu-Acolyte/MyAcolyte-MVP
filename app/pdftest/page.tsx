"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut ,Rows, Columns ,Layout} from "lucide-react";
import { Document, Page, pdfjs, Thumbnail } from "react-pdf";
import { useInView } from "react-intersection-observer";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import ExcalidrawFabric from "@/components/canvas/excalidraw/test/ExcalidrawFabric";
import { getPdfById } from "@/db/pdf/docs";
import Toolbar from "@/components/Toolbar";

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
const PDFPage = ({ pageNumber, scale, isVisible }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className="relative mb-4">
      {(inView || isVisible) && (
        <>
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="shadow-lg mx-auto "
            renderTextLayer={true}
            renderAnnotationLayer={false}
            loading={`Loading page ${pageNumber}...`}
            error={`Error loading page ${pageNumber}`}
          />
          <div className="absolute top-0 left-0 w-full h-full pointer-events-auto ">
            <ExcalidrawFabric pageIndex={pageNumber} currentDocumentId="aaad8775-bf0e-4f35-8dc6-0dedea7db1a2" />
          </div>
        </>
      )}
    </div>
  );
};

// Thumbnail Scrollbar Component
const ThumbnailDiv = ({
  currentPage,
  setCurrentPage,
  totalPages,
  scrollToPage,
  url
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarRef = useRef(null);
  const [draggedPage, setDraggedPage] = useState(currentPage);
  const [page, setpage] = useState(1);

  useEffect(()=>{
    setpage(currentPage)
  },[currentPage])

  useEffect(()=>{
    scrollToPage(currentPage)
  },[draggedPage])

  

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
    <div className="h-screen">
      <div
        className="flex h-[80%] mt-44 w-full  relative"
        style={{ userSelect: "none" }}
      >
        <div className="absolute right-0 top-0 h-full">
          <div
            ref={scrollbarRef}
            className="w-[6px] h-full  relative rounded-full mr-1 bg-[#BBBBBB]"
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
              <Document file={url}  className={" shadow-lg rounded-md overflow-hidden"} >
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
  SINGLE: 'single',
  DOUBLE: 'double',
  CAROUSEL: 'carousel'
};

const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(2);
  const [viewMode, setViewMode] = useState(ViewMode.SINGLE);
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleScroll = () => {
    if (!containerRef.current || viewMode === ViewMode.CAROUSEL) return;

    const container = containerRef.current;
    const pages = container.getElementsByClassName("react-pdf__Page");
    const containerTop = container.getBoundingClientRect().top;

    let currentVisible = 1;
    let smallestDistance = Infinity;

    Array.from(pages).forEach((page, index) => {
      const rect = page.getBoundingClientRect();
      const distance = Math.abs(rect.top - containerTop);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        currentVisible = index + 1;
      }
    });

    setCurrentPage(currentVisible);
  };

  const handleCarouselScroll = (direction) => {
    if (isTransitioning) return;
    
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, numPages)
      : Math.max(currentPage - 1, 1);

    if (newPage !== currentPage) {
      setIsTransitioning(true);
      setCurrentPage(newPage);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && viewMode !== ViewMode.CAROUSEL) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === ViewMode.CAROUSEL) {
      const handleKeyPress = (e) => {
        if (e.key === 'ArrowRight') handleCarouselScroll('next');
        if (e.key === 'ArrowLeft') handleCarouselScroll('prev');
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [viewMode, currentPage, isTransitioning]);

  const scrollToPage = (pageNumber) => {
    const pages = containerRef.current.getElementsByClassName("react-pdf__Page");
    if (pages[pageNumber - 1]) {
      pages[pageNumber - 1].scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderPages = () => {
    if (!numPages) return null;

    switch (viewMode) {
      case ViewMode.SINGLE:
        return (
          <div className="flex flex-col gap-4 transition-all duration-300 ">
            {Array.from(new Array(numPages), (_, index) => (
              <div className="transform transition-transform duration-300 hover:scale-[1.02]" key={index}>
                <PDFPage
                  key={`page-${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                  isVisible={index + 1 === currentPage}
                />
              </div>
            ))}
          </div>
        );

      case ViewMode.DOUBLE:
        return (
          <div className="flex flex-col gap-4 transition-all duration-300">
            {Array.from(new Array(Math.ceil(numPages / 2)), (_, index) => (
              <div key={`spread-${index}`} className="flex gap-4 justify-center transform transition-transform duration-300 hover:scale-[1.02]">
                <PDFPage
                  pageNumber={index * 2 + 1}
                  scale={scale}
                  isVisible={index * 2 + 1 === currentPage}
                />
                {index * 2 + 2 <= numPages && (
                  <PDFPage
                    pageNumber={index * 2 + 2}
                    scale={scale}
                    isVisible={index * 2 + 2 === currentPage}
                  />
                )}
              </div>
            ))}
          </div>
        );

      case ViewMode.CAROUSEL:
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < numPages ? currentPage + 1 : null;
        return (
          <div className="flex gap-4 justify-center items-center min-h-full relative" >
            <button
              onClick={() => handleCarouselScroll('prev')}
              disabled={currentPage === 1 || isTransitioning}
              className="absolute left-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-8 transition-transform duration-300 ease-in-out">
              {prevPage && (
                <div className="opacity-50 transform scale-90 transition-all duration-300">
                  <PDFPage
                    pageNumber={prevPage}
                    scale={scale }
                    isVisible={false}
                  />
                </div>
              )}
              <div className="transform scale-110 transition-all duration-300">
                <PDFPage
                  pageNumber={currentPage}
                  scale={scale}
                  isVisible={true}
                />
              </div>
              {nextPage && (
                <div className="opacity-50 transform scale-90 transition-all duration-300">
                  <PDFPage
                    pageNumber={nextPage}
                    scale={scale}
                    isVisible={false}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => handleCarouselScroll('next')}
              disabled={currentPage === numPages || isTransitioning}
              className="absolute right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <span className="text-sm">Page: {currentPage}/{numPages}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode(ViewMode.SINGLE)}
                className={`p-2 rounded transition-colors duration-200 ${viewMode === ViewMode.SINGLE ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
              >
                <Rows className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(ViewMode.DOUBLE)}
                className={`p-2 rounded transition-colors duration-200 ${viewMode === ViewMode.DOUBLE ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
              >
                <Layout className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(ViewMode.CAROUSEL)}
                className={`p-2 rounded transition-colors duration-200 ${viewMode === ViewMode.CAROUSEL ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
              >
                <Columns className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setScale((s) => Math.max(0.4, s - 0.2))}
              className="p-2 rounded transition-colors duration-200 hover:bg-gray-200"
              disabled={scale <= 0.4}
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => s + 0.2)}
              className="p-2 rounded transition-colors duration-200 hover:bg-gray-200"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div 
          ref={containerRef} 
          className={`flex-1 overflow-auto bg-gray-100 p-4 ${
            viewMode === ViewMode.CAROUSEL ? 'overflow-x-auto whitespace-nowrap' : 'overflow-y-auto'
          }`}
        >
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
      <div className="w-48 bg-gray-100 overflow-y-auto border-l">
        <ThumbnailDiv
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={numPages}
          scrollToPage={scrollToPage}
          url={url}
        />
      </div>
    </div>
  );
};
const page = () => {

  const [pdfData, setPdfData] = useState<string | null>(null);

    const handleFetchPdf = async () => {
          try {
            // d97e169c-ea97-4de6-a2fe-68e3547498e6
            const pdf = await getPdfById('d97e169c-ea97-4de6-a2fe-68e3547498e6');
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
         
          handleFetchPdf()
      }, [])
  
  return (
    <div>

     <PDFViewer url={pdfData} />

      <Toolbar/>
    </div>
  );
};

export default page;
