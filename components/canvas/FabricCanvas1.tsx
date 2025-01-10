"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { CanvasInitializer } from "./CanvasInitializer";
import { ConfigureTools } from "./ConfigureTools";
import type { CustomFabricObject, FabricCanvasProps } from "@/types/pdf";
import { useSettings } from "@/context/SettingsContext";
import { useCanvas } from "@/context/CanvasContext";
import DropCanvas from "./DropCanvas";
import page from "@/app/canvas/page";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
// const initialObjects = [
//   {
//     type: 'rect',
//     left: 100,
//     top: 100,
//     width: 200,
//     height: 100,
//     fill: 'red'
//   },
//   {
//     type: 'circle',
//     left: 300,
//     top: 200,
//     radius: 50,
//     fill: 'blue'
//   },
//   {
//     type: 'text',
//     left: 150,
//     top: 50,
//     text: 'Hello, Fabric.js!',
//     fontSize: 20,
//     fill: 'black'
//   }
// ];

export const FabricCanvas = ({
  rect,
  tool,
  brushSize,
  brushColor,
  index,
  eraserSize,
  setSelectedTool,
  isDrawing,
  saveLayerContent,
  initialContent,
  pageIndex,
  noteContent,
  scaleState
}: FabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const loopPathRef = useRef(null);
  const [loopPoints, setLoopPoints] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [layers, setLayers] = useState([]);

  const { selectedText, notes, setCurrentPage } = useSettings()
  const { handleCanvasChange, handleCanvasChangeRealtime } = useCanvas()
  const [canvasObjects, setCanvasObjects] = useState([]);



  const infiniteCanvasIndex = -1


  const updateCanvasContent = (e) => {
    const content = fabricCanvas.current?.toJSON();
    console.log("saving this shitt")
    // return
    if (content) {

      if (pageIndex == infiniteCanvasIndex)// which means im the infinite canvas
      {

        // handleCanvasChangeRealtime(infiniteCanvasIndex, content, { width: rect?.width, height: rect?.height })
        // updateCanvasContentInfinite(e)
        console.log("Im the infinite canvas")
        saveLayerContent(content);

      } else { // which means im in page canvas
        handleCanvasChangeRealtime(pageIndex, content, { width: rect?.width, height: rect?.height })
        saveLayerContent(content);

      }

    }

  };

  let savedObjects: any = []; // Array to store individual object JSONs

  const updateCanvasContentInfinite = (event) => {
    const updatedObject = event.target;

    if (!updatedObject) {
      console.warn("No updated object found.");
      return;
    }


    // Log the `objectId` to confirm it exists
    console.log('Object ID:', updatedObject.objectId);

    // Convert the updated object to JSON format
    const updatedObjectJson = updatedObject.toJSON();

    // Check if the object already exists in the savedObjects array
    const index = savedObjects.findIndex(obj => obj.objectId === updatedObjectJson.objectId);

    console.log(updatedObjectJson.objectId, index);
    if (index > -1) {
      // Update the existing object
      savedObjects[index] = updatedObjectJson;
    } else {
      // Add the new object
      savedObjects.push(updatedObjectJson);
    }

    // Log the saved objects for debugging
    console.log("Saved objects:", savedObjects);
  };

  const updateCanvasContent1 = (e) => {
    const { objectId } = e.target;
    const objectJson = e.target.toJSON();

    // Save to localStorage
    setCanvasObjects(prevObjects => {
      const updatedObjects = [...prevObjects];
      const existingObjectIndex = prevObjects.findIndex(obj => obj.objectId === objectId);

      if (existingObjectIndex !== -1) {
        // If object exists, update its data (toJSON object)
        updatedObjects[existingObjectIndex] = { objectId, objectJson };
      } else {
        // If object doesn't exist, add it to the array
        updatedObjects.push({ objectId, objectJson });
      }

      // Save the updated array to localStorage
      // saveLayerContent(updatedObjects);
      console.log(updatedObjects)


      return updatedObjects;
    });
  };

  const debounceDelay = 100; // Delay in milliseconds (2 seconds)

  useEffect(() => {
    let debounceTimer: any;

    const debouncedUpdateCanvasContent = (options) => {
      const { objectId } = options.target
      console.log(objectId)
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        updateCanvasContent1(options);
      }, debounceDelay);
    };


    if (!fabricCanvas.current && canvasRef.current) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current);
    }
    console.log("Initial objects: ", initialContent)
    if (fabricCanvas.current && initialContent?.length >0) {
      const initialObjects = initialContent.map(obj => obj.objectJson);
      fabric.util.enlivenObjects(
        initialObjects,
        (objects: []) => {
          objects.forEach((obj) => fabricCanvas.current?.add(obj));
          fabricCanvas.current?.renderAll();
        },
        'fabric' // Namespace argument
      );
    }



    fabricCanvas.current?.on("object:added", debouncedUpdateCanvasContent);
    fabricCanvas.current?.on("object:modified", debouncedUpdateCanvasContent);
    fabricCanvas.current?.on("object:removed", debouncedUpdateCanvasContent);


    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      fabricCanvas.current?.off("object:added", debouncedUpdateCanvasContent);
      fabricCanvas.current?.off("object:modified", debouncedUpdateCanvasContent);
      fabricCanvas.current?.off("object:removed", debouncedUpdateCanvasContent);

    };
  }, [saveLayerContent, noteContent, notes]);
  // const addImageToCanvas = (imgUrl: string, x: number, y: number) => {
  //   const imgElement = new Image();
  //   imgElement.src = imgUrl;
  //   imgElement.onload = () => {
  //     const fabricImage = new fabric.Image(imgElement, {
  //       left: x,
  //       top: y,
  //       angle: 0,
  //       scaleX: 0.5,
  //       scaleY: 0.5,
  //       selectable: true
  //     });
  //     fabricCanvas.current?.add(fabricImage);
  //     fabricCanvas.current?.renderAll();
  //   };
  // };



  // useEffect(() => {


  //   const handleDrop = (e: fabric.IEvent) => {
  //     e.e.preventDefault();

  //     const left = e.e.offsetX;
  //     const top = e.e.offsetY;
  //     const data = e.e.dataTransfer.getData("text/plain");

  //     // Function to create a rectangle and add it to the canvas
  //     function addRectangle() {
  //       const rect = new fabric.Rect({
  //         left: left,    // X position
  //         top: top,     // Y position
  //         fill: 'blue',  // Fill color
  //         width: 100,   // Rectangle width
  //         height: 100,  // Rectangle height
  //         selectable: false  // Make unselectable
  //       });

  //       // Add an event listener for the 'mousedown' event on the rectangle for clicks
  //       rect.on('mousedown', (event) => {
  //         const pointer = fabricCanvas.current?.getPointer(event.e); // Get pointer location
  //         setPopupPosition({ x: pointer.x + 10, y: pointer.y + 10 }); // Adjust for popup positioning
  //         setIsPopupVisible(true); // Show popup
  //       });

  //       // Add the rectangle object to the canvas
  //       fabricCanvas.current?.add(rect);
  //     }

  //     if (data) {
  //       console.log(data)
  //       if (data === "draggable-item") {

  //         addRectangle()

  //       } else {
  //         // Handle URL or Image data
  //         addImageToCanvas(data, left, top);
  //       }
  //     }
  //   };

  //   // fabricCanvas.current?.on("mouse:move", handleMouseMove);
  //   fabricCanvas.current?.on("drop", handleDrop);

  //   return () => {
  //     // fabricCanvas.current?.off("mouse:move", handleMouseMove);
  //     fabricCanvas.current?.off("drop", handleDrop);
  //   };
  // }, []);



  useEffect(() => {
    console.log("Canvas Objects: ", canvasObjects.length, canvasObjects)
    if (canvasObjects.length > 0) {
      saveLayerContent(canvasObjects)
    }
  }, [canvasObjects])




  useEffect(() => {
    if (!fabricCanvas.current || !canvasRef.current) {
      return; // If either canvas is not initialized, exit early
    }

    if (index === -1) {
      console.log(scaleState.scale); // Log the scale value
      console.log("Rendering the infinite canvas");

      // Set zoom to the scale
      fabricCanvas.current.setZoom(scaleState.scale);

      // Adjust canvas dimensions to prevent pixelation when zooming in
      const scale = scaleState.scale;
      const newWidth = canvasRef.current.clientWidth * scale;
      const newHeight = canvasRef.current.clientHeight * scale;


      // fabricCanvas.current.setWidth(newWidth);
      // fabricCanvas.current.setHeight(newHeight);



      // Re-render the canvas after zooming
      fabricCanvas.current.renderAll();
    }
  }, [scaleState?.scale, scaleState?.positionX, scaleState?.positionY, index]);



  const closePopup = () => {
    setIsPopupVisible(false); // Hide popup
  };
  return (
    <div>

      {/* {index === -1 && (<div>
        <button onClick={() => { updateCanvasContent() }}>update</button>
      </div>)} */}
      <canvas id={`drawing-canvas-${pageIndex + 1}-${index + 1}`} ref={canvasRef} data-page-index={pageIndex + 1}  ></canvas>
      <CanvasInitializer canvasRef={canvasRef} fabricCanvas={fabricCanvas} rect={rect} />
      <ConfigureTools
        tool={tool}
        brushSize={brushSize}
        brushColor={brushColor}
        eraserSize={eraserSize}
        fabricCanvas={fabricCanvas}
        setSelectedTool={setSelectedTool}
        loopPathRef={loopPathRef}
        setLoopPoints={setLoopPoints}
        setMenuPosition={setMenuPosition}
        setMenuVisible={setMenuVisible}
        saveLayerContent={saveLayerContent}
      />
      {/* <DropCanvas  fabricCanvas={fabricCanvas} setIsPopupVisible={setIsPopupVisible} setPopupPosition={setPopupPosition}/>  */}

    </div>
  );
};






