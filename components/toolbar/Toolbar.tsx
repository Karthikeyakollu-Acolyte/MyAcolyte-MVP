"use client"
import { useEffect, useState } from 'react'
import { Pen, Eraser, MousePointer, Settings, Hand, Shapes, Type } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PenOptions from "./options/PenOptions"
import EraserOptions from "./options/EraserOptions"
import SelectionOptions from "./options/SelectionOptions"
import { useToolContext } from "@/context/ToolContext"
import type { Tool } from "@/types/pdf"
import ShapesOptions from './options/ShapesOptions'
import { useSettings } from "@/context/SettingsContext";
import { useRefs } from '@/context/sharedRefs'

function Toolbar() {
  const {
    selectedTool,
    setSelectedTool,
    isMenuOpen,
    setIsMenuOpen,
    brushSize,
    setBrushSize,
    brushColor,
    setBrushColor,
    setEraserSize,
    eraserSize
  } = useToolContext()



  const { pdfViewerRef } = useRefs();

  const openMenu = (tool: Tool) => {
    setSelectedTool(tool)
    setIsMenuOpen(true)
  }
  const [first, setfirst] = useState(1)


  useEffect(() => {

    // console.log("object")

    if (pdfViewerRef) {
      // page.rotation=90; 
      // rotateDocument(pdfViewerRef, 90)
      // pdfViewerRef.current._spreadMode = ;

      // 1:2page view; 2:odd page view, 3 for horizontal  scroll, -1 for vertical  scroll
      // setSpreadMode(pdfViewerRef,3)
      // rotatePage(pdfViewerRef,1,90)

      // console.log(.pagesCount)
      // setSpreadMode(pdfViewerRef,2)
      // setScrollMode(pdfViewerRef,3)
      // scrollToPage(pdfViewerRef,first)

      // pdfViewerRef.current.eventBus.on("pagechanging", () => {
      //   console.log("changing");
      // });
    }

  }, [pdfViewerRef, first])
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <Card className="fixed bottom-9 left-1/2 transform -translate-x-1/2 flex items-center gap-3 p-3 border shadow-xl rounded-3xl bg-background font-sans"
      style={{ zIndex: 100 }}>
      <div className="flex items-center space-x-2">
        {isMenuOpen && (
          (selectedTool === "pen") ||
          (selectedTool === "highlighter" || selectedTool === "texthighlighter")
        ) && (
            <PenOptions
              onClose={closeMenu}
              onToolChange={setSelectedTool}
              initialTool="pen"
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              brushColor={brushColor}
              setBrushColor={setBrushColor}
            />
          )}

        {/* {isMenuOpen && selectedTool === "highlighter" && (
          <PenOptions
            onClose={closeMenu}
            onToolChange={setSelectedTool}
            initialTool="highlighter"
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            brushColor={brushColor}
            setBrushColor={setBrushColor}
          />
        )} */}
        {isMenuOpen && (selectedTool === "pixelEraser" || selectedTool === "objectEraser") && (
          <EraserOptions
            onClose={closeMenu}
            onToolChange={setSelectedTool}
            initialTool={"objectEraser"}
            setEraserSize={setEraserSize}
            eraserSize={eraserSize}
          />
        )}
        {isMenuOpen && (selectedTool === "rectangleSelection" || selectedTool === "freeformSelection") && (
          <SelectionOptions
            onClose={closeMenu}
            onToolChange={setSelectedTool}
            initialTool={selectedTool}
          />
        )}
        {isMenuOpen && (
          (selectedTool === "circle" || selectedTool === "arrow" || selectedTool === "shapes" || selectedTool === "diamond" || selectedTool === "square" || selectedTool === "star" || selectedTool === "triangle") && (
            <ShapesOptions
              onClose={closeMenu}
              onToolChange={setSelectedTool}
              initialTool={"shapes"} // Use selectedTool here
              setColor={setBrushColor}
            />
          )
        )}



        {(!isMenuOpen || !selectedTool) && (
          <>
            <Button variant="ghost" size="icon" onClick={() => openMenu("pen")}>
              <Pen className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openMenu("pixelEraser")}>
              <Eraser className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openMenu("rectangleSelection")}>
              <MousePointer className="h-4 w-4" />
            </Button>


            <Button variant="ghost" size="icon" onClick={() => { setSelectedTool("text") }}>
              <Type className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openMenu("shapes")}>
              <Shapes className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}


export default Toolbar