"use client"
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import brushmenu from "@/public/brushmenu.svg";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";

const availableThemes = [
  "Dark Brown",        // #291D00
  "Deep Red",          // #390003
  "Midnight Blue",     // #002033
  "Deep Purple",       // #160039
  "Charcoal Black",    // #202020
  "Very Dark Purple"   // #090822
];

const THEME_STORAGE_KEY = 'pdf-theme-preference';

const PdfThemes = () => {
  const { setTheme, theme } = useSettings();

  useEffect(() => {
    // Retrieve theme from localStorage when component mounts
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && availableThemes.includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const handleThemeChange = (newTheme) => {
    // Save to localStorage and update theme
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded focus:outline-none hover:bg-gray-200 transition"
          aria-label="PDF Themes Menu"
        >
          <Image
            loading="lazy"
            src={brushmenu}
            alt="Navigation icon"
            className="object-contain w-[59.24px] h-[35.88px] aspect-[1.64] mr-2"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {availableThemes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption}
            onClick={() => handleThemeChange(themeOption)}
          >
            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PdfThemes;