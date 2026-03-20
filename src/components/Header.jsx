'use client';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <div className="inline-flex bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-1.5 gap-1.5">
      <button
        onClick={() => setActiveTab('compose')}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
          activeTab === 'compose'
            ? 'bg-white text-indigo-700 shadow-lg shadow-indigo-900/20'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="text-base">✍️</span>
        নতুন Message
      </button>

      <button
        onClick={() => setActiveTab('reply')}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
          activeTab === 'reply'
            ? 'bg-white text-indigo-700 shadow-lg shadow-indigo-900/20'
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="text-base">↩️</span>
        Reply Generator
      </button>
    </div>
  );
}