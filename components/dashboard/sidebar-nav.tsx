"use client"

import { Home, MessageSquare, ListTodo, Users2, Settings } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react';

export function SidebarNav() {
  const [selectedMenu, setSelectedMenu] = useState('home'); // Track selected menu

  return (
    <div className="w-[270px] min-h-screen border-r bg-white mt-3">
      <div className="px-3 py-4">
        <nav className="space-y-2 font-medium">
          <Link
            href="/dashboard"
            onClick={() => setSelectedMenu('home')}
            className={`w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 font-rubik text-lg rounded-lg ${selectedMenu === 'home' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            href="/dashboard/notes"
            onClick={() => setSelectedMenu('notes')}
            className={`w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 text-lg font-rubik rounded-lg ${selectedMenu === 'notes' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Notes
          </Link>
          <Link
            href="/dashboard/pdf"
            onClick={() => setSelectedMenu('PdfNotes')}
            className={`w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 text-lg font-rubik rounded-lg ${selectedMenu === 'PdfNotes' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ListTodo className="w-5 h-5" />
            PDFNotes
          </Link>
          <Link
            href="/chat"
            onClick={() => setSelectedMenu('chat')}
            className={`w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 text-lg font-rubik rounded-lg ${selectedMenu === 'chat' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users2 className="w-5 h-5" />
            Chat
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setSelectedMenu('settings')}
            className={`w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 text-lg font-rubik rounded-lg ${selectedMenu === 'settings' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="mt-8">
          <div className="px-3 text-xs font-semibold font-rubik text-gray-500">LESSONS</div>
          <nav className="mt-2 space-y-2">
            <Link
              href="#"
              className="w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 text-lg font-rubik rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              Website Redesign
            </Link>
            <Link
              href="#"
              className="w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 text-lg font-rubik rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              Design System
            </Link>
            <Link
              href="#"
              className="w-[249px] h-[39px] flex items-center gap-3 px-3 py-2 text-lg font-rubik rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Wireframes
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
