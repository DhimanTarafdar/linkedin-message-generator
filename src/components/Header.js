'use client';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="mb-6">
      {/* Top bar */}
      <div
        className="rounded-2xl px-6 py-5 mb-0"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl w-11 h-11 shrink-0"
              style={{ background: 'var(--primary)' }}
            >
              {/* LinkedIn-style "in" mark */}
              <svg viewBox="0 0 24 24" fill="white" width="22" height="22" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                LinkedIn Message Generator
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                AI-powered personalized messages &amp; replies
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('compose')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={
                activeTab === 'compose'
                  ? { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-md)' }
                  : { background: 'var(--primary-light)', color: 'var(--primary)' }
              }
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
              নতুন Message
            </button>
            <button
              onClick={() => setActiveTab('reply')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={
                activeTab === 'reply'
                  ? { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-md)' }
                  : { background: 'var(--primary-light)', color: 'var(--primary)' }
              }
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
              </svg>
              Reply Generator
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
