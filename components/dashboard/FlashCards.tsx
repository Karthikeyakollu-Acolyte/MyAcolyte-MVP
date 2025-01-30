import React from 'react';
import { Search, Plus, MoreHorizontal } from 'lucide-react';

const FlashCards = () => {
  return (
    <div className="w-[537px] h-[498px] font-rubik">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl  font-semibold text-green-700">My Flash Cards</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Search size={20} />
          </button>
          <button className="p-2 bg-emerald-50 text-emerald-700 rounded-full">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div className="space-y-4 w-[505px] h-[436px] bg-[#F6F7F9] rounded-xl flex items-center justify-center flex-col">
        {/* Brainstorming Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm w-[375px] h-[152px]">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              {/* Avatar Group */}
              <div className="flex -space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white"></div>
              </div>
              <h2 className="font-semibold text-gray-900">Brainstorming</h2>
              <p className="text-sm text-gray-500">
                Brainstorming brings team members' diverse experience into play.
              </p>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Research Card - Rotated slightly */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-200 rounded-xl transform  w-[375px] h-[152px]"></div>
          <div className="bg-white rounded-xl p-4 shadow-sm relative rotate-12  w-[375px] h-[152px]">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                {/* Avatar Group */}
                <div className="flex -space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white"></div>
                </div>
                <h2 className="font-semibold text-gray-900">Research</h2>
                <p className="text-sm text-gray-500">
                  User research helps you to create an optimal product for users.
                </p>
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCards;