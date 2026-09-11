import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Social Media AI Agent Team | Manager Control Center',
  description:
    'Autonomous, manager-led multi-agent system designed for end-to-end social media operations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden ambient-bg">
          {/* Top Navbar */}
          <Navbar />

          {/* Dynamic Scrollable Page Content */}
          <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
