'use client';

import { useState, useEffect } from 'react';
import { Linkedin, PenLine, MessageSquareReply, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggler } from '@/components/ui/theme-toggler';
import { cn } from '@/lib/utils';

export default function Header({ activeTab, setActiveTab }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  if (!isMounted) return null;

  return (
    <>
      <nav className="w-full fixed z-50 top-0 lg:top-6">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 lg:rounded-xl bg-background/80 backdrop-blur-sm shadow-lg flex items-center justify-between border-b lg:border border-border transition-all duration-300">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Linkedin className="size-6 text-light-green" />
            <span className="font-bold text-lg">LinkedIn Msg Gen</span>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('compose')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeTab === 'compose'
                  ? 'text-light-green border-b-2 border-light-green'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <PenLine className="size-4" />
              নতুন Message
            </button>
            <button
              onClick={() => setActiveTab('reply')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                activeTab === 'reply'
                  ? 'text-light-green border-b-2 border-light-green'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <MessageSquareReply className="size-4" />
              Reply Generator
            </button>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggler />
            <Button
              variant="light-green"
              size="sm"
              onClick={() => setActiveTab('compose')}
            >
              শুরু করুন
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggler />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out',
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <button
            onClick={() => { setActiveTab('compose'); setIsMenuOpen(false); }}
            className={cn(
              'flex items-center gap-3 text-2xl font-medium transition-colors',
              activeTab === 'compose' ? 'text-light-green' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <PenLine className="size-6" />
            নতুন Message
          </button>
          <button
            onClick={() => { setActiveTab('reply'); setIsMenuOpen(false); }}
            className={cn(
              'flex items-center gap-3 text-2xl font-medium transition-colors',
              activeTab === 'reply' ? 'text-light-green' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <MessageSquareReply className="size-6" />
            Reply Generator
          </button>
        </div>
      </div>
    </>
  );
}