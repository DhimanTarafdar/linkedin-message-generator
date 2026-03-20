'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ComposeTab from '@/components/ComposeTab';
import ReplyTab from '@/components/ReplyTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('compose');

  return (
    <div className="min-h-screen bg-[#F3F2EF] py-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'compose' ? <ComposeTab /> : <ReplyTab />}

        {/* Footer */}
        <div className="mt-8 text-center py-4">
          <p className="text-[13px] text-[#666666]">
            Made with ❤️ using Claude AI &nbsp;·&nbsp; LinkedIn Message Generator v3.0
          </p>
        </div>
      </div>
    </div>
  );
}