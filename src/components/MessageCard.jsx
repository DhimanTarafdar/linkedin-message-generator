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
    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-400 hover:shadow-2xl transition-all bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <h3 className="font-bold text-gray-800 text-lg">{msg.version}</h3>
        </div>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-semibold">
          {isConnectionRequest ? `${charCount} chars` : `${wordCount} words`}
        </span>
      </div>
      
      {/* Message Content */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-5 border border-gray-200 relative">
        {/* Professional formatting with proper spacing */}
        <div className="text-gray-800 leading-relaxed text-base space-y-4 font-medium">
          {messageParagraphs.length > 0 ? (
            messageParagraphs.map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 leading-7">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-gray-700 leading-7 whitespace-pre-wrap">{msg.text}</p>
          )}
        </div>
        
        {/* Stats Section */}
        <div className="mt-5 pt-4 border-t border-gray-300">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-gray-600 font-medium">
              {isConnectionRequest 
                ? `📊 ${charCount}/300 chars | ~${wordCount} words` 
                : `📊 ~${wordCount} words | ${charCount} chars`
              }
            </p>
            
            {/* Status Badges */}
            <div>
              {exceedsLimit && (
                <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-semibold">
                  ⚠️ Exceeds Limit
                </span>
              )}
              {isConnectionRequest && !exceedsLimit && charCount > 250 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-semibold">
                  ⚡ Near Limit
                </span>
              )}
              {isConnectionRequest && charCount <= 250 && (
                <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                  ✅ Perfect
                </span>
              )}
              {!isConnectionRequest && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                  ✨ Professional
                </span>
              )}
            </div>
          </div>
          
          {/* Warning Message */}
          {exceedsLimit && (
            <p className="text-xs text-red-600 mt-3 bg-red-50 p-2 rounded border border-red-200">
              ⚠️ This message exceeds LinkedIn's 300-character limit. Please use a shorter version.
            </p>
          )}
          {isConnectionRequest && !exceedsLimit && charCount > 280 && (
            <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded border border-amber-200">
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
          className={`flex-1 ${
            copied 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white px-4 py-3 rounded-lg transition font-semibold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed gap-2 shadow-md hover:shadow-lg`}
        >
          <span className="text-lg">{copied ? '✅' : '📋'}</span>
          <span>{exceedsLimit ? 'Too Long' : copied ? 'Copied!' : 'Copy Message'}</span>
        </button>
        
        <button
          className="px-4 py-3 rounded-lg border-2 border-gray-300 hover:border-indigo-400 text-gray-700 hover:text-indigo-600 transition font-semibold flex items-center justify-center gap-2"
          title="View message details"
        >
          <span className="text-lg">ℹ️</span>
        </button>
      </div>
    </div>
  );
}