'use client';

import { useState } from 'react';
import MessageCard from './MessageCard';
import { buildReplyPrompt } from '@/utils/promptBuilder';

export default function ReplyTab() {
  const [replyData, setReplyData] = useState({
    receivedMessage: '',
    replyType: 'thank_you_followup',
    context: '',
    yourName: ''
  });
  const [replyMessages, setReplyMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReplyChange = (e) => {
    setReplyData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateReply = async () => {
    setLoading(true);
    setError(null);
    setReplyMessages(null);

    try {
      const prompt = buildReplyPrompt(replyData);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      }).catch(err => {
        throw new Error(`Network error: ${err.message}`);
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Server error: ${response.status}` };
        }
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      // Extract JSON from response - look for JSON object structure
      let result;
      try {
        // Try to find JSON object in the response
        const jsonMatch = responseText.match(/\{[\s\S]*"messages"[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: try simple cleaning and parse
          const cleanText = responseText
            .replace(/```json\s*/g, '')
            .replace(/```\s*/g, '')
            .replace(/^[\s\S]*?(\{)/, '$1')
            .replace(/(\})[\s\S]*?$/, '$1')
            .trim();
          result = JSON.parse(cleanText);
        }
      } catch (parseError) {
        console.error('Raw response:', responseText);
        throw new Error(`Failed to parse API response as JSON: ${parseError.message}`);
      }

      if (result.messages && Array.isArray(result.messages)) {
        setReplyMessages(result.messages);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = replyData.receivedMessage && replyData.yourName;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left Column - Input */}
      <div className="li-card p-5">
        <h2 className="li-section-title">
          <span className="w-8 h-8 rounded-full bg-[#EAF0F9] flex items-center justify-center text-[#0A66C2] text-base">↩️</span>
          Reply to Message
        </h2>
        <div className="li-info-banner">
          💡 তুমি যে message পেয়েছো সেটা paste করো এবং reply type select করো
        </div>

        <div className="space-y-4">
          <div>
            <label className="li-label">Your Name (তোমার নাম) *</label>
            <input
              type="text"
              name="yourName"
              value={replyData.yourName}
              onChange={handleReplyChange}
              className="li-input"
              placeholder="e.g., Dhiman Tarafdar"
            />
          </div>

          <div>
            <label className="li-label">Received Message (যে message পেয়েছো) *</label>
            <textarea
              name="receivedMessage"
              value={replyData.receivedMessage}
              onChange={handleReplyChange}
              rows="8"
              className="li-input resize-none"
              placeholder={`তুমি যে message receive করেছো সেটা এখানে paste করো...

Example:
Hi Dhiman,
It's great that you're already exploring PyTorch. At this stage, I'd recommend focusing on building a few solid end-to-end projects rather than just learning theory...`}
            />
            <p className="text-xs text-[#666666] mt-1">
              LinkedIn, Email বা যেকোনো platform এর message এখানে paste করো
            </p>
          </div>

          <div>
            <label className="li-label">Reply Type (কি ধরনের reply চাও) *</label>
            <select
              name="replyType"
              value={replyData.replyType}
              onChange={handleReplyChange}
              className="li-input"
            >
              <option value="thank_you_followup">🙏 Thank You + Follow-up Question</option>
              <option value="requesting_meeting">📅 Requesting Meeting/Call</option>
              <option value="asking_advice">💡 Asking for Specific Advice</option>
              <option value="sharing_update">📈 Sharing Update/Progress</option>
              <option value="expressing_interest">✨ Expressing Interest in Opportunity</option>
              <option value="requesting_feedback">📝 Requesting Feedback on Work</option>
            </select>
            <p className="text-xs text-[#666666] mt-1">তোমার উদ্দেশ্য অনুযায়ী select করো</p>
          </div>

          <div>
            <label className="li-label">Additional Context (অতিরিক্ত তথ্য - optional)</label>
            <textarea
              name="context"
              value={replyData.context}
              onChange={handleReplyChange}
              rows="3"
              className="li-input resize-none"
              placeholder={`যেমন:
- GitHub: https://github.com/username
- Portfolio: https://myportfolio.com
- Specific questions you want to ask
- Any additional information`}
            />
            <p className="text-xs text-[#666666] mt-1">
              GitHub link, portfolio, বা specific questions যোগ করতে পারো
            </p>
          </div>

          {/* Reply Type Info Box */}
          <div className="bg-[#EAF0F9] border border-[#0A66C2]/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#0A66C2] mb-1">
              {replyData.replyType === 'thank_you_followup' && '🙏 Thank You + Follow-up'}
              {replyData.replyType === 'requesting_meeting' && '📅 Requesting Meeting'}
              {replyData.replyType === 'asking_advice' && '💡 Asking Advice'}
              {replyData.replyType === 'sharing_update' && '📈 Sharing Update'}
              {replyData.replyType === 'expressing_interest' && '✨ Expressing Interest'}
              {replyData.replyType === 'requesting_feedback' && '📝 Requesting Feedback'}
            </h3>
            <p className="text-xs text-[#0A66C2]">
              {replyData.replyType === 'thank_you_followup' && 'তাদের advice এর জন্য ধন্যবাদ দিয়ে একটা thoughtful follow-up question করবে'}
              {replyData.replyType === 'requesting_meeting' && 'তাদের সাথে একটা meeting/call request করবে'}
              {replyData.replyType === 'asking_advice' && 'Specific advice চাইবে কোনো বিষয়ে'}
              {replyData.replyType === 'sharing_update' && 'তোমার progress/update share করবে'}
              {replyData.replyType === 'expressing_interest' && 'কোনো opportunity তে interest দেখাবে'}
              {replyData.replyType === 'requesting_feedback' && 'তোমার work এ feedback চাইবে'}
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateReply}
            disabled={loading || !isFormValid}
            className="li-btn-primary w-full py-4 text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                AI Reply তৈরি করছে...
              </>
            ) : (
              <>
                <span>⚡</span>
                Generate Reply
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column - Output */}
      <div className="li-card p-5 sticky top-6 h-fit">
        <h2 className="li-section-title">
          <span className="w-8 h-8 rounded-full bg-[#EAF0F9] flex items-center justify-center text-[#0A66C2] text-base">✨</span>
          Generated Replies
        </h2>

        {error && (
          <div className="rounded-lg border border-[#CC1016]/30 bg-[#FFF0F0] p-5 text-center mb-4">
            <div className="text-4xl mb-2">⚠️</div>
            <h3 className="text-sm font-semibold text-[#CC1016] mb-1">Error!</h3>
            <p className="text-[#CC1016] text-xs">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-3 text-xs bg-[#CC1016] text-white px-4 py-1.5 rounded-full hover:bg-[#a30d12] transition"
            >
              Close
            </button>
          </div>
        )}

        {!replyMessages && !loading && !error && (
          <div className="text-center py-14 text-[#666666]">
            <div className="text-6xl mb-3">💬</div>
            <p className="text-base font-medium mb-2 text-[#191919]">এখনো reply তৈরি হয়নি</p>
            <p className="text-xs mb-5 max-w-xs mx-auto">
              Received message এবং your name দাও, তারপর Generate Reply click করো
            </p>
            <div className="bg-[#EAF0F9] rounded-lg p-4 border border-[#0A66C2]/20">
              <p className="text-xs text-[#0A66C2]">
                <strong>Example:</strong> তোমার boss বা HR যদি advice দিয়ে reply করে,
                সেটা এখানে paste করো এবং professional reply পাবে! 🎯
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-14">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-b-2 border-[#0A66C2] mb-5"></div>
            <p className="text-sm font-semibold text-[#191919] mb-1">AI reply তৈরি করছে...</p>
            <p className="text-xs text-[#666666]">Professional এবং personalized reply লিখছে...</p>
          </div>
        )}

        {replyMessages && (
          <div className="space-y-5">
            <div className="bg-[#E8F5EF] rounded-lg p-3 border border-[#057642]/30 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <p className="text-sm text-[#057642] font-medium">
                {replyMessages.length}টি Reply তৈরি হয়েছে!
              </p>
            </div>

            {replyMessages.map((msg, index) => (
              <MessageCard
                key={index}
                msg={msg}
                index={index}
                isReply={true}
                messageType="direct_message"
              />
            ))}

            <div className="bg-[#FFF9F0] border border-[#915907]/30 rounded-lg p-4 flex items-start gap-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-xs text-[#666666]">
                <strong className="text-[#191919]">Pro Tip:</strong> Reply পাঠানোর আগে একবার পড়ে নিন এবং
                নিজের মতো করে customize করুন। Personal touch যোগ করলে আরো ভালো!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}