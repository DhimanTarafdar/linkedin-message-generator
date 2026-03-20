'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ComposeTab from '@/components/ComposeTab';
import ReplyTab from '@/components/ReplyTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('compose');

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pt-24 lg:pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              LinkedIn Message Generator
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              AI-powered personalized messages এবং replies তৈরি করুন মাত্র কয়েক সেকেন্ডে
            </p>
          </div>

          {activeTab === 'compose' ? <ComposeTab /> : <ReplyTab />}

          {/* Footer */}
          <div className="mt-12 bg-card border border-border rounded-xl shadow-sm p-8 text-center">
            <p className="text-muted-foreground mb-2">Made with ❤️ using Claude AI</p>
            <p className="text-sm text-muted-foreground/70">LinkedIn Message Generator v3.0 - Professional Networking Tool</p>
          </div>
        </div>
      </main>
    </div>
  );
}