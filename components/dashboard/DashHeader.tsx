import { Search, Calendar, Clock, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import acolyte from '@/public/acolyte.png'

export function DashHeader() {
  return (
    <header className="w-[1920px] h-[94px] border-b bg-white flex items-center justify-between px-4">
    {/* Logo */}
    <div className="flex items-center gap-4">
      <div className="">
        <Image src={acolyte} alt="Logo" />
      </div>
      
      {/* Search Bar */}
      <div className="relative ml-[160px] w-[417px] h-[44px] font-rubik">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Search for anything..." 
          className="w-full pl-9 bg-[#F6F7F9] border-none focus-visible:ring-0"
        />
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
      <div className="flex items-center gap-3 ml-2">
        <div className="text-right">
          <div className="text-md font-medium font-rubik">Anima Agrawal</div>
          <div className="text-sm text-gray-500">U.P, India</div>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-200" />
      </div>
    </div>
  </header>
  )
}

