import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { NavigationProgress } from "@/components/NavigationProgress";
import "@uploadthing/react/styles.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FarmLink Zim — Farmers • Buyers • Better Together",
    template: "%s | FarmLink Zim",
  },
  description:
    "Connect directly with local Zimbabwean farmers. Find fresh produce, livestock, and agricultural products — or post what you need and let farmers come to you.",
  applicationName: "FarmLink Zim",
  keywords: [
    "Zimbabwe",
    "agriculture",
    "farmers",
    "marketplace",
    "produce",
    "livestock",
    "Harare",
    "Bulawayo",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#f8faf9] text-gray-900 font-sans antialiased">
        <AuthProvider>
          <NavigationProgress />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}