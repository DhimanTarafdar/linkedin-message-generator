'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ComposeTab from '@/components/ComposeTab';
import ReplyTab from '@/components/ReplyTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('compose');

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-28 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'compose' ? <ComposeTab /> : <ReplyTab />}

        {/* Footer */}
        <div className="mt-12 bg-card border border-border rounded-2xl shadow-sm p-8 text-center">
          <p className="text-muted-foreground mb-2">Made with ❤️ using Claude AI</p>
          <p className="text-sm text-muted-foreground/70">LinkedIn Message Generator v3.0 - Professional Networking Tool</p>
        </div>
      </div>
    </div>
  );
}