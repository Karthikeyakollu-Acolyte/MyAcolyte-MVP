"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import { getAppState, saveAppState } from "@/db/pdf/canvas";

import { useSettings } from "@/context/SettingsContext";
import type { ActiveTool } from "@/context/SettingsContext";
import html2canvas from "html2canvas";
import { ReceiptEuro, X } from "lucide-react";
import "@/components/canvas/excalidraw/CustomExcalidraw.css";

interface SelectionPoint {
  x: number;
  y: number;
}

interface SelectionBounds {
  width: number;
  height: number;
}

interface Data {
  url: object | null;
  bounds: SelectionBounds;
}

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false }
);

const ExcalidrawFabric = ({
  pageIndex,
  currentDocumentId,
  zoom,
}: {
  pageIndex?: number;
  currentDocumentId?: string;
}) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
  const {
    currentPage,
    setScrollPdf,
    setData,
    activeTool,
    setActiveTool,
    setisHeadderVisible,
    setispagesZooming,
    setisPagesZoomingFromGesture,
    ispagesZooming,
  } = useSettings();

  const initialAppState: AppState = {
    zoom: { value: zoom },
    scrollX: 0,
    scrollY: 0,
  };
  const initialAppState1: AppState = {
    zoom: { value: 1 },
    scrollX: 0,
    scrollY: 0,
  };
  const [screenshotUrl, setScreenshotUrl] = useState(null);

  const hideAllElements = () => {
    const excalidraw = excalidrawAPI?.getSceneElements();
    const hiddenElements = excalidraw?.map((el) => {
      el.isDeleted = true; // Set isDeleted to true to hide
      return el;
    });
    excalidrawAPI?.updateScene({ elements: hiddenElements });
  };

  // Function to enable all elements
  const enableAllElements = () => {
    const excalidraw = excalidrawAPI?.getSceneElements();
    const enabledElements = excalidraw?.map((el) => {
      el.isDeleted = false; // Set isDeleted to false to show
      return el;
    });
    excalidrawAPI?.updateScene({ elements: enabledElements });
  };

  const handleChange = (
    elements: readonly ExcalidrawElement[],
    state: AppState
  ) => {
    if (!excalidrawAPI) return;
    let shouldUpdateScene = false;
    const newAppState: Pick<AppState, keyof AppState> = { ...state };
    const appstate = excalidrawAPI.getAppState();
    // console.log(elements);

    if (activeTool?.id === "rectangleSelection") {
      if (state.zoom.value !== initialAppState1.zoom.value) {
        newAppState.zoom = { value: initialAppState1.zoom.value };
        // hideAllElements()
        shouldUpdateScene = true;
      }
    } else if (state.zoom.value !== initialAppState.zoom.value) {
      newAppState.zoom = { value: initialAppState.zoom.value };
      shouldUpdateScene = true;
    }

    if (state.scrollX !== initialAppState.scrollX) {
      newAppState.scrollX = initialAppState.scrollX;
      shouldUpdateScene = true;
    }

    if (state.scrollY !== initialAppState.scrollY) {
      newAppState.scrollY = initialAppState.scrollY;
      shouldUpdateScene = true;
    }

    if (shouldUpdateScene) {
      excalidrawAPI.updateScene({
        appState: {
          ...appstate,
          ...newAppState,
        },
      });


      setisHeadderVisible(true);
      setispagesZooming(true);
      // setZoom((prev:number)=> prev+0.1)
      setTimeout(() => {
        setispagesZooming(false);
        // setZoom((prev:number) => prev-0.1)
        setisPagesZoomingFromGesture(false);
      }, 800);
    }
  };

  const save = async () => {
    const elements = excalidrawAPI?.getSceneElements();
    const state = excalidrawAPI?.getAppState();
    const files = excalidrawAPI?.getFiles();
    // console.log("saving..");
    await saveAppState(currentDocumentId, elements, state, files, pageIndex);
  };

  useEffect(() => {
    async function fetchAndSetCanvas() {
      try {
        const canvasData = await getAppState(currentDocumentId, pageIndex);
        if (canvasData && excalidrawAPI) {
          if (canvasData.files) {
            excalidrawAPI.addFiles(
              Object.entries(canvasData.files).map(([id, file]) => ({
                id,
                ...file,
              }))
            );
          }
          excalidrawAPI.updateScene({
            elements: canvasData.elements,
            appState: canvasData.appState,
          });
        }
      } catch (error) {
        console.error("Error fetching canvas:", error);
      }
    }

    fetchAndSetCanvas();
  }, [pageIndex, currentDocumentId, excalidrawAPI]);

  let isUndoing = false; // Flag to prevent multiple undo actions


   // Handle undo action
 const undo = () => {
  const excalidrawEle = document.getElementById(`excalidraw-page-${currentPage}`)
  console.log(excalidrawEle)
  const undoButton = excalidrawEle.querySelector('[aria-label="Undo"]');
  if(undoButton){
    undoButton?.click()
    console.log("clicking....")
  }
};

// Handle redo action
const redo = () => {
  const excalidrawEle = document.getElementById(`excalidraw-page-${currentPage}`)
  const undoButton = excalidrawEle.querySelector('[aria-label="Redo"]');
  console.log(undoButton)
  if(undoButton){
    undoButton?.click()
    console.log("clicking....")
  }
};


  const switchTool = (selectedTool: ActiveTool["type"]) => {
    if (!excalidrawAPI) return;

    console.log("Switching tool:", selectedTool);

    // Reset tool properties
    const resetToolProperties = () => {
      excalidrawAPI.updateScene({
        appState: {
          currentItemStrokeColor: "#000000",
          currentItemStrokeWidth: 1,
          currentItemOpacity: 100,
        },
      });
    };

    // Define active tool properties with safe defaults
    const toolProperties = activeTool || {
      strokeColor: "#000000",
      strokeWidth: 1,
      opacity: 100,
      fillColor: "transparent",
      color: "#000000",
    };

    switch (selectedTool) {
      case "pen":
      case "pencil":
      case "highlighter":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "freedraw" });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: toolProperties.color,
            currentItemOpacity: toolProperties.opacity,
            currentItemStrokeWidth: toolProperties.strokeWidth,
          },
        });
        break;

      case "image":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "image" });
        break;

      case "arrow":
      case "line":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: selectedTool });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: toolProperties.strokeColor,
            currentItemStrokeWidth: toolProperties.strokeWidth,
            currentItemOpacity: toolProperties.opacity,
          },
        });
        break;

      case "circle":
      case "rectangle":
      case "diamond":
        resetToolProperties();
        console.log(activeTool);

        // Map the selected tool properly
        const mappedTool =
          selectedTool === "circle"
            ? "ellipse"
            : selectedTool === "rectangle"
            ? "rectangle"
            : selectedTool;

        excalidrawAPI.setActiveTool({ type: mappedTool });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: toolProperties.strokeColor || "#000000",
            currentItemStrokeWidth: toolProperties.strokeWidth || 2,
            currentItemOpacity: toolProperties.opacity || 100,
            currentItemBackgroundColor:
              toolProperties?.fillColor || "transparent",
          },
        });
        break;

      case "texthighlighter":
        excalidrawAPI.setActiveTool({ type: "line" });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: toolProperties.color,
            currentItemStrokeWidth: 20,
            currentItemOpacity: 50,
          },
        });
        break;

      case "text":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "text" });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: toolProperties.color,
          },
        });
        break;

      case "objectEraser":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "eraser" });
        break;

      case "rectangleSelection":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "selection" });
        break;

      case "undo":
         console.log(currentPage===pageIndex)
         if(currentPage!=pageIndex) return
          resetToolProperties();
          undo();
          setActiveTool(null);
          break;
      case "redo":
        console.log(currentPage===pageIndex)
        if(currentPage!=pageIndex) return
          resetToolProperties();
          redo();
          setActiveTool(null);
          break;

      default:
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "selection" });
    }
  };

  useEffect(() => {
    if (!activeTool?.id) return;
    switchTool(activeTool.id);
    console.log(activeTool.id);
  }, [
    activeTool?.id,
    activeTool?.color,
    excalidrawAPI,
    activeTool?.opacity,
    activeTool?.fillColor,
    activeTool?.strokeColor,
    activeTool?.strokeWidth,
    currentPage
  ]);

  let imageBounds;

  const captureScreenshot = async (selectionStart, selectionEnd) => {
    try {
      if (!selectionStart || !selectionEnd) return;

      const pageElement = document.querySelector(
        `[data-page-number="${pageIndex}"] .react-pdf__Page__canvas`
      );

      if (!pageElement) {
        console.error("Page element not found");
        return;
      }

      const pageRect = pageElement.getBoundingClientRect();

      // Adjust selection bounds based on zoom
      const selectionBounds = {
        x: Math.max(
          0,
          Math.min(selectionStart.x, selectionEnd.x) + pageRect.left
        ),
        y: Math.max(
          0,
          Math.min(selectionStart.y, selectionEnd.y) + pageRect.top
        ),
        width: Math.abs(selectionEnd.x - selectionStart.x),
        height: Math.abs(selectionEnd.y - selectionStart.y),
      };
      const scale = 1;

      const scaledBounds = {
        x: selectionBounds.x / scale,
        y: selectionBounds.y / scale,
        width: selectionBounds.width / scale,
        height: selectionBounds.height / scale,
      };

      if (scaledBounds.width <= 0 || scaledBounds.height <= 0) {
        console.error("Invalid dimensions");
        return;
      }

      const canvas = await html2canvas(pageElement, {
        backgroundColor: null,
        x: scaledBounds.x,
        y: scaledBounds.y,
        width: scaledBounds.width,
        height: scaledBounds.height,
        useCORS: true,
      });

      imageBounds = scaledBounds;

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Blob creation failed"));
          } else {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(blob);
          }
        }, "image/png");
      });
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      throw error;
    }
  };

  let data: Data = {
    url: null,
    bounds: { width: 0, height: 0 },
  };

  let selectionStart = null;

  const handlePointerUpdate = (payload: {
    pointer: { x: number; y: number; tool: "pointer" | "laser" };
    button: "down" | "up";
    pointersMap: Gesture["pointers"];
  }) => {
    save();
    if (!(activeTool?.id === "rectangleSelection")) return;

    excalidrawAPI?.updateScene({ appState: { zoom: { value: 1 } } });
    const { pointer, button } = payload;
    const pageElement = document.querySelector(
      `[data-page-number="${pageIndex}"]`
    );

    if (!pageElement) return;

    const pageRect = pageElement.getBoundingClientRect();

    if (button === "down") {
      if (selectionStart === null) {
        selectionStart = {
          x: pointer.x - pageRect.left,
          y: pointer.y - pageRect.top,
        };
      }
    } else if (button === "up") {
      if (selectionStart) {
        const selectionEnd = {
          x: pointer.x - pageRect.left,
          y: pointer.y - pageRect.top,
        };

        captureSelection(selectionStart, selectionEnd);
        setActiveTool(null);
        selectionStart = null;
      }
    }
  };

  const captureSelection = async (
    selectionStart: SelectionPoint,
    selectionEnd: SelectionPoint
  ) => {
    const imageDataURL = await captureScreenshot(selectionStart, selectionEnd);

    if (imageDataURL) {
      setScreenshotUrl(imageDataURL);
      data = {
        url: imageDataURL,
        bounds: imageBounds,
      };
      setData(data);
    }
  };

  useEffect(() => {
    const appState = excalidrawAPI?.getAppState();
    if (!appState) return;

    // Update zoom directly using the app state
    excalidrawAPI?.updateScene({
      appState: {
        // ...appState, // Spread the existing state to avoid overwriting
        zoom: { value: zoom }, // Update the zoom value
      },
    });
  }, [zoom]);

  return (
    <div
      className="w-full h-full"
      // style={{ pointerEvents: ispagesZooming ? "none" : "auto" }}
    >
      <Excalidraw
        onPointerDown={(e) => {}}
        onPointerUpdate={handlePointerUpdate}
        onChange={handleChange}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        handleKeyboardGlobally={false}
        objectsSnapModeEnabled={false}
        // gridModeEnabled={true}
        theme="light"
        viewModeEnabled={false}
        initialData={{
          appState: {
            viewBackgroundColor: "transparent",
            currentItemStrokeColor: "#000000",
            currentItemBackgroundColor: "transparent",
            scrollX: 0,
            scrollY: 0,
            theme: "light",
          },
        }}
      />
    </div>
  );
};

export default ExcalidrawFabric;

interface ScreenshotOverlayProps {
  screenshotUrl: string;
  onClose: () => void;
}

export const ScreenshotOverlay = ({
  screenshotUrl,
  onClose,
}: ScreenshotOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-4xl w-full mx-4 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="overflow-auto max-h-[80vh]">
          <img
            src={screenshotUrl}
            alt="Selection Screenshot"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};
