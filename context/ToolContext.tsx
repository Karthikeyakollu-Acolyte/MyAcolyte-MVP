"use client"

import { createContext, useContext, useState, ReactNode } from "react"


import type { ToolContextType,Tool} from "@/types/pdf";

const ToolContext = createContext<ToolContextType | undefined>(undefined)

export const ToolProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTool, setSelectedTool] = useState<Tool>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [brushSize, setBrushSize] = useState(5)
  const [eraserSize, setEraserSize] = useState(5)
  const [brushColor, setBrushColor] = useState("#000000");

  return (
    <ToolContext.Provider
      value={{
        selectedTool,
        setSelectedTool,
        isMenuOpen,
        setIsMenuOpen,
        brushSize,
        setBrushSize,
        brushColor,
        setBrushColor,
        eraserSize,
        setEraserSize,
       
        
      }}
    >
      {children}
    </ToolContext.Provider>
  )
}

export const useToolContext = () => {
  const context = useContext(ToolContext)
  if (!context) {
    throw new Error("useToolContext must be used within a ToolProvider")
  }
  return context
}
