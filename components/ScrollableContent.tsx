"use client"
import { useSettings } from "@/context/SettingsContext";
import Wrapper from "./Wrapper";
import { useEffect, useRef, useState } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Divide } from "lucide-react";
import ScrollableTransform from "./pdfcomponents/InfiniteComponenet";

interface ScrollableContentProps {
  isExpanded: boolean;
  id: string;
}

export default function ScrollableContent({ isExpanded, id }: ScrollableContentProps) {
  // A4 size: 210mm x 297mm (width x height)
  // We'll use a scale factor to convert mm to pixels
  const a4Width = 850;
  const a4Height = 297
  const containerNodeRef = useRef<HTMLDivElement>(null);  // Fixed ref type
  const contentRef = useRef<HTMLDivElement>(null);
  const pan = useRef<ReactZoomPanPinchRef>(null);
  const { isInfinite } = useSettings()
  const [limitToBounds, setLimitToBounds] = useState<boolean>(false)



  // useEffect(() => {
  //   const div = containerNodeRef.current;
  //   const contentDiv = contentRef.current;
  //   if (!div || !contentDiv) return;

  //   let localScale = 1;
  //   let zoomTimeout;
  //   // div.style.transformOrigin = `top center`;
  //   // contentDiv.style.transform = `scale(${0.5})`;
  //   contentDiv.style.transformOrigin = `top center`;
  //   if (isInfinite) {
  //     contentDiv.style.transform = `scale(${2})`;
  //   }
  //   else {
  //     contentDiv.style.transform = `scale(${localScale})`;
  //   }

  //   const onWheel = (e) => {
  //     if (e.ctrlKey) {
  //       e.preventDefault();
  //       // div.style.transformOrigin = `top center`;

  //       // Calculate zoom direction
  //       const delta = e.deltaY > 0 ? -0.1 : 0.1;
  //       const newScale = Math.min(Math.max(localScale + delta, 0.5), 2);
  //       contentDiv.style.transformOrigin = `top ${e.offsetY}px`;
  //       contentDiv.style.transform = `scale(${newScale})`;
  //       localScale = newScale;
  //       clearTimeout(zoomTimeout);


  //     }
  //   };

  //   div.addEventListener('wheel', onWheel);

  //   return () => {
  //     div.removeEventListener('wheel', onWheel);
  //     clearTimeout(zoomTimeout);
  //   };
  // }, [isInfinite]);



  return (
    <div className={`mt-8  transition-all h-[100vh] flex justify-center overflow-auto scrollbar-hidden duration-300 ease-in-out  w-[100vw] 
      `}
      ref={containerNodeRef}
    >


      <ScrollableTransform id={id}>
        <Wrapper id={id} />
      </ScrollableTransform>



    </div>
  );
}




