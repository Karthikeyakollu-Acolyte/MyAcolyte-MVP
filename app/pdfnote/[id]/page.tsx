'use client'

import { useState, useEffect } from 'react';
import ScrollableContent from '@/components/ScrollableContent';

import { useParams } from 'next/navigation';
import ExcalidrawFabric from '@/components/canvas/excalidraw/ExcalidrawFabric';
import ExcalidrawComponent from '@/components/canvas/excalidraw/ExcalidrawComponent';
import { useSettings } from '@/context/SettingsContext';
export default function page() {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const { id }:{id:string} = useParams();
  const {data} = useSettings()
  return (

    <div className="max-h-screen w-[100vw] overflow-hidden max-w-[1920px]">

      <div className="flex flex-col items-center pb-8   scrollbar-hide bg-[#F6F7F9] w-full">
        <ScrollableContent isExpanded={isExpanded} id={id} />

        { data && <div className="fixed inset-0  w-full h-full bg-transparent">
          <ExcalidrawComponent id={id} />
        </div> }

      </div>
    </div>
  );
}






