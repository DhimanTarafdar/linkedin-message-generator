'use client';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="bg-white border border-[#E0E0E0] rounded-lg shadow-sm mb-6 overflow-hidden">
      {/* Top bar */}
      <div className="px-6 pt-6 pb-4 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3 mb-1">
          {/* LinkedIn-style icon */}
          <div className="w-9 h-9 rounded-md bg-[#0A66C2] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#191919] leading-tight">
              LinkedIn Message Generator
            </h1>
            <p className="text-[13px] text-[#666666]">
              AI-powered personalized messages ও replies তৈরি করুন
            </p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="px-6 py-3 flex gap-2 bg-[#FAFAFA]">
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            activeTab === 'compose'
              ? 'bg-[#0A66C2] text-white shadow-sm'
              : 'text-[#0A66C2] border border-[#0A66C2] hover:bg-[#EAF0F9]'
          }`}
        >
          ✍️ নতুন Message
        </button>
        <button
          onClick={() => setActiveTab('reply')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            activeTab === 'reply'
              ? 'bg-[#0A66C2] text-white shadow-sm'
              : 'text-[#0A66C2] border border-[#0A66C2] hover:bg-[#EAF0F9]'
          }`}
        >
          ↩️ Reply Generator
        </button>
      </div>
    </header>
  );
}