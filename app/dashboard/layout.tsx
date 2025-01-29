"use client"
import React from 'react'
import { useState } from 'react'
import { MenuIcon, ListIcon } from 'lucide-react'
import { DashHeader } from "@/components/dashboard/DashHeader"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { TasksSidebar } from "@/components/dashboard/tasks-sidebar"
import ScrollableContent from '@/components/PdfViewerComponent';
import { SettingsProvider, useSettings } from '@/context/SettingsContext'
import TodoNotes from '@/components/dashboard/Todo'
import TodoList from '@/components/dashboard/Todo'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Props = {}

const Layout: React.FC = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [todoVisible, setTodoVisible] = useState(false);
  const toggleSidebar = () => setSidebarVisible(prev => !prev);
  const toggleTodo = () => setTodoVisible(prev => !prev);

  return (
    <div className="w-screen overflow-hidden h-screen">
      <SettingsProvider>
        <div className="">
          <DashHeader />
          {/* Grid Layout for Main Content */}
          <div className="grid grid-cols-12 gap-4 min-h-screen">
            {/* Mobile Toggle Buttons Container */}
            <div className="col-span-12 p-2 flex justify-between items-center">
              {/* Sidebar Toggle Button - Left Side */}
              <div className="xl:hidden col-span-12 flex items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <button onClick={toggleSidebar} className="p-2 bg-gray-800 rounded-full text-white">
                      <MenuIcon />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SidebarNav />
                  </SheetContent>
                </Sheet>
              </div>

              {/* Todo List Toggle Button - Right Side */}
              <div className="lg:hidden col-span-12 flex items-center">
                <Sheet>
                  <SheetTrigger asChild>
                    <button onClick={toggleTodo} className="p-2 bg-gray-800 rounded-full text-white">
                      <ListIcon />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <TodoList />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Sidebar (always visible on larger screens) */}
            <div className="xl:block col-span-2 hidden top-16 left-0 h-full">
              <SidebarNav />
            </div>

            {/* Main Content */}
            <main className="col-span-12 md:col-span-12 lg:col-span-7 overflow-auto h-screen scrollbar-hidden p-10">
              {children}
            </main>

            {/* Todo List (always visible on larger screens) */}
            <div className="lg:block col-span-3 hidden top-16 right-0 h-full">
              <TodoList />
            </div>
          </div>
        </div>
      </SettingsProvider>
    </div>
  );
};

export default Layout