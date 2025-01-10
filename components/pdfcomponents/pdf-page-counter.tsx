'use client'

import Image from 'next/image'
import totalpages from '@/public/totalpages.svg'
import annotations from '@/public/annotations.svg'

interface PDFCounterProps {
  currentPage: number
  totalPages: number
  totalAnnotations: number
}

export default function PDFCounter({
  currentPage = 11,
  totalPages = 100,
  totalAnnotations = 125
}: PDFCounterProps) {
  return (
    <div className="font-rubik absolute bottom-5 m-5 flex flex-col gap-2 p-2 text-sm">
      <div className="text-muted-foreground mb-3 text-[16px]">
       <span className='text-black'> Page: {currentPage} </span> /{totalPages}
      </div>
      <div className="flex flex-col gap-2 text-[15px]">
        <div className="flex items-center gap-2">
          <Image src={totalpages} alt='' width={16} height={16} />
          <span className="text-purple-600">{totalPages} Pages</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src={annotations} alt='' width={16} height={16} />
          <span className="text-purple-600">{totalAnnotations} Annotations</span>
        </div>
      </div>
    </div>
  )
}

