'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ComposeTab from '@/components/ComposeTab';
import ReplyTab from '@/components/ReplyTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('compose');

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* ── Hero Banner ── */}
      {/* Header section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 50%, #3730a3 100%)',
          paddingTop: '7rem',
          paddingBottom: '4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dot grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
          }}
        />

        {/* Blob 1 */}

        <div
          style={{
            position: 'absolute',
            top: '-6rem',
            left: '-6rem',
            width: '24rem',
            height: '24rem',
            borderRadius: '9999px',
            background: 'rgba(96, 165, 250, 0.2)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        {/* Blob 2 */}
        <div
          style={{
            position: 'absolute',
            top: '2rem',
            right: '-4rem',
            width: '20rem',
            height: '20rem',
            borderRadius: '9999px',
            background: 'rgba(129, 140, 248, 0.2)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '80rem', margin: '0 auto', padding: '0 1.25rem', textAlign: 'center' }}>

          {/* Pill badge */}
          {/* <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              marginBottom: '1.5rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '9999px', background: '#34d399', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            AI-Powered · Free to Use
          </div> */}

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
            }}
          >
            LinkedIn Message
          </h1>
          <h1
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #bae6fd, #c7d2fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
            }}
          >
            Generator
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: 'rgba(219, 234, 254, 0.9)',
              fontSize: '1rem',
              maxWidth: '38rem',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}
          >
            AI দিয়ে personalized connection request, direct message এবং professional reply তৈরি করুন — মাত্র কয়েক সেকেন্ডে।
          </p>

          {/* Tab switcher */}
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </section>

      {/* ── Main Content ── */}
      <section style={{ maxWidth: '80rem', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
        {activeTab === 'compose' ? <ComposeTab /> : <ReplyTab />}
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid #e2e8f0', background: 'white' }}>
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '2rem 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #2563eb, #4338ca)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" fill="white" style={{ width: '1rem', height: '1rem' }}>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
              LinkedMsg
            </span>
          </div>


          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </footer>
    </main>
  );
}