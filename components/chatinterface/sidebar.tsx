"use client";
import { Plus, ChevronDown, ArrowLeft, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RecentChats from "./recent-chats";
import home from "@/public/nav/home.svg";
import pdf from "@/public/nav/pdf.svg";
import note from "@/public/nav/note.svg";
import chat from "@/public/nav/chat.svg";
import Image from "next/image";

interface SidebarProps {
  resetChat: () => void;
}

export function Sidebar({ resetChat }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`flex pt-5 pb-5 h-screen flex-col  items-center border-r border-gray-200 bg-[#E2E9F3] transition-all duration-300 ease-in-out ${
        isOpen ? "w-[299px] opacity-100" : "w-0 opacity-0 pointer-events-none"
      }`}
    >
      {isOpen && (
        <div className="mb-10">
          <h2 className="text-center text-xl pb-5  p-1">Pdf Name</h2>
          <div className="w-[255px] flex flex-col gap-10 mt-10 ">
            <Button
              className="justify-between hover:border-2 bg-white font-rubik text-gray-900 text-md hover:bg-gray-50 h-[54px] px-6 rounded-xl border  shadow-sm"
              variant={"default"}
              onClick={() => {
                resetChat(); // Reset chat on new chat click
              }}
            >
              New Chat
              <Plus className="icon p-1.5 rounded-lg  bg-[#553C9A] text-white " />
            </Button>
            <RecentChats />
          </div>
        </div>
      )}
      <div className="flex w-[254px] h-[365px] overflow-scroll scrollbar-hidden ">
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[0.7] w-[75px] h-[109px] rounded-lg bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center"
            >
              <span className="text-gray-400">Placeholder</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[236px] flex  gap-4 mt-5">
        {[home, pdf, note, chat].map((icon) => (
          <div className="">
            <Image src={icon} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
