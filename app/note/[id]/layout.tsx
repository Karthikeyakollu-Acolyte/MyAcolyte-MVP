"use client";

import { useState, useEffect } from "react";
import Header from "@/components/canvas/Header";
import ScrollableContent from "@/components/PdfViewerComponent";
import { SettingsProvider, useSettings } from "@/context/SettingsContext";
import Toolbar from "@/components/Toolbar";
export default function Layout({ children }: any) {
  const [isExpanded, setIsExpanded] = useState(true);
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="h-screen w-[100vw] overflow-hidden max-w-[1920px]">
      <SettingsProvider>
        <Header />

        {children}
        <Toolbar />
      </SettingsProvider>
    </div>
  );
}
