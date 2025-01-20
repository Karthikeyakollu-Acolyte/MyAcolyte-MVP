"use client";
import { Calendar, Clock, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import acolyte from "@/public/acolyte.png";
import Search from "./Search";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function DashHeader() {
  const router = useRouter();
  const handleProfileClick = () => {
    router.push("/dashboard/profile");
    // console.log("this is ckuicked");
  };
  return (
    <header className="w-[1920px]  h-[87px] border-b flex items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="">
          <Image src={acolyte} alt="Logo" />
        </div>

        {/* Search Bar */}
        <div className="flex justify-center z-50 absolute w-[1920px]">
          <Search />
        </div>
      </div>

      {/* Right Icons and User Info */}
      <div className="flex items-center mr-9 gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50">
          <Calendar className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50">
          <Clock className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        {/* User Info */}
        <div
          className="flex items-center gap-3 ml-2 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer"
          onClick={handleProfileClick}
          style={{ zIndex: 999 }}
          // variant={"ghost"}
        >
          {/* User Details Section */}
          <div className="text-right">
            <div className="text-md font-medium font-rubik">Anima Agrawal</div>
            <div className="text-sm text-gray-500">U.P, India</div>
          </div>

          {/* Profile Picture Section */}
          <div
            className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"
            aria-label="User Profile Picture"
          />
        </div>
      </div>
    </header>
  );
}
