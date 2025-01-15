'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import acolyte from '@/public/acolyte.png'
import { Collaborators } from "./collaborators"
import notifications from '@/public/notifications.svg'
import search from '@/public/search.svg'
import kebabmenu from '@/public/kebabmenu.svg'
import { useSettings } from '@/context/SettingsContext'
import PdfThemes from '../PdfThemes'

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

  const {theme,isVisible,setIsVisible} = useSettings()

  const searchBarRef = useRef(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const {first} = useSettings()

useEffect(()=>{
  console.log(isVisible)
},[isVisible])

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
    <div>
      {!first && (
        <header 
          className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          } flex text-white items-center w-[1920px] h-[89px] p-1 font-sans
          ${theme === 'Dark Brown' ? 'bg-[#291D00]' :
            theme === 'Deep Red' ? 'bg-[#390003]' :
            theme === 'Midnight Blue' ? 'bg-[#002033]' :
            theme === 'Deep Purple' ? 'bg-[#160039]' :
            theme === 'Charcoal Black' ? 'bg-[#202020]' :
            theme === 'Very Dark Purple' ? 'bg-[#090822]' : 'bg-white'
          }`}
        >
          <div className="flex w-full justify-between items-center font-rubik">
            <div className='w-[563px] z-10 ml-3'>
              <Image alt="acolyte" src={acolyte} className="h-28 w-28 ml-2" />
            </div>

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
              <PdfThemes/>
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

              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground custom-button"
                onClick={toggleSearch}
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

          {isSearchVisible && <SearchCompoent/>}
        </header>
      )}
    </div>
  )
}