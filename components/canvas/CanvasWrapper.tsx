"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useToolContext } from "@/context/ToolContext";
import { FabricCanvas } from "./FabricCanvas";
import type { CanvasWrapperProps } from "@/types/pdf";
import { useRefs } from "@/context/sharedRefs";
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  PlusCircleIcon,
  UploadIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Layer, useCanvas } from "@/context/CanvasContext";
import { v4 as uuidv4 } from "uuid";
import { useSettings } from "@/context/SettingsContext";
import { getLayersById, syncLayers } from "@/db/pdf/layers";
import { LayerControls } from "./LayerControls";
import { CanvasLayer } from "./CanvasLayer";
import { LayerManagement } from "./LayerManagement";
import ReactDOM from "react-dom";
import ExcalidrawFabric from "./excalidraw/ExcalidrawFabric";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState } from "@excalidraw/excalidraw/types/types";
import { saveAppState } from "@/db/pdf/canvas";

// Types for the layer structure
interface CanvasData {
  elements: readonly ExcalidrawElement[];
  state: AppState;
}

export const CanvasWrapper: React.FC<CanvasWrapperProps> = ({
  pageRects,
  isDrawing,
  containerNodeRef,
  type,
}) => {
  const { setRect } = useCanvas();
  const { currentDocumentId,scale } = useSettings();



  const saveCanvas = async (
    elements: readonly ExcalidrawElement[],
    state: AppState,
    pageIndex: number
  ) => {
    await saveAppState(currentDocumentId, elements, state, pageIndex);
    console.log('Canvas saved:', currentDocumentId, pageIndex, elements, state);
  };
  

  // Update the rect based on the first page rect
  useEffect(() => {
    const rect = pageRects[0];
    if (rect) {
      setRect({ width: rect.width, height: rect.height });
    }
  }, [pageRects]);



  return (
    <>
      <div className="absolute" id="canvas-wrapper">
        {pageRects.map((rect, pageIndex) => (
      <div
      key={pageIndex}
        className="canvas-wrapper absolute"
        id={`canvas-wrapper-${pageIndex}`}
        style={{
          top: rect.top,
          width: rect.width - 5,
          height: rect.height,
          zIndex: 10 + pageIndex,
        }}
      >
        <ExcalidrawFabric pageIndex={pageIndex} saveCanvas={saveCanvas} key={pageIndex} currentDocumentId={currentDocumentId} />
      </div>
    ))
    }
      </div>
    </>
  );
};
