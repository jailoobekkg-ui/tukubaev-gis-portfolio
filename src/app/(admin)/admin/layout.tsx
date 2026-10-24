import type { Metadata } from "next";
import "../../globals.css";
import { inter, manrope, themeScript } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
