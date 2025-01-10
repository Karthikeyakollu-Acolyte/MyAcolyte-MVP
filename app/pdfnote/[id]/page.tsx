'use client'

import { useState, useEffect } from 'react';
import ScrollableContent from '@/components/ScrollableContent';

import { useParams } from 'next/navigation';
export default function page() {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const { id }:{id:string} = useParams();
  return (

    <div className="max-h-screen w-[100vw] overflow-hidden max-w-[1920px]">

      <div className="flex flex-col items-center pb-8 h-[calc(100vh-80px)]  scrollbar-hide bg-[#F6F7F9] w-full">
        <ScrollableContent isExpanded={isExpanded} id={id} />
      </div>
    </div>
  );
}






