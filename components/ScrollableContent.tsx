"use client"
import { useSettings } from "@/context/SettingsContext";
import Wrapper from "./Wrapper";
import { useEffect, useRef, useState } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Divide, } from "lucide-react";
import ScrollableTransform from "./pdfcomponents/InfiniteComponenet";
import ExcalidrawComponent from "./canvas/excalidraw/ExcalidrawComponent";
import { Button } from "./ui/button";


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

  const [limitToBounds, setLimitToBounds] = useState<boolean>(false)
  const { first, setfirst, isInfinite } = useSettings()
  const {setcurrentDocumentId } = useSettings()



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

  useEffect(() => {
    setcurrentDocumentId(id)
  }, [id])

  return (
    <div className={`mt-8  transition-all h-[100vh] flex justify-center overflow-auto scrollbar-hidden duration-300 ease-in-out  w-[100vw] 
      `}
      ref={containerNodeRef}
    >
      <Button variant={"default"} onClick={() => { setfirst(!first) }} className="border border-1 p-2  m-2 rounded-md left-2 top-96 absolute"><Notebook claName="w-8 h-8" /></Button>


      <div className="w-[80vw] h-screen scrollbar-hidden">

        {!first && <ScrollableTransform>
          <Wrapper id={id} />
        </ScrollableTransform>}

        {first && <div
          className="mb-3 mx-auto"
          style={{
            width: isInfinite ? '100%' : '850px',
            height: "100%"
          }}>
          <ExcalidrawComponent id={id} />
        </div>}
      </div>







    </div>
  );
}




