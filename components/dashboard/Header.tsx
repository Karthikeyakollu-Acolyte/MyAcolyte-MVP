import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Calendar, User } from 'lucide-react';

const FloatingHeader = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-purple-600 font-bold text-2xl mr-2">AC</div>
        </div>

        {/* Search Bar */}
        <div className={`flex-1 max-w-2xl mx-8 transition-all duration-300 ${
          isSearchFocused ? 'scale-105' : ''
        }`}>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Spotlight search"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative w-12 h-6 rounded-full bg-gray-200 flex items-center transition-colors duration-300"
          >
            <div className={`absolute w-5 h-5 rounded-full transition-transform duration-300 ${
              isDarkMode 
                ? 'transform translate-x-6 bg-purple-600' 
                : 'translate-x-1 bg-yellow-400'
            }`}>
            </div>
          </button>

          <Bell className="h-6 w-6 text-gray-600 hover:text-purple-600 transition-colors cursor-pointer" />
          <MessageSquare className="h-6 w-6 text-gray-600 hover:text-purple-600 transition-colors cursor-pointer" />
          <Calendar className="h-6 w-6 text-gray-600 hover:text-purple-600 transition-colors cursor-pointer" />
          
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingHeader;