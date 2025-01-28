"use client";
import dynamic from "next/dynamic";
import React, { useState, useCallback, useEffect } from "react";

import {
  ExcalidrawElement,
  ExcalidrawImageElement,
} from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types";
import { Tool } from "@/types/pdf";
import { getNoteById, syncNote } from "@/db/note/Note";
import { ActiveTool, useSettings } from "@/context/SettingsContext";
import {
  convertToExcalidrawElements,
  restoreElements,
} from "@excalidraw/excalidraw";
import { Button } from "@/components/ui/button";
import { getAppState } from "@/db/note/canvas";
import { saveAppState } from "@/db/note/canvas";
import { v4 as uuidv4 } from "uuid";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw), // Adjust the import path if necessary
  { ssr: false } // Disable server-side rendering
);

const ExcalidrawComponent = ({ id }: { id: string }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();
  const [zoom, setZoom] = useState<number>(1);
  const { setIsVisible, data, setData,activeTool ,selectedColor,setActiveTool } = useSettings();

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const handleInitialize = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawAPI(api);
    console.log("Excalidraw API initialized:", api);
  }, []);

  // Handle changes in the Excalidraw component
  const handleChange = (
    elements: readonly ExcalidrawElement[],
    state: AppState,
    files: BinaryFiles
  ) => {
    if (elements.length < 1) return;
    setIsVisible(false);

    const zoomValue = state?.zoom.value;

    setZoom(zoomValue);
    save();
  };

  const save = async () => {
    const elements = excalidrawAPI?.getSceneElements();
    const state = data ? excalidrawAPI?.getAppState() : {};
    const files = excalidrawAPI?.getFiles();
    // saveCanvas(elements, state,files,pageIndex);
    await saveAppState(id, elements, state, files, 1);
  };

  useEffect(() => {
    async function fetchAndSetCanvas() {
      try {
        const canvasData = await getAppState(id, 1);
        if (canvasData && excalidrawAPI) {
          // Add files first if they exist
          if (canvasData.files) {
            excalidrawAPI.addFiles(
              Object.entries(canvasData.files).map(([id, file]) => ({
                id,
                ...file,
              }))
            );
          }

          // Then update the scene
          excalidrawAPI.updateScene({
            elements: canvasData.elements,
            appState: data ? canvasData.appState : {},
          });
          setInitialDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching canvas:", error);
      }
    }

    fetchAndSetCanvas();
  }, [excalidrawAPI]);

  const switchTool = (selectedTool: ActiveTool["type"]) => {
    if (!excalidrawAPI) return;
    console.log("this is from the switch tool", selectedTool);
    const resetToolProperties = () => {
      excalidrawAPI.updateScene({
        appState: {
          currentItemStrokeColor: "#000000",
          currentItemStrokeWidth: 1,
          currentItemOpacity: 100,
        },
      });
    };

    switch (selectedTool) {
      case "pen":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "freedraw" });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: activeTool?.color,
          },
        });
        break;
      case "pencil":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "freedraw" });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: activeTool?.color,
            currentItemStrokeWidth: 2,
            currentItemOpacity: 90,
          },
        });
        break;
      case "image":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "image" });
        break;
      case "arrow":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "arrow" });
        break;
      case "line":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "line" });
        break;
      case "objectEraser":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "eraser" });
        break;
      case "circle":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "ellipse" });
        break;
      case "square":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "rectangle" });
        break;
      case "diamond":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "diamond" });
        break;
      case "highlighter":
        excalidrawAPI.setActiveTool({ type: "freedraw" });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: activeTool?.color,
            currentItemStrokeWidth: 4,
            currentItemOpacity: 50,
          },
        });

        break;
      case "texthighlighter":
        excalidrawAPI.setActiveTool({ type: "line" });
        excalidrawAPI.updateScene({
          appState: {
            currentItemStrokeColor: activeTool?.color,
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
            currentItemStrokeColor: activeTool?.color,
          },
        });
        break;
      case "rectangleSelection":
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "selection" });
        break;

      case "undo":
        resetToolProperties();
        undo();
        break;

      case "redo":
        resetToolProperties();
        excalidrawAPI.history.redoOnce();
        break;

      default:
        resetToolProperties();
        excalidrawAPI.setActiveTool({ type: "selection" });
    }
  };

  useEffect(() => {
    if(!activeTool?.id) return
    switchTool(activeTool.id);
    console.log(activeTool.id)
  }, [activeTool?.id,activeTool?.color, excalidrawAPI]);


  const addImageToExcalidraw = async (x: number, y: number) => {
    if (!excalidrawAPI || !data) return;
    console.log("adding at ", data.url);

    const imageDataURL = data.url;
    const selectionStart = data.selection;
    const selectionBounds = data.bounds;

    const imageId = uuidv4();

    // Create the image file object
    const imageFile = {
      id: imageId,
      dataURL: imageDataURL,
      mimeType: "image/png",
      created: Date.now(),
      lastRetrieved: Date.now(),
    };

    try {
      // Add the file to Excalidraw
      await excalidrawAPI.addFiles([imageFile]);

      // Create the image element
      const imageElement = {
        type: "image",
        fileId: imageId,
        status: "saved",
        x: x,
        y: y,
        width: selectionBounds.width,
        height: selectionBounds.height,
        backgroundColor: "",
        version: 1,
        seed: Math.random(),
        versionNonce: Date.now(),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
      };

      // Get current scene elements and add new image
      const elements = [
        ...excalidrawAPI.getSceneElementsIncludingDeleted(),
        imageElement,
      ];

      const appState = excalidrawAPI.getAppState();

      // Update the Excalidraw scene and wait for it to complete
      await excalidrawAPI.updateScene({
        elements: restoreElements(elements),
        appState,
      });

      // Reset data state after successful update
      setTimeout(() => {
        setData(null);
      }, 1000);
    } catch (error) {
      console.error("Error adding image to Excalidraw:", error);
      // Optionally handle the error state
      setData(null);
    }
  };

  useEffect(() => {
    // Add a global keydown event listener
    const handleGlobalKeyDown = (event) => {
      if (event.ctrlKey && event.key === "v") {
        alert("Global Ctrl+V detected!");
      }
    };

    // Attach the event listener to the window
    window.addEventListener("keydown", handleGlobalKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className={`w-full h-full ${data ? "canvas-dotted" : ""}`}>
      <Excalidraw
        onChange={handleChange}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        // handleKeyboardGlobally={false}
        zenModeEnabled={false}
        // gridModeEnabled={true}
        onPointerDown={(e, s) => {
          addImageToExcalidraw(s.origin.x, s.origin.y);
        }}
        initialData={{
          appState: data
            ? {
                viewBackgroundColor: "transparent",
                currentItemStrokeColor: "#000000",
                currentItemBackgroundColor: "transparent",
              }
            : {},
        }}
      />
    </div>
  );
};

export default ExcalidrawComponent;
