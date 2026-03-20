'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ComposeTab from '@/components/ComposeTab';
import ReplyTab from '@/components/ReplyTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('compose');

  return (
    <div className="min-h-screen py-6 px-4 md:px-6" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'compose' ? <ComposeTab /> : <ReplyTab />}

        {/* Footer */}
        <footer
          className="mt-10 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Made with <span style={{ color: 'var(--error)' }}>♥</span> using Claude AI
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            LinkedIn Message Generator v3.0 · Professional Networking Tool
          </p>
        </footer>
      </div>
    </div>
  );
}
