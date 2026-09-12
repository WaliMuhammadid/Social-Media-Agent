import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { SidebarProvider } from '@/context/SidebarContext';

export const metadata: Metadata = {
  title: 'Social Swarm | Manager Control Center',
  description:
    'Autonomous multi-agent orchestration and operations console for social media operations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400..900;1,14..32,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      {/*
        Donezo pixel-perfect layout:
        - Outer: gray background (#e4e4e4)
        - Inner: ONE large white rounded card (rounded-[28px]) with shadow, floating on the gray
        - The card contains sidebar + content side by side
        - On mobile: card is full-screen (no outer margin), on lg: centered with padding
      */}
      <body className="bg-[#e4e4e4] font-sans text-gray-900 antialiased min-h-screen flex items-start justify-center p-0 lg:p-5 overflow-x-hidden">
        <SidebarProvider>
          {/* The single white rounded card — Donezo's signature floating dashboard frame */}
          <div className="relative flex w-full min-h-screen lg:min-h-[calc(100vh-40px)] bg-white lg:rounded-[28px] lg:overflow-hidden lg:shadow-[0_4px_40px_rgba(0,0,0,0.10)] max-w-[1440px]">

            {/* Fixed sidebar inside the card */}
            <Sidebar />

            {/* Main content column — offset by sidebar width on large screens */}
            <div className="pl-0 lg:pl-56 flex flex-col min-h-screen w-full min-w-0 transition-all duration-300">
              {/* Sticky Navbar */}
              <Navbar />

              {/* Dashboard page content */}
              <main className="w-full flex-1 p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 overflow-x-hidden bg-[#f7f8fa]">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
