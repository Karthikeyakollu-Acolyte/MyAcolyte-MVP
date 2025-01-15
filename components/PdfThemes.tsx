"use client"
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // Adjust the import path based on your project structure
import brushmenu from "@/public/brushmenu.svg";
import { useTheme } from "@/context/useTheme"; // Adjust the import path for the hook
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
  

const PdfThemes = () => {
  const { setTheme } = useSettings();


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
            onClick={() => setTheme(themeOption)}
          >
            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PdfThemes;
