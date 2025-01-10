"use client";
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { useRefs } from './sharedRefs';
import { Note } from '@/types/pdf';
import React from 'react';

interface SettingsContextType {
  scrollMode: "vertical" | "horizontal" | "two-page";
  toggleScrollMode: () => void;
  scrollToPage: (pageNumber: number) => void;
  rotateSinglePage: (pageNumber: number) => void;
  rotateAllPages: () => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setPages: Dispatch<SetStateAction<number>>
  pages: number;
  updatePageRects: (pageNumber: number | null) => DOMRect[];
  pageRects: DOMRect[];
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  selectedText: string;
  setSelectedText: React.Dispatch<React.SetStateAction<string>>;
  first: Boolean;
  setfirst: any,
  scale: number;
  setScale: any;
  currentDocumentId:string;
  setcurrentDocumentId:any;
  isInfinite:boolean;
  setIsInfinite:any



}



const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [scrollMode, setScrollMode] = useState<"vertical" | "horizontal" | "two-page">("vertical");
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const { pdfViewerRef } = useRefs()
  const [pageRects, setpageRects] = useState<DOMRect[]>([])
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [first, setfirst] = useState(false)
  const [scale, setScale] = useState<number>(0.9)
  const [currentDocumentId, setcurrentDocumentId] = useState<string>("")
  const [isInfinite, setIsInfinite] = useState<boolean>(false);

  const toggleScrollMode = () => {

    const pdfViewer = document.querySelector('.pdfViewer');
    if (!pdfViewer) return;

    setScrollMode((prevMode) => {
      pdfViewer.classList.remove("spread-1", "spread");
      if (prevMode === "vertical") {
        pdfViewer.classList.add("spread");
        // showPage(currentPage)
        return "horizontal";
      }
      if (prevMode === "horizontal") {
        pdfViewer.classList.add("spread-1");
        return "two-page";
      }
      return "vertical";
    });
    updatePageRects(null)
  };

  // Function to show only the current page and hide others
  function showPage(pageNumber: number) {
    // Ensure that pdfViewerRef is available
    const pdfViewer = document.querySelector('.pdfViewer');
    if (!pdfViewer) return;

    // Get all pages within the viewer
    const allPages = pdfViewer.querySelectorAll('[data-page-number]');

    // Hide all pages by setting their display style to 'none'
    allPages.forEach((page: HTMLElement) => {
      page.style.display = 'none';
    });

    // Show the selected page
    const pageElement = pdfViewer.querySelector(
      `[data-page-number="${pageNumber}"]`
    );

    if (pageElement) {
      pageElement.style.display = 'block'; // Show the selected page
    }
  }


  const scrollToPage = (pageNumber: number) => {
    // if (scrollMode === "single") {
    //   showPage(pageNumber);
    //   updatePageRects(null)
    // }
    const pageElement = document.querySelector(
      `[data-page-number="${pageNumber}"]`
    ) as HTMLElement;
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" });
    }
  };



  const rotateSinglePage = (pageNumber: number) => {
    updatePageRects(currentPage)
    const pageElement = document.querySelector(
      `[data-page-number="${pageNumber}"]`
    ) as HTMLElement;
    if (pageElement) {
      const currentRotation = parseInt(pageElement.getAttribute("data-main-rotation") || "0", 10);
      const newRotation = (currentRotation + 90) % 360;
      pageElement.setAttribute("data-main-rotation", newRotation.toString());
      pageElement.style.transform = `rotate(${newRotation}deg)`;
    }
  };


  const rotateAllPages = () => {
    updatePageRects(null)
    const allPages = document.querySelectorAll('[data-page-number]');
    allPages.forEach((pageElement) => {
      const currentRotation = parseInt(pageElement.getAttribute("data-main-rotation") || "0", 10);
      const newRotation = (currentRotation + 90) % 360;
      pageElement.setAttribute("data-main-rotation", newRotation.toString());
      (pageElement as HTMLElement).style.transform = `rotate(${newRotation}deg)`;
    });
  };


  const updatePageRects = (pageNumber: number | null) => {
    if (!pdfViewerRef) return;
    const pdfViewer = pdfViewerRef.current;

    if (!pdfViewer) { return; }

    // Initialize the array for page rects
    const pageRects: DOMRect[] = [];

    // Function to update a single page
    const updateSinglePage = (pageNum: number) => {
      const pageElement = document.querySelector(
        `[data-page-number="${pageNum}"]`
      ) as HTMLElement;
      const pageWrapper = document.querySelector(
        `#canvas-wrapper-${pageNum}`
      ) as HTMLElement;

      if (pageElement && pageWrapper) {
        const rect = pageElement.getBoundingClientRect();
        pageRects[pageNum - 1] = rect; // Update rects array for the specific page
        pageWrapper.style.top = `${rect.top}px`;
        pageWrapper.style.left = `${rect.left}px`;
        pageWrapper.style.width = `${rect.width}px`;
        pageWrapper.style.height = `${rect.height}px`;
        pageWrapper.style.zIndex = "10";
      }
    };

    if (typeof pageNumber === "number") {
      // Update a single page if pageNumber is provided
      updateSinglePage(pageNumber);
    } else {
      // Otherwise, update all pages
      console.log("Setting all page rects");
      for (let i = 1; i <= pages; i++) {
        updateSinglePage(i);
      }
    }

    // Update the state with the new rects
    setpageRects(pageRects);
    return pageRects;
  };

  return (
    <SettingsContext.Provider value={{ scrollMode, toggleScrollMode, scrollToPage, rotateSinglePage, rotateAllPages, currentPage, setCurrentPage, pages, setPages, pageRects, updatePageRects, notes, setNotes, selectedText, setSelectedText, first, setfirst, scale, setScale,currentDocumentId, setcurrentDocumentId,isInfinite, setIsInfinite }}>
      {children}
    </SettingsContext.Provider>
  );
}

