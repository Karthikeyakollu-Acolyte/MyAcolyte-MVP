"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

const ExcalidrawWithUndoRedo = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [elements, setElements] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Function to handle updating elements (bulk update)
  const updateScene = useCallback((newElements) => {
    // Store the current state in the undo stack before updating
    setUndoStack((prev) => [...prev, elements]);
    // Update elements with the new list
    setElements(newElements);
    // Clear the redo stack since we've made a new action
    setRedoStack([]);
  }, [elements]);

  // Handle undo action
  const undo = () => {
    const undoButton = document.querySelector('[aria-label="Undo"]');
    if(undoButton){
      undoButton?.click()
    }
  };

  // Handle redo action
  const redo = () => {
    const undoButton = document.querySelector('[aria-label="Redo"]');
    console.log(undoButton)
    if(undoButton){
      undoButton?.click()
    }
  };

  // Update the scene when elements change
  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: elements,
      });
    }
  }, [excalidrawAPI, elements]);

  return (
    <div className="w-[100vw] h-[80vh]">
      <div style={{ marginBottom: "200px",cursor:'pointer' }}>
        <button onClick={undo} >
          Undo
        </button>
        <button onClick={redo} >
          Redo
        </button>
      </div>
      <div className="mt-52 border-2 w-[90%] h-[50%]">
      <Excalidraw
        onPointerUpdate={() =>{ updateScene(excalidrawAPI?.getSceneElementsIncludingDeleted())}}
        excalidrawAPI={setExcalidrawAPI}
        initialData={{ elements: [] }}

      />
      </div>
    </div>
  );
};

export default ExcalidrawWithUndoRedo;