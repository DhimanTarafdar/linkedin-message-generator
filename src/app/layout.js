import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import Navbar from '@/components/navbar/Navbar';

export const metadata = {
  title: 'LinkedIn Message Generator - AI-Powered',
  description: 'Generate personalized LinkedIn connection requests, direct messages, and professional replies using AI',
  keywords: 'LinkedIn, Message Generator, AI, Networking, Professional Messages',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="absolute w-full z-50">
            <Navbar />
          </header>
          <main className="min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
