"use client"

import { useState, useEffect } from "react"
import { X, Pen, Highlighter, Baseline } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface PenOptionsProps {
  onClose: () => void
  onToolChange: (tool: "pen" | "highlighter"|"texthighlighter") => void
  initialTool: "pen" | "highlighter"|"texthighlighter"
  brushSize: number
  setBrushSize: (size: number) => void
  brushColor: string
  setBrushColor: (color: string) => void
}

export default function PenOptions({
  onClose,
  onToolChange,
  initialTool,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
}: PenOptionsProps) {
  const [penType, setPenType] = useState(initialTool)

  // Update the parent about the current pen type
  useEffect(() => {
    onToolChange(penType)
  }, [penType, onToolChange])





  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      <ToggleGroup type="single" value={penType} onValueChange={(value: "pen" | "highlighter"|"texthighlighter") => value && setPenType(value)}>
        <ToggleGroupItem value="pen">
          <Pen className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="highlighter">
          <Highlighter className="h-4 w-4" />
        </ToggleGroupItem>

        <ToggleGroupItem value="texthighlighter">
          <Baseline className="h-4 w-4" />

        </ToggleGroupItem>
      </ToggleGroup>
      <Slider
        min={1}
        max={20}
        step={1}
        value={[brushSize]}
        onValueChange={(value) => setBrushSize(value[0])}
        className="w-24"
      />


      <div className="h-6 w-6 border rounded-md overflow-hidden flex items-center justify-center cursor-pointer">
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="h-full w-full rounded-md p-0 border-0 appearance-none"
        />
      </div>

    </div>
  );

}
