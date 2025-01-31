"use client";
import React, { useState } from "react";
import { MenuIcon, ListIcon, PanelLeft,PanelRight } from "lucide-react";
import { DashHeader } from "@/components/dashboard/DashHeader";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { SettingsProvider } from "@/context/SettingsContext";
import TodoList from "@/components/dashboard/Todo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import acolyte from "@/public/acolyte.png";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <SettingsProvider>
        <DashHeader />
        {/* Sidebar Toggle (Left) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="p-2 fixed top-20 left-2 xl:hidden" variant={"ghost"}>
              <PanelLeft />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[275px] -p-2">
          <Image src={acolyte} alt="Logo" className="w-24 h-24" />
            <SidebarNav />
          </SheetContent>
        </Sheet>
        {/* Todo List Toggle (Right) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="p-1 fixed top-20 right-2 xl:hidden" variant={"ghost"}>
              <PanelRight />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex justify-center pt-10 pr-2">
            <TodoList />
          </SheetContent>
        </Sheet>
        
        <div className="grid grid-cols-12 gap-4 min-h-screen">
          {/* Sidebar (Visible on Large Screens) */}
          <div className="hidden xl:block col-span-2 text-white p-4">
            <SidebarNav />
          </div>
          {/* Main Content */}
          <main className="col-span-12 xl:col-span-7 p-4 overflow-auto scrollbar-hide h-screen flex w-full items-center justify-center">
            {children}
          </main>
          {/* Todo List (Visible on Large Screens) */}
          <div className="hidden lg:block col-span-3 p-4 text-white">
            <TodoList />
          </div>
        </div>
      </SettingsProvider>
    </div>
  );
};

export default Layout;
