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
        <div className="flex flex-col items-center  h-[100vh]  scrollbar-hide  ">

          <div className='' style={{
            height:  '100vh',
            width:  '100vw'
          }}
          >
            <ExcalidrawComponent id={id} />
          </div>

          {/* <ToggleInfiniteCanvas /> */}


        </div>
      </div>

    </div>
  )
}

export default page


