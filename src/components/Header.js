'use client';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-6 md:p-8 mb-6 text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">LinkedIn Message Generator</h1>
      <p className="text-blue-100 text-base md:text-lg mb-6">
        AI-powered personalized messages এবং replies
      </p>
      
      {/* Tab Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('compose')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'compose'
              ? 'bg-white text-indigo-600 shadow-lg'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <span className="text-xl mr-2">✍️</span>
          নতুন Message
        </button>
        <button
          onClick={() => setActiveTab('reply')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'reply'
              ? 'bg-white text-indigo-600 shadow-lg'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <span className="text-xl mr-2">↩️</span>
          Reply Generator
        </button>
      </div>
    </div>
  );
}