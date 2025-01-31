"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import home from "@/public/homesidebar.svg";
import chat from "@/public/chat.svg";
import pdfviewer from "@/public/pdfviewer.svg";
import notes from "@/public/notes.svg";
import singlepage from "@/public/singlepageview.svg";
import doublepage from "@/public/doublepageview.svg";
import caraousel from "@/public/caraouselview.svg";
import expand from "@/public/expand.svg";
import read from "@/public/read.svg";
import write from "@/public/write.svg";
import { useSettings } from "@/context/SettingsContext";
import PDFCounter from "@/components/pdfcomponents/pdf-page-counter";
import ToggleButton from "@/components/DarkModeToggle";
import { useRouter } from "next/navigation";

const NavButton = ({ active, onClick, icon, label }) => (
  <div className="relative group inline-flex items-center">
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-lg transition-colors"
    >
      <Image src={icon} alt={label} className="" />
    </button>
    <div className="absolute left-full ml-0 top-1/2 -translate-y-1/2 overflow-hidden">
      <div className="transform transition-all duration-200 ease-out origin-left scale-x-0 group-hover:scale-x-100">
        <span className="block whitespace-nowrap p-1 text-lg text-purple-900 bg-white">
          {label}
        </span>
      </div>
    </div>
  </div>
);

const ViewButton = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`rounded-xl transition-colors ${
      active ? "text-[#553C9A] " : "text-zinc-500"
    } hover:text-[#553C9A]`}
  >
    <Image
      src={icon}
      alt=""
      className={`transition-colors ${active ? "filter invert" : ""}`}
    />
  </button>
);

const ToolButton = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex justify-center items-center rounded-full w-[44px] h-[44px] transition-colors  ${
      active ? "bg-[#d6cff1] " : "text-zinc-500"
    }`}
  >
    <Image src={icon} alt="" />
  </button>
);

const ViewMode = {
  SINGLE: "single",
  DOUBLE: "double",
  CAROUSEL: "carousel",
};

export default function Sidebar() {
  const [activeNav, setActiveNav] = useState("");
  const [activeView, setActiveView] = useState("");
  const [activeTool, setActiveTool] = useState("read");
  const { setfirst, setViewMode,setisExpanded,isExpanded } = useSettings();
  const router = useRouter()

  return (
    <div
      className="fixed left-6 top-36 flex h-[577px] w-[48px] flex-col items-center py-4"
      style={{ zIndex: 10 }}
    >
      <div className="flex flex-col items-center gap-2.5">
        {/* Navigation Buttons */}
        <div className="flex flex-col items-center gap-2.5">
          <NavButton
            active={activeNav === "home"}
            onClick={() => {setActiveNav("home"); router.push('/dashboard') }}
            icon={home}
            label="Home"
          />
          <NavButton
            active={activeNav === "pdf"}
            onClick={() => {setActiveNav("pdf");router.push('/dashboard/pdf')}}
            icon={pdfviewer}
            label="PDF Viewer"
          />
          <NavButton
            active={activeNav === "notes"}
            onClick={() => {setActiveNav("notes"); router.push('/dashboard/notes')}}
            icon={notes}
            label="Notes"
          />
          <NavButton
            active={activeNav === "chat"}
            onClick={() => {setActiveNav("chat");router.push('/chat')}}
            icon={chat}
            label="Chat"
          />
        </div>

        {/* View Mode Buttons */}
        <div className="flex flex-col items-center justify-center gap-6 rounded-md p-2 py-3 mb-1 shadow-md bg-[#F8F8F8]">
          <ViewButton
            active={activeView === "single"}
            onClick={() => {
              setActiveView("single");
              setViewMode(ViewMode.SINGLE);
            }}
            icon={singlepage}
          />
          <ViewButton
            active={activeView === "double"}
            onClick={() => {
              setActiveView("double");
              setViewMode(ViewMode.DOUBLE);
            }}
            icon={doublepage}
          />
          <ViewButton
            active={activeView === "carousel"}
            onClick={() => {
              setActiveView("carousel");
              setViewMode(ViewMode.CAROUSEL);
            }}
            icon={caraousel}
          />
        </div>

        <div className="">
          <NavButton
            active={activeNav === "expand"}
            onClick={() => {setActiveNav("expand"); setisExpanded(!isExpanded) }}
            icon={expand}
            label="Expand"
          />

          {/* Tool Buttons */}
          <div className="flex flex-col justify-center items-center py-1 rounded-full shadow-md bg-[#f8f8f8]">
            <ToolButton
              active={activeTool === "read"}
              onClick={() => {
                setActiveTool("read");
                setfirst(false);
              }}
              icon={read}
            />
            <ToolButton
              active={activeTool === "write"}
              onClick={() => {
                setActiveTool("write");
                setfirst(true);
              }}
              icon={write}
            />
          </div>
        </div>
      </div>

      <div className="ml-5 mt-8">
        <ToggleButton/>
        {/* <PDFCounter /> */}
      </div>
    </div>
  );
}
