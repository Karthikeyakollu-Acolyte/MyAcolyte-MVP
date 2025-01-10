'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Bell, Search, MoreVertical } from 'lucide-react'
import Image from "next/image"
import acolyte from '@/public/acolyte.png'
import frame from '@/public/frame.png'
import { Collaborators } from "./collaborators"
import SearchCompoent from '../pdfcomponents/SearchCompoent'
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
  // State to toggle search bar visibility and hold search query
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdate, setLastUpdate] = useState("")

  // Ref to detect clicks outside the search bar and to focus the input
  const searchBarRef = useRef(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  // Update the last update time dynamically
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
    const interval = setInterval(updateLastUpdateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Toggle search bar visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Search Query:', searchQuery)
  }

  // Close the search bar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsSearchVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus on the search input when the search bar becomes visible
  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchVisible])

  return (
    <header className="flex items-center w-[1920px] h-[89px] border-b p-1 font-sans bg-white">
      <div className="flex w-full justify-between items-center font-rubik">
        <div className='w-[563px] z-10 ml-3'>
          <Image alt="acolyte" src={acolyte} className="h-28 w-28 ml-2" />
        </div>

        {/* Centered Title and Last Update Section */}
        <div className="flex flex-col z-10 w-[286px] items-center justify-center gap-1">
          <div className="flex items-center justify-center gap-11">
            <span className="text-[20px] text-center">{title}</span>
          </div>
          <p className="text-[15px] w-[296px] font-rubik text-muted-foreground text-center">
            Last Update: {lastUpdate}
          </p>
        </div>

        <div className="flex justify-start mr-4 z-10 items-center gap-5">
          <Collaborators />

          <Image
            loading="lazy"
            src={brushmenu}
            alt="Navigation icon"
            className="object-contain w-[59.24px] h-[35.88px] aspect-[1.64] mr-2"
          />

          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground custom-button"
          >
            <Image
              loading="lazy"
              src={notifications}
              alt="Notifications"
              className="object-contain w-[31.68px] h-[31.68px] aspect-square"
            />
          </Button>

          {/* Search Button */}
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground custom-button"
            onClick={toggleSearch} // Toggle search visibility on click
          >
            <Image
              loading="lazy"
              src={search}
              alt="Notifications"
              className="object-contain w-[31.68px] h-[31.68px] aspect-square"
            />
          </Button>

          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground custom-button"
          >
            <Image
              loading="lazy"
              src={kebabmenu}
              alt="User profile"
              className="object-contain w-[31.68px] h-[31.68px] aspect-[0.97]"
            />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchVisible && (
        <div>
          <div
            ref={searchBarRef}
            className="fixed top-32 left-0 right-0 flex justify-center z-50 mt-4"
          >
            <form
              className="w-[850px] relative group"
              onSubmit={handleSearchSubmit} // Handle form submission
            >
              <div className="relative w-full h-[43px] group-hover:h-[68px] bg-white rounded-[18px] shadow-lg border border-gray-300 overflow-hidden transition-all duration-300 ease-in-out">
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 ml-4">
                  <Image src={pdfsearch} alt="Search Icon" width={16} height={16} />
                </div>

                {/* Search Input */}
                <input
                  ref={searchInputRef} // Reference the search input to focus it
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={isSearchVisible ? "Spotlight search" : "Spotlight search"}
                  className="w-full py-2 pl-16 pr-4 font-rubik text-[20px] text-black focus:outline-none h-[43px] transition-colors duration-300"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)} // Handle Enter key to submit
                />
                {/* Additional Placeholder Area */}
                <div className="absolute top-[40px] pl-16 w-full text-black text-[15px] px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ask acolyte?
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  )
}
