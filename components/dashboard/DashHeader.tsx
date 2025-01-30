"use client";
import { Calendar, Clock, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import acolyte from "@/public/acolyte.png";
import Search from "./Search";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import DarkToggleButton from "../DarkModeToggle";

export function DashHeader() {
  const router = useRouter();
  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  return (
    <header className="w-full h-[87px] border-b flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Logo & Search */}
      <div className="flex items-center justify-between w-[60vw] gap-4">
        <Image src={acolyte} alt="Logo" className="w-24 h-24" />
        <div className="hidden md:block w-full max-w-md">
          <Search />
        </div>
      </div>

      {/* Right Icons and User Info */}
      <div className="flex items-center gap-4 ml-2">
        <DarkToggleButton />
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Calendar className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Clock className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* User Info */}
        <div
          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
          onClick={handleProfileClick}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
        </div>
      </div>
    </header>
  );
}
