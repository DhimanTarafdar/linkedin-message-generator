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

  return (
    <div className="li-card p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-[#0A66C2] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0">
            {index + 1}
          </span>
          <h3 className="font-semibold text-[#191919] text-sm">{msg.version}</h3>
        </div>
        <span className="text-xs bg-[#EAF0F9] text-[#0A66C2] px-2.5 py-1 rounded-full font-medium">
          {isConnectionRequest ? `${charCount} chars` : `${wordCount} words`}
        </span>
      </div>

      {/* Message Content */}
      <div className="bg-[#FAFAFA] rounded-lg p-4 mb-4 border border-[#E0E0E0]">
        <div className="text-[#191919] leading-relaxed text-sm space-y-3">
          {messageParagraphs.length > 0 ? (
            messageParagraphs.map((paragraph, idx) => (
              <p key={idx} className="text-[#333333] leading-6">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-[#333333] leading-6 whitespace-pre-wrap">{msg.text}</p>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 pt-3 border-t border-[#E0E0E0] flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-[#666666]">
            {isConnectionRequest
              ? `${charCount}/300 chars · ~${wordCount} words`
              : `~${wordCount} words · ${charCount} chars`}
          </p>
          <div>
            {exceedsLimit && (
              <span className="text-xs bg-[#FFF0F0] text-[#CC1016] px-2 py-0.5 rounded-full font-medium border border-[#CC1016]/20">
                ⚠️ Exceeds Limit
              </span>
            )}
            {isConnectionRequest && !exceedsLimit && charCount > 250 && (
              <span className="text-xs bg-[#FFF9F0] text-[#915907] px-2 py-0.5 rounded-full font-medium border border-[#915907]/20">
                ⚡ Near Limit
              </span>
            )}
            {isConnectionRequest && charCount <= 250 && (
              <span className="text-xs bg-[#E8F5EF] text-[#057642] px-2 py-0.5 rounded-full font-medium border border-[#057642]/20">
                ✅ Perfect
              </span>
            )}
            {!isConnectionRequest && (
              <span className="text-xs bg-[#EAF0F9] text-[#0A66C2] px-2 py-0.5 rounded-full font-medium border border-[#0A66C2]/20">
                ✨ Professional
              </span>
            )}
          </div>
        </div>

        {exceedsLimit && (
          <p className="text-xs text-[#CC1016] mt-2 bg-[#FFF0F0] p-2 rounded border border-[#CC1016]/20">
            ⚠️ This message exceeds LinkedIn&apos;s 300-character limit. Please use a shorter version.
          </p>
        )}
        {isConnectionRequest && !exceedsLimit && charCount > 280 && (
          <p className="text-xs text-[#915907] mt-2 bg-[#FFF9F0] p-2 rounded border border-[#915907]/20">
            💡 Getting close to limit — consider a shorter option if possible.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          disabled={exceedsLimit}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
            copied
              ? 'bg-[#057642] text-white'
              : 'bg-[#0A66C2] text-white hover:bg-[#004182]'
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <span className="text-base">{copied ? '✅' : '📋'}</span>
          <span>{exceedsLimit ? 'Too Long' : copied ? 'Copied!' : 'Copy Message'}</span>
        </button>

        <button
          className="px-4 py-2.5 rounded-full border border-[#C5C5C5] text-[#666666] hover:border-[#0A66C2] hover:text-[#0A66C2] transition text-sm font-medium flex items-center justify-center gap-1"
          title="View message details"
        >
          <span className="text-base">ℹ️</span>
        </button>
      </div>
    </div>
  );
}