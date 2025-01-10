"use client";
import { Plus, ChevronDown, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RecentChats from './recent-chats';

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
      className={`flex pt-5 pb-5 h-[991px] flex-col justify-between items-center border-r border-gray-200 bg-gradient-to-b from-[#E5E5E5] to-[#D0D0D0] transition-all duration-300 ease-in-out ${
        isOpen ? "w-[421px] opacity-100" : "w-0 opacity-0 pointer-events-none"
      }`}
    >
      {isOpen && (
        <div>
          <h2 className='text-center text-xl pb-5 mb-5 p-1'>Pdf Name</h2>
          <div className="w-[359px] flex flex-col gap-10">
            <Button
              className="justify-between hover:border-2 bg-white font-rubik text-gray-900 text-xl hover:bg-gray-50 h-[54px] px-6 rounded-xl border border-[#553C9A] shadow-sm"
              variant={'default'}
              onClick={() => {
                resetChat(); // Reset chat on new chat click
              }}
            >
              New Chat
              <Plus className="icon p-1.5 rounded-lg bg-[#553C9A] text-white" />
            </Button>

            <RecentChats />
          </div>
        </div>
      )}

      <div className="flex w-[357px] h-[485px] overflow-scroll scrollbar-hidden">
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[0.7] w-[105px] h-[153px] rounded-lg bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center"
            >
              <span className="text-gray-400">Placeholder</span>
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="p-4">
          <Button
            variant="outline"
            className="justify-between w-[357px] bg-white font-rubik text-gray-900 text-xl hover:bg-gray-50 h-[54px] px-6 rounded-xl border-[#553C9A] shadow-sm"
          >
            Back to notes
            <ArrowLeft className="icon p-1.5 rounded-lg bg-[#553C9A] text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
