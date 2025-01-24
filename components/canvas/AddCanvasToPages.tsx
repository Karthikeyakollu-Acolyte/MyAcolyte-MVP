"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { ToolProvider } from "@/context/ToolContext";
import { RefsProvider } from "@/context/sharedRefs";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import ExcalidrawFabric from "./excalidraw/ExcalidrawFabric";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState } from "@excalidraw/excalidraw/types/types";
import { createRoot } from "react-dom/client";

export const AddCanvasToPages = () => {
  const { currentDocumentId, pages } = useSettings();
  const rootsRef = useRef(new Map());

  const saveCanvas = async (
    elements: readonly ExcalidrawElement[],
    state: AppState,
    pageIndex: number,
    files
  ) => {
    // await saveAppState(currentDocumentId, elements, state, files, pageIndex);
  };

  useEffect(() => {
    const pageNumbers = Array.from({ length: 3 }, (_, i) => i);

    // Create container divs if they don't exist
    pageNumbers.forEach((pageNumber) => {
      let container = document.getElementById(`pageExcalidraw-${pageNumber}`);
      if (!container) {
        container = document.createElement('div');
        container.id = `pageExcalidraw-${pageNumber}`;
        container.className = 'w-full h-full';
        document.body.appendChild(container); // Adjust append location as needed
      }
    });

    const currentRoots = new Map();

    pageNumbers.forEach((pageNumber) => {
      const container = document.getElementById(`pageExcalidraw-${pageNumber}`);
      if (container && !rootsRef.current.has(pageNumber)) {
        const root = createRoot(container);
        root.render(
          <ToolProvider>
            <RefsProvider>
              <SettingsProvider>
                <div className="w-full h-full bg-black">hello</div>
              </SettingsProvider>
            </RefsProvider>
          </ToolProvider>
        );
        currentRoots.set(pageNumber, root);
      }
    });

    rootsRef.current = currentRoots;

    return () => {
      setTimeout(() => {
        currentRoots.forEach((root) => {
          root.unmount();
        });
      }, 0);
    };
  }, []);

  return (null
  );
};