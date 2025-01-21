"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { CanvasInitializer } from "./CanvasInitializer";
import { ConfigureTools } from "./ConfigureTools";
import type { CustomFabricObject, FabricCanvasProps } from "@/types/pdf";
import { useSettings } from "@/context/SettingsContext";
import { useCanvas } from "@/context/CanvasContext";
import page from "@/app/canvas/page";
import { Button } from "../ui/button";
import { useToolContext } from "@/context/ToolContext";
import { Currency } from "lucide-react";
import { v4 as uuidv4 } from "uuid";


export const FabricCanvas = ({
  rect,
  index,
  isDrawing,
  saveLayerContent,
  initialContent,
  pageIndex,
  noteContent,
  scaleState,
  newObject
}: FabricCanvasProps) => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const loopPathRef = useRef(null);
  const [loopPoints, setLoopPoints] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { selectedText, notes, setCurrentPage, scale, currentPage, isInfinite } = useSettings();
  const { rect: pageSize } = useCanvas();
  const { brushSize, brushColor, eraserSize, setSelectedTool, selectedTool,prevselectedTool,setPrevSelectedTool } = useToolContext()
  const [canvasObjects, setCanvasObjects] = useState<[]>(initialContent);
  const infiniteCanvasIndex = -1;
  let globalUpdatedObjects: any


  // Update canvas content for a specific object
  const updateCanvasContent = (objectId, objectJson) => {
    if (!objectId) return;

    // if (pageIndex !== infiniteCanvasIndex) {
    //   setCurrentPage(pageIndex)
    // }

    setCanvasObjects((prevObjects) => {
      // Ensure prevObjects is an array, defaulting to an empty array if it's not
      const validPrevObjects = Array.isArray(prevObjects) ? prevObjects : [];

      const updatedObjects = validPrevObjects.map((obj) =>
        obj.objectId === objectId ? { objectId, objectJson } : obj
      );

      // If object with the given objectId doesn't exist, add it to the list
      if (!updatedObjects.some((obj) => obj.objectId === objectId)) {
        updatedObjects.push({ objectId, objectJson });
      }

      return updatedObjects;
    });
  };



  useEffect(() => {
    if (canvasObjects.length + 1 > 0) {
      saveLayerContent(canvasObjects);
    }
  }, [canvasObjects]);

  // Remove canvas content for a specific object
  const removeCanvasContent = (options: any) => {

    console.log("These are the options", options)
    const objectId = options.target?.objectId
    console.log("Removing this object: ", objectId)

    if (!objectId) return;
    console.log("Removing this object: ", objectId)
    setCanvasObjects((prevObjects) => {
      const updatedObjects = prevObjects.filter((obj) => obj.objectId !== objectId);
      globalUpdatedObjects = updatedObjects
      return updatedObjects;
    });
  };

  // Debounced content update
  const debounceDelay = 0;
  const debouncedUpdateCanvasContent = debounce((options) => {
    // console.log("aadded", options.target?.objectId)
    if (options.target?.objectId) {
      const objectId = options.target.objectId;
      const objectJson = options.target.toJSON();
      updateCanvasContent(objectId, objectJson);
    }
  }, debounceDelay);


  // First useEffect: Initialize canvas and render initial contents
  useEffect(() => {
    if (!fabricCanvas.current && canvasRef.current) {
      fabricCanvas.current = new fabric.Canvas(canvasRef.current);
    }

    if (fabricCanvas.current && canvasObjects?.length > 0) {
      const initialObjects = canvasObjects.map((obj) => obj.objectJson);

      fabric.util.enlivenObjects(
        initialObjects,
        (objects) => {
          objects.forEach((obj, index) => {
            const objectId = canvasObjects[index]?.objectId;

            // Check if an object with the same objectId already exists on the canvas
            const existingObject = fabricCanvas.current?.getObjects().find(
              (item) => item.objectId === objectId
            );

            if (!existingObject) {
              obj.objectId = objectId; // Restore objectId if it doesn't already exist
              fabricCanvas.current?.add(obj);
            }
          });
          fabricCanvas.current?.renderAll();
        },
        "fabric" // Namespace argument
      );
    }
  }, [canvasObjects, initialContent,selectedTool]); // Dependencies related to rendering initial contents


  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  // Second useEffect: Add event listeners and manage interactions
  useEffect(() => {
    const canvas: fabric.Canvas = fabricCanvas.current;

    if (canvas) {
      const addListeners = () => {
        if (selectedTool === "triangle" || selectedTool === "circle" || selectedTool === "square") {
          canvas.on("mouse:up", debouncedUpdateCanvasContent);
          return;
        }
        canvas.on("object:added", debouncedUpdateCanvasContent);
        canvas.on("object:scaling", debouncedUpdateCanvasContent);
        canvas.on("object:rotating", debouncedUpdateCanvasContent);
        canvas.on("object:moving", debouncedUpdateCanvasContent);
        canvas.on("object:modified", debouncedUpdateCanvasContent);
        canvas.on("object:removed",  removeCanvasContent);
        canvas.on("mouse:move", debouncedUpdateCanvasContent);
        canvas.on("mouse:move", ()=>{ 
          setSelectedTool(prevselectedTool); 
          console.log("Current tool is resetting to : ",prevselectedTool)});

        canvas.on("mouse:down", (e) => {
          const pageIndex = canvas?.lowerCanvasEl.getAttribute("data-page-index");
          setCurrentPage(parseInt(pageIndex));
        });
        canvas.on('mouse:up',()=>{
          setSelectedTool(null)
          // setSelectedTool(prevselectedTool)
          // setSelectedTool(prevselectedTool)
        })
        canvas.on('path:created',async ()=>{
          // if(selectedTool == "pen") return
          // await delay(500)
          // setSelectedTool(null)
          // setSelectedTool(prevselectedTool);
         
        })
        canvas.on("mouse:wheel", (e) => {
          const pageIndex = canvas.lowerCanvasEl.getAttribute("data-page-index");
          setCurrentPage((prev) => parseInt(pageIndex));
        });
      };

      const removeListeners = () => {
        if (selectedTool === "triangle" || selectedTool === "circle" || selectedTool === "square") {
          canvas.off("mouse:up", debouncedUpdateCanvasContent);
          return;
        }
        canvas.off("object:added", debouncedUpdateCanvasContent);
        canvas.off("object:scaling", debouncedUpdateCanvasContent);
        canvas.off("object:rotating", debouncedUpdateCanvasContent);
        canvas.off("object:moving", debouncedUpdateCanvasContent);
        canvas.off("object:modified", debouncedUpdateCanvasContent);
        canvas.off("object:removed");
        canvas.off("mouse:move");
        canvas.off("mouse:down", (e) => {});
        canvas.off('mouse:up',()=>{})
        canvas.off('path:created',()=>{})
      };
      removeListeners();
      addListeners();

      return () => {
        removeListeners();
      };
    }
  }, [selectedTool, debouncedUpdateCanvasContent]); // Dependencies related to listeners



  useEffect(() => {

    const canvas: fabric.Canvas = fabricCanvas.current;
    if (!canvas) return

    const findOrCreateRectangle = (pageNum: number) => {
      let pageRect = canvas.getObjects().find(obj => obj.objectId === pageNum);
      if (pageRect) {
        console.log("pageRect with the same ID already exists on the canvas.");
        return; // Prevent adding duplicate object
      }

      if (!pageRect) {
        const margin = 10;
        const spacing = 1020; // Rectangle height + margin


        // Create the rectangle
        pageRect = new fabric.Rect({
          left: margin,
          top: margin,
          width: pageSize?.width,
          height: pageSize?.height,
          fill: "#ffeb3b",
          rx: 10,
          ry: 10,
          shadow: {
            color: "rgba(0,0,0,0.3)",
            blur: 10,
            offsetX: 5,
            offsetY: 5,
          },
          objectId: pageNum,
        });

        // Add to the canvas and reposition all rectangles
        canvas.add(pageRect);
        pageRect.moveTo(0)
      }

      return pageRect;
    };

    const addObject = (obj: fabric.Object, objectId: string) => {

      const existingObj = canvas.getObjects().find(existing => existing.objectId === objectId);
      if (existingObj) {
        console.log("Object with the same ID already exists on the canvas.");
        return; // Prevent adding duplicate object
      }

      const pageRect = findOrCreateRectangle(currentPage);

      // Ensure new object is positioned relative to its page rectangle
      const relativeTop = obj.top || 0;
      obj.set({
        top: relativeTop,
      });

      canvas.add(obj);
      obj.moveTo(canvas.getObjects().indexOf(pageRect) + 1);
      canvas.renderAll();
    };





    // Handle new objects
    if (newObject?.type === "image") {
      const objectId = uuidv4()
      console.log("Adding image...");
      fabric.Image.fromURL(newObject.data, (img) => {
        img.set({
          ...newObject.position,
          objectId: objectId,
        } as CustomFabricObject<fabric.Image>);
        addObject(img, objectId);
      });
    } else if (newObject?.type === "text") {
      const objectId = uuidv4()
      console.log("Adding text...");
      const highlightedText = new fabric.IText(newObject.data, {
        ...newObject.position,
        objectId: objectId
      } as CustomFabricObject<fabric.IText>);
      addObject(highlightedText, objectId);
    }

  }, [newObject, currentPage])








  // useEffect(() => {
  //   const canvas: any = fabricCanvas.current;
  //   if (!canvas || !canvasRef.current) return;

  //   canvas.setZoom(scale);
  //   // console.log(scale)

  //   canvas.renderAll();

  // }, [scale]);

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
  //       selectable: true,
  //       objectId: uuidv4(),
  //     } as CustomFabricObject<fabric.Image>);
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

  // useEffect(() => {
  //   const canvas: any = fabricCanvas.current;
  //   if (!canvas || !canvasRef.current) return;

  //   if (index === infiniteCanvasIndex) {
  //     const scale = scaleState.scale;
  //     canvas.setZoom(scale);

  //     // Update canvas dimensions to match scaling
  //     const newWidth = canvasRef.current.clientWidth * scale;
  //     const newHeight = canvasRef.current.clientHeight * scale;
  //     canvas.setDimensions({ width: newWidth, height: newHeight });

  //     canvas.renderAll();
  //   }
  // }, [scaleState.scale, index]);

  const closePopup = () => setIsPopupVisible(false);

  return (
    <div>
      <canvas
        id={`drawing-canvas-${pageIndex + 1}-${index + 1}`}
        ref={canvasRef}
        data-page-index={pageIndex + 1}
      ></canvas>
      <CanvasInitializer canvasRef={canvasRef} fabricCanvas={fabricCanvas} rect={rect} />
      <ConfigureTools
        tool={selectedTool}
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
    </div>
  );
};

// Helper function to debounce calls
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}






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



// useEffect(() => {
//   console.log("Canvas Objects: ", canvasObjects.length, canvasObjects)
//   if (canvasObjects.length > 0) {
//     saveLayerContent(canvasObjects)
//   }
// }, [canvasObjects])


// const updateCanvasContent = (e) => {
//   const content = fabricCanvas.current?.toJSON();
//   console.log("saving this shitt")
//   // return
//   if (content) {

//     if (pageIndex == infiniteCanvasIndex)// which means im the infinite canvas
//     {

//       // handleCanvasChangeRealtime(infiniteCanvasIndex, content, { width: rect?.width, height: rect?.height })
//       // updateCanvasContentInfinite(e)
//       console.log("Im the infinite canvas")
//       saveLayerContent(content);

//     } else { // which means im in page canvas
//       handleCanvasChangeRealtime(pageIndex, content, { width: rect?.width, height: rect?.height })
//       saveLayerContent(content);

//     }

//   }

// };


