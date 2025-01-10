"use client"

import { useState, useEffect } from "react"
import { X, Eraser, MousePointerClick } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface EraserOptionsProps {
  onClose: () => void
  onToolChange: (tool: "pixelEraser" | "objectEraser") => void
  initialTool: "pixelEraser" | "objectEraser"
  setEraserSize:any
  eraserSize:any
}

export default function EraserOptions({ onClose, onToolChange, initialTool,setEraserSize,eraserSize }: EraserOptionsProps) {
  const [eraserType, setEraserType] = useState(initialTool === "pixelEraser" ? "pixel" : "object")

  useEffect(() => {
    onToolChange(eraserType === "pixel" ? "pixelEraser" : "objectEraser")
   
  }, [eraserSize, eraserType, onToolChange])

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      <Slider
        min={1}
        max={20}
        step={1}
        value={[eraserSize]}
        onValueChange={(value) => setEraserSize(value[0])}
        className="w-24"
      />
      <ToggleGroup type="single" value={eraserType} onValueChange={(value) => value && setEraserType(value)}>
        <ToggleGroupItem value="pixel">
          <Eraser className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="object">
          <MousePointerClick className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

