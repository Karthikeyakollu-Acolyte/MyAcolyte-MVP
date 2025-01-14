"use client"
import { useSettings } from "@/context/SettingsContext";
import Wrapper from "./Wrapper";
import { useEffect, useRef, useState } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Divide, Notebook, } from "lucide-react";
import ScrollableTransform from "./pdfcomponents/ScrollabalComponent";
import ExcalidrawComponent from "./canvas/excalidraw/ExcalidrawComponent";
import { Button } from "./ui/button";


interface ScrollableContentProps {
  isExpanded: boolean;
  id: string;
}

export default function ScrollableContent({ isExpanded, id }: ScrollableContentProps) {
  const a4Height = 297
  const containerNodeRef = useRef<HTMLDivElement>(null); 
  const { first, setfirst, isInfinite } = useSettings()
  const {setcurrentDocumentId } = useSettings()


  useEffect(() => {
    setcurrentDocumentId(id)
  }, [id])

  return (
    <div className={`mt-8  transition-all h-[100vh] flex justify-center overflow-auto  duration-300 ease-in-out  w-[100vw] 
      `}
      ref={containerNodeRef}
    >
      <Button variant={"default"} onClick={() => { setfirst(!first) }} className="border border-1 p-2  m-2 rounded-md left-2 top-96 absolute"><Notebook className="w-8 h-8" /></Button>


      <div className="w-[80vw] h-screen">

        {
        !first && <ScrollableTransform>
          <Wrapper id={id} />
        </ScrollableTransform>
        
        }
{/* this is PDF note compoent */}
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




