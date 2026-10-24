import { Inter, Manrope } from "next/font/google";

export const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
export const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope", display: "swap" });

/** Applies the saved theme before first paint (dark is the default). */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})();`;
