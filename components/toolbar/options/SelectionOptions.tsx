"use client"

import { useState, useEffect } from "react"
import { X, Square, Lasso } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface SelectionOptionsProps {
  onClose: () => void
  onToolChange: (tool: "rectangleSelection" | "freeformSelection") => void
  initialTool: "rectangleSelection" | "freeformSelection"
}

export default function SelectionOptions({ onClose, onToolChange, initialTool }: SelectionOptionsProps) {
  const [selectionType, setSelectionType] = useState(initialTool === "rectangleSelection" ? "rectangle" : "freeform")

  useEffect(() => {
    onToolChange(selectionType === "rectangle" ? "rectangleSelection" : "freeformSelection")
    
  }, [selectionType, onToolChange])

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
      <ToggleGroup type="single" value={selectionType} onValueChange={(value) => value && setSelectionType(value)}>
        <ToggleGroupItem value="rectangle">
          <Square className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="freeform">
          <Lasso className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

