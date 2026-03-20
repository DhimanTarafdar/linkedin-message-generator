'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <nav className="w-full fixed z-50 top-0 lg:top-4 animate-fade-in">
      <div
        className={cn(
          'w-full max-w-screen-xl mx-auto px-4 py-3 lg:rounded-xl',
          'bg-background/80 backdrop-blur-sm shadow-lg',
          'flex items-center justify-between transition-all duration-300',
          'border-b lg:border border-border'
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">💼</span>
          <span className="font-bold text-lg text-foreground">
            LinkedIn <span style={{ color: 'var(--light-green)' }}>MSG</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-muted-foreground">
            AI-Powered Message Generator
          </span>
          <ThemeToggler />
        </div>
      </div>
    </nav>
  );
}
