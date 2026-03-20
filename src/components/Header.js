'use client';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">💼</span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">LinkedIn Message Generator</h1>
      </div>
      <p className="text-muted-foreground text-base md:text-lg mb-6">
        AI-powered personalized messages এবং replies
      </p>

      {/* Tab Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('compose')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'compose'
              ? 'text-white shadow-lg'
              : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
          style={activeTab === 'compose' ? { backgroundColor: 'var(--light-green)' } : {}}
        >
          <span className="text-xl mr-2">✍️</span>
          নতুন Message
        </button>
        <button
          onClick={() => setActiveTab('reply')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
            activeTab === 'reply'
              ? 'text-white shadow-lg'
              : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
          style={activeTab === 'reply' ? { backgroundColor: 'var(--light-green)' } : {}}
        >
          <span className="text-xl mr-2">↩️</span>
          Reply Generator
        </button>
      </div>
    </div>
  );
}