"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';


import ExcalidrawComponent from '@/components/canvas/excalidraw/ExcalidrawComponent';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/context/SettingsContext';
import ToggleInfiniteCanvas from '@/components/canvas/ToggleInfiniteCanvas';


const page = () => {

  const { id }: { id: string } = useParams();
  const { isInfinite } = useSettings()


  return (
    <div>
      <div className="max-h-screen w-[100vw] overflow-hidden max-w-[1920px]">
        <div className="flex flex-col items-center pb-8 h-[calc(100vh-80px)]  scrollbar-hide bg-[#F6F7F9] w-full">

          <div className='mt-10' style={{
            height: isInfinite ? '80vh' : '1000px',
            width: isInfinite ? '95vw' : '1000px'
          }}
          >
            <ExcalidrawComponent id={id} />
          </div>

          <ToggleInfiniteCanvas />


        </div>
      </div>

    </div>
  )
}

export default page


