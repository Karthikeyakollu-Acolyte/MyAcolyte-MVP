"use client";
import { useParams } from "next/navigation";

import ExcalidrawComponent from "@/components/canvas/excalidraw/ExcalidrawComponent";

const page = () => {
  const { id }: { id: string } = useParams();
  return (
    <div>
      <div className="max-h-screen w-[100vw] overflow-hidden max-w-[1920px]">
        <div className="flex flex-col items-center  h-[100vh]  scrollbar-hide  ">
          <div
            className=""
            style={{
              height: "100vh",
              width: "100vw",
            }}
          >
            <ExcalidrawComponent id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
