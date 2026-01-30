import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type NavStyle = "sidebar" | "top";
type NavColor = "light" | "dark" | "brand";

interface UIContextType {
  navStyle: NavStyle;
  navColor: NavColor;
  setNavStyle: (style: NavStyle) => void;
  setNavColor: (color: NavColor) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [navStyle, setNavStyle] = useState<NavStyle>(() => {
    return (localStorage.getItem("ui_nav_style") as NavStyle) || "sidebar";
  });
  
  const [navColor, setNavColor] = useState<NavColor>(() => {
    return (localStorage.getItem("ui_nav_color") as NavColor) || "light";
  });

  useEffect(() => {
    localStorage.setItem("ui_nav_style", navStyle);
  }, [navStyle]);

  useEffect(() => {
    localStorage.setItem("ui_nav_color", navColor);
  }, [navColor]);

  return (
    <UIContext.Provider value={{ navStyle, navColor, setNavStyle, setNavColor }}>
      {children}
    </UIContext.Provider>
  );
};
