'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-blue-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-[72px]">

          {/* ── Logo & Brand ── */}
          <div className="flex items-center gap-3">
            {/* Icon mark */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg viewBox="0 0 24 24" fill="white" className="w-[18px] h-[18px]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              {/* live dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
            </div>

            {/* Brand text */}
            <div className="leading-none">
              <p
                className={`font-extrabold text-[15px] md:text-base tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-gray-900' : 'text-white'
                }`}
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                LinkedMsg
              </p>
              <p
                className={`text-[9px] md:text-[10px] font-semibold tracking-[0.18em] uppercase mt-0.5 transition-colors duration-300 ${
                  scrolled ? 'text-blue-600' : 'text-blue-200'
                }`}
              >
                AI Generator
              </p>
            </div>
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            {/* "Powered by AI" badge — Shadcn Badge */}
            <Badge
              variant="outline"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${
                scrolled
                  ? 'border-blue-200 text-blue-700 bg-blue-50'
                  : 'border-white/30 text-white bg-white/10 backdrop-blur-sm'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Powered by AI
            </Badge>

            {/* CTA button — Shadcn Button */}
            <Button
              size="sm"
              className={`rounded-full text-xs font-bold px-4 transition-all duration-300 shadow-md ${
                scrolled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                  : 'bg-white text-blue-700 hover:bg-blue-50 shadow-white/20'
              }`}
            >
              Try Free ✦
            </Button>
          </div>
        </div>
      </div>

      {/* bottom gradient line on scroll */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-400 transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </header>
  );
}