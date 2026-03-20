'use client';

import { useState } from 'react';
import { getCharacterCount, getWordCount, copyToClipboard } from '@/utils/helpers';

export default function MessageCard({ msg, index, isReply = false, messageType = 'direct_message' }) {
  const [copied, setCopied] = useState(false);
  
  const charCount = getCharacterCount(msg.text);
  const wordCount = getWordCount(msg.text);
  const isConnectionRequest = !isReply && messageType === 'connection_request';
  const exceedsLimit = isConnectionRequest && charCount > 300;

  const handleCopy = async () => {
    const success = await copyToClipboard(msg.text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Copy failed! Please try again.');
    }
  };

  // Format message text for better readability
  const formatMessageText = (text) => {
    // Split into paragraphs and clean up
    return text.split('\n\n').filter(p => p.trim());
  };

  const messageParagraphs = formatMessageText(msg.text);

  // Status badge config
  let statusBadge = null;
  if (isConnectionRequest) {
    if (exceedsLimit) {
      statusBadge = { label: '⚠️ Exceeds Limit', bg: 'var(--error-light)', color: 'var(--error)', border: '#f5c6c6' };
    } else if (charCount > 250) {
      statusBadge = { label: '⚡ Near Limit', bg: 'var(--warning-light)', color: 'var(--warning)', border: '#fde8b1' };
    } else {
      statusBadge = { label: '✅ Perfect', bg: 'var(--success-light)', color: 'var(--success)', border: '#b8dfc8' };
    }
  } else {
    statusBadge = { label: '✨ Professional', bg: 'var(--primary-light)', color: 'var(--primary)', border: 'var(--border)' };
  }

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        border: exceedsLimit ? '1.5px solid var(--error)' : '1.5px solid var(--border)',
        background: 'var(--card-bg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)', background: '#fafafa' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
            style={{ background: 'var(--primary)', color: '#fff' }}
          >
            {index + 1}
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {msg.version}
          </span>
        </div>
        {statusBadge && (
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.border}` }}
          >
            {statusBadge.label}
          </span>
        )}
      </div>

      {/* Message Body */}
      <div className="px-4 py-4">
        <div
          className="rounded-lg px-4 py-3 mb-3"
          style={{ background: '#f3f2ef', border: '1px solid var(--border)' }}
        >
          <div className="space-y-3" style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: '1.65' }}>
            {messageParagraphs.length > 0 ? (
              messageParagraphs.map((paragraph, idx) => (
                <p key={idx} style={{ color: 'var(--text-primary)' }}>{paragraph}</p>
              ))
            ) : (
              <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {isConnectionRequest
              ? `${charCount}/300 chars · ~${wordCount} words`
              : `~${wordCount} words · ${charCount} chars`}
          </p>
        </div>

        {/* Warning messages */}
        {exceedsLimit && (
          <div
            className="text-xs px-3 py-2 rounded-lg mb-3"
            style={{ background: 'var(--error-light)', color: 'var(--error)', border: '1px solid #f5c6c6' }}
          >
            ⚠️ This message exceeds LinkedIn&apos;s 300-character limit. Please use a shorter version.
          </div>
        )}
        {isConnectionRequest && !exceedsLimit && charCount > 280 && (
          <div
            className="text-xs px-3 py-2 rounded-lg mb-3"
            style={{ background: 'var(--warning-light)', color: 'var(--warning)', border: '1px solid #fde8b1' }}
          >
            💡 Getting close to limit — consider a shorter option if possible.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            disabled={exceedsLimit}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={
              exceedsLimit
                ? { background: '#e0dfdc', color: 'var(--text-muted)', cursor: 'not-allowed' }
                : copied
                ? { background: 'var(--success)', color: '#fff', boxShadow: 'var(--shadow-sm)' }
                : { background: 'var(--primary)', color: '#fff', boxShadow: 'var(--shadow-sm)' }
            }
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
                {exceedsLimit ? 'Too Long' : 'Copy Message'}
              </>
            )}
          </button>

          <button
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
            title="View message details"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
