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

  const formatMessageText = (text) => {
    return text.split('\n\n').filter(p => p.trim());
  };

  const messageParagraphs = formatMessageText(msg.text);

  return (
    <div className="border border-border rounded-xl p-6 hover:shadow-md transition-all bg-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span
            className="text-white rounded-full w-9 h-9 flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--light-green)' }}
          >
            {index + 1}
          </span>
          <h3 className="font-bold text-foreground text-lg">{msg.version}</h3>
        </div>
        <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full font-semibold border border-border">
          {isConnectionRequest ? `${charCount} chars` : `${wordCount} words`}
        </span>
      </div>

      {/* Message Content */}
      <div className="bg-muted rounded-xl p-5 mb-5 border border-border">
        <div className="text-foreground leading-relaxed text-base space-y-4">
          {messageParagraphs.length > 0 ? (
            messageParagraphs.map((paragraph, idx) => (
              <p key={idx} className="text-foreground/90 leading-7">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-foreground/90 leading-7 whitespace-pre-wrap">{msg.text}</p>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-muted-foreground font-medium">
              {isConnectionRequest
                ? `📊 ${charCount}/300 chars | ~${wordCount} words`
                : `📊 ~${wordCount} words | ${charCount} chars`}
            </p>

            <div>
              {exceedsLimit && (
                <span className="text-xs bg-destructive/10 text-destructive px-2.5 py-1 rounded-full font-semibold">
                  ⚠️ Exceeds Limit
                </span>
              )}
              {isConnectionRequest && !exceedsLimit && charCount > 250 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2.5 py-1 rounded-full font-semibold">
                  ⚡ Near Limit
                </span>
              )}
              {isConnectionRequest && charCount <= 250 && (
                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full font-semibold">
                  ✅ Perfect
                </span>
              )}
              {!isConnectionRequest && (
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: 'var(--light-green)20', color: 'var(--light-green)' }}>
                  ✨ Professional
                </span>
              )}
            </div>
          </div>

          {exceedsLimit && (
            <p className="text-xs text-destructive mt-3 bg-destructive/10 p-2 rounded border border-destructive/20">
              ⚠️ This message exceeds LinkedIn&apos;s 300-character limit. Please use a shorter version.
            </p>
          )}
          {isConnectionRequest && !exceedsLimit && charCount > 280 && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-200 dark:border-yellow-800">
              💡 Getting close to limit - consider shorter option if possible.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          disabled={exceedsLimit}
          className="flex-1 text-white px-4 py-3 rounded-lg transition font-semibold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed gap-2 shadow-sm hover:opacity-90"
          style={{ backgroundColor: copied ? '#16a34a' : 'var(--light-green)' }}
        >
          <span className="text-lg">{copied ? '✅' : '📋'}</span>
          <span>{exceedsLimit ? 'Too Long' : copied ? 'Copied!' : 'Copy Message'}</span>
        </button>

        <button
          className="px-4 py-3 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition font-semibold flex items-center justify-center gap-2"
          title="View message details"
        >
          <span className="text-lg">ℹ️</span>
        </button>
      </div>
    </div>
  );
}
