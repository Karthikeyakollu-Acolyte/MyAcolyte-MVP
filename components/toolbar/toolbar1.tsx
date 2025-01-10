"use client"
import React,{useEffect} from 'react'
import { Plus, LayoutTemplate, Infinity, ImageIcon, Link2, FileVideo, LayoutGrid } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import pentool from "../../public/pentool.svg"
import eraser from "../../public/eraser.svg"
import addtext from "../../public/addtext.svg"
import shapes from "../../public/shapes.svg"
import moretools from "../../public/moretools.svg"
import loop from "../../public/loop.svg"
import template from "../../public/template.svg"
import videos from "../../public/videos.svg"
import images from "../../public/images.svg"
import link from "../../public/link.svg"
import { useToolContext } from '@/context/ToolContext'

export default function Toolbar() {
  const [activeItem, setActiveItem] = React.useState<string | null>(null)
  const [menuActive, setMenuActive] = React.useState(false) // Track whether menu is active
  const toolbarRef = React.useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setActiveItem(null)  // Unhighlight any active item
        setMenuActive(false) // Close the menu when clicking outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMenuClick = () => setMenuActive(!menuActive)

  const icons = [
    { id: "pen", src: pentool },
    { id: "text", src: addtext },
    { id: "eraser", src: eraser },
    { id: "shapes", src: shapes },
    { id: "plus", src: moretools },
  ]
useEffect(()=>{
  setSelectedTool(activeItem)
  console.log(activeItem)
},[activeItem])

  const renderButton = (id: string, src: string) => (
    <Button
      variant="ghost"
      size="icon"
      key={id}
      className={cn(
        activeItem === id ? "bg-purple-500 text-white hover:bg-purple-500" : " text-white",
        "rounded-lg font-bold transition-all"
      )}
      onClick={() => setActiveItem(activeItem === id ? null : id)}
    >
      <Image alt="acolyte" src={src} className={cn("h-10 w-10 ", activeItem === id ? "text-white hover:none" : "")} />
    </Button>
  )

  return (
    <div ref={toolbarRef} className="fixed bottom-9 flex items-center gap-3 p-3 border shadow-xl rounded-3xl bg-background font-sans">
      {icons.slice(0, 4).map(icon => renderButton(icon.id, icon.src))}

      {/* This renders the plus button */}

      {/* Dropdown menu with additional options */}
      {(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Rendered by clicking the plus button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg font-bold transition-all"
              onClick={handleMenuClick} // Toggle menu visibility
            >
              <Image alt="acolyte" src={moretools} className={cn("h-10 w-10", menuActive ? "text-white" : "text-purple-600")} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" className="w-80 p-4 font-sans font-semibold mb-6 space-y-1">
            {["media", "videos", "links"].map((item, idx) => (
              <DropdownMenuItem key={idx} className="hover:bg-purple-300 focus:bg-purple-50">
                <Image alt="acolyte" src={item === "templates" ? template : item === "loop" ? loop : item === "media" ? images : item === "videos" ? videos : link}
                  className={cn("h-5 w-5 mr-2", activeItem === item ? "text-white" : "text-purple-600")}
                />
                <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}


