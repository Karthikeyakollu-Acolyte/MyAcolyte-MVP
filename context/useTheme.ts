import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState("light");
  const availableThemes = [
    "veryLightGray",
    "offWhite",
    "cream",
    "paleGreen",
    "lightBlue",
    "darkModeGray",
    "darkModeBlue",
    "offBlue",
  ];
  
  
  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = localStorage.getItem("theme") || "light";
    root.classList.add(initialTheme);
    setTheme(initialTheme);
  }, []);

  const setThemeAndSave = (newTheme: string) => {
    const root = window.document.documentElement;
    // Remove all other theme classes
    availableThemes.forEach((theme) => root.classList.remove(theme));
    // Add the new theme class
    root.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    const currentIndex = availableThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setThemeAndSave(availableThemes[nextIndex]);
  };

  return { theme, availableThemes, setThemeAndSave, toggleTheme };
};
