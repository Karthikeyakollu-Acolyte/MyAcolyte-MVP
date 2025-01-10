'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import Image from 'next/image'
import singlepage from '../../public/singlepage.svg'
import twopages from '../../public/twopages.svg'
import threepages from '../../public/threepages.svg'

type ViewOption = 'single' | 'double' | 'scroll'

export default function PDFViewSelector() {
  const [selectedView, setSelectedView] = useState<ViewOption>('single')

  return (
    <div className="absolute m-5 w-[48px] h-[207px] rounded-md shadow-xl flex flex-col items-center justify-between gap-10 p-4">
      <button
        onClick={() => setSelectedView('single')}
        className={cn(
          "w-6 h-6 flex items-center justify-center transition-colors",
          "hover:bg-gray-100 rounded",
          selectedView === 'single' ? "text-primary" : "text-gray-400"
        )}
        aria-label="Single page view"
        
      >
        <Image src={singlepage} className=''/>
      </button>

      <button
        onClick={() => setSelectedView('double')}
        className={cn(
          "w-6 h-6 flex items-center justify-center transition-colors",
          "hover:bg-gray-100 rounded",
          selectedView === 'double' ? "text-primary" : "text-gray-400"
        )}
        aria-label="Double page view"
      >
        <Image src={twopages}/>
      </button>

      <button
        onClick={() => setSelectedView('scroll')}
        className={cn(
          "w-6 h-6 flex items-center justify-center transition-colors",
          "hover:bg-gray-100 rounded",
          selectedView === 'scroll' ? "text-primary" : "text-gray-400"
        )}
        aria-label="Scroll view"
      >
      <Image src={threepages} />
      </button>
    </div>
  )
}