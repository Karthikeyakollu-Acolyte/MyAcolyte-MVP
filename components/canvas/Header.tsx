'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import acolyte from '@/public/acolyte.png'
import { Collaborators } from "./collaborators"
import notifications from '@/public/notifications.svg'
import search from '@/public/search.svg'
import kebabmenu from '@/public/kebabmenu.svg'
import brushmenu from '@/public/brushmenu.svg'
import pdfsearch from '@/public/pdfsearch.svg'

interface HeaderProps {
  title?: string
  pages?: number
  annotations?: number
}

export default function Header({
  title = "Heart Analogy",
  pages = 120,
  annotations = 120,
}: HeaderProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdate, setLastUpdate] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const searchBarRef = useRef(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const updateLastUpdateTime = () => {
      const now = new Date()
      const formattedDate = now.toLocaleString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      setLastUpdate(formattedDate)
    }

    updateLastUpdateTime()
    const interval = setInterval(updateLastUpdateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsSearchVisible(false)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Search Query:', searchQuery)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsSearchVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchVisible])

  return (
    <header className="relative w-full bg-white border-b">
      {/* Main Header Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between py-2 gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image 
              alt="acolyte" 
              src={acolyte} 
              className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
            />
          </div>

          {/* Title and Update Time - Center on mobile, left-aligned on desktop */}
          <div className="flex flex-col items-center flex-grow text-center">
  <h1 className="text-lg sm:text-xl lg:text-2xl font-medium">
    {title}
  </h1>
  <p className="text-sm lg:text-base text-muted-foreground mt-1">
    Last Update: {lastUpdate}
  </p>
</div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-4">
            <Collaborators />
            <Button variant="ghost" className="p-2">
              <Image src={brushmenu} alt="Brush menu" className="w-8 h-8 lg:w-10 lg:h-10" />
            </Button>
            <Button variant="ghost" className="p-2">
              <Image src={notifications} alt="Notifications" className="w-8 h-8 lg:w-10 lg:h-10" />
            </Button>
            <Button variant="ghost" onClick={toggleSearch} className="p-2">
              <Image src={search} alt="Search" className="w-8 h-8 lg:w-10 lg:h-10" />
            </Button>
            <Button variant="ghost" className="p-2">
              <Image src={kebabmenu} alt="Menu" className="w-8 h-8 lg:w-10 lg:h-10" />
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <Button 
            variant="ghost" 
            onClick={toggleMobileMenu}
            className="sm:hidden p-2"
          >
            <Image src={kebabmenu} alt="Menu" className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-center">
              <Collaborators />
            </div>
            <div className="flex justify-around">
              <Button variant="ghost" className="p-2">
                <Image src={brushmenu} alt="Brush menu" className="w-8 h-8" />
              </Button>
              <Button variant="ghost" className="p-2">
                <Image src={notifications} alt="Notifications" className="w-8 h-8" />
              </Button>
              <Button variant="ghost" onClick={toggleSearch} className="p-2">
                <Image src={search} alt="Search" className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar - Responsive positioning */}
      {isSearchVisible && (
        <div className="fixed top-0 sm:top-20 left-0 right-0 p-4 bg-white sm:bg-transparent z-50">
          <div ref={searchBarRef} className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative w-full h-12 bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Image src={pdfsearch} alt="Search Icon" width={16} height={16} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Spotlight search"
                  className="w-full h-full pl-10 pr-4 text-base focus:outline-none"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}