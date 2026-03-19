'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ComposeTab from '@/components/ComposeTab';
import ReplyTab from '@/components/ReplyTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('compose');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'compose' ? <ComposeTab /> : <ReplyTab />}

        {/* Footer */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl p-8 text-center">
          <p className="text-gray-300 mb-2">Made with ❤️ using Claude AI</p>
          <p className="text-sm text-gray-400">LinkedIn Message Generator v3.0 - Professional Networking Tool</p>
        </div>
      </div>
    </div>
  );
}