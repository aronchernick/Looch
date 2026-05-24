import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import BottomNav from "@/components/layout/BottomNav";
import AdBanner from "@/components/layout/AdBanner";

export const metadata: Metadata = {
  title: "Looch – Jewish Family Calendar",
  description: "The family calendar built for the Frum Jewish home.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
    <html lang="he">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="max-w-lg mx-auto min-h-screen flex flex-col relative shadow-xl" style={{ backgroundColor: "#FAFAF7" }}>
          {children}
        </div>
        <AdBanner />
        <BottomNav />
      </body>
    </html>
    </ClerkProvider>
  );
}
