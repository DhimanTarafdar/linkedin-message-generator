'use client';

import { useState } from 'react';
import MessageCard from './MessageCard';
import { FormInput, inputClass, inputStyle } from './FormField';
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

  const replyTypeLabels = {
    thank_you_followup: '🙏 Thank You + Follow-up',
    requesting_meeting: '📅 Requesting Meeting',
    asking_advice: '💡 Asking Advice',
    sharing_update: '📈 Sharing Update',
    expressing_interest: '✨ Expressing Interest',
    requesting_feedback: '📝 Requesting Feedback',
  };
  const replyTypeDescriptions = {
    thank_you_followup: 'তাদের advice এর জন্য ধন্যবাদ দিয়ে একটা thoughtful follow-up question করবে',
    requesting_meeting: 'তাদের সাথে একটা meeting/call request করবে',
    asking_advice: 'Specific advice চাইবে কোনো বিষয়ে',
    sharing_update: 'তোমার progress/update share করবে',
    expressing_interest: 'কোনো opportunity তে interest দেখাবে',
    requesting_feedback: 'তোমার work এ feedback চাইবে',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left Column - Input */}
      <section
        className="rounded-2xl p-5"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <h2 className="text-base font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: 'var(--primary)' }} aria-hidden="true">
            <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
          </svg>
          Reply to Message
        </h2>
        <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ color: 'var(--text-secondary)', background: 'var(--primary-light)' }}>
          💡 তুমি যে message পেয়েছো সেটা paste করো এবং reply type select করো
        </p>

        <div className="space-y-3.5">
          <FormInput label="Your Name (তোমার নাম)" required>
            <input
              type="text"
              name="yourName"
              value={replyData.yourName}
              onChange={handleReplyChange}
              className={inputClass}
              style={inputStyle}
              placeholder="e.g., Dhiman Tarafdar"
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </FormInput>

          <FormInput
            label="Received Message (যে message পেয়েছো)"
            required
            hint="LinkedIn, Email বা যেকোনো platform এর message এখানে paste করো"
          >
            <textarea
              name="receivedMessage"
              value={replyData.receivedMessage}
              onChange={handleReplyChange}
              rows="8"
              className={inputClass}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder={`তুমি যে message receive করেছো সেটা এখানে paste করো...

Example:
Hi Dhiman,
It's great that you're already exploring PyTorch. At this stage, I'd recommend focusing on building a few solid end-to-end projects rather than just learning theory...`}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </FormInput>

          <FormInput
            label="Reply Type (কি ধরনের reply চাও)"
            required
            hint="তোমার উদ্দেশ্য অনুযায়ী select করো"
          >
            <select
              name="replyType"
              value={replyData.replyType}
              onChange={handleReplyChange}
              className={inputClass}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            >
              <option value="thank_you_followup">🙏 Thank You + Follow-up Question</option>
              <option value="requesting_meeting">📅 Requesting Meeting/Call</option>
              <option value="asking_advice">💡 Asking for Specific Advice</option>
              <option value="sharing_update">📈 Sharing Update/Progress</option>
              <option value="expressing_interest">✨ Expressing Interest in Opportunity</option>
              <option value="requesting_feedback">📝 Requesting Feedback on Work</option>
            </select>
          </FormInput>

          {/* Reply Type Info */}
          <div
            className="px-4 py-3 rounded-xl"
            style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
          >
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--primary)' }}>
              {replyTypeLabels[replyData.replyType]}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {replyTypeDescriptions[replyData.replyType]}
            </p>
          </div>

          <FormInput
            label="Additional Context (অতিরিক্ত তথ্য)"
            hint="GitHub link, portfolio, বা specific questions যোগ করতে পারো"
          >
            <textarea
              name="context"
              value={replyData.context}
              onChange={handleReplyChange}
              rows="3"
              className={inputClass}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder={`যেমন: \n- GitHub: https://github.com/username\n- Portfolio: https://myportfolio.com\n- Specific questions you want to ask`}
              onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </FormInput>

          {/* Generate Button */}
          <button
            onClick={generateReply}
            disabled={loading || !isFormValid}
            className="w-full font-semibold py-3.5 rounded-full transition-all text-base flex items-center justify-center gap-2"
            style={{
              background: isFormValid && !loading ? 'var(--primary)' : undefined,
              backgroundColor: !isFormValid || loading ? '#94b8d8' : undefined,
              color: '#fff',
              cursor: loading || !isFormValid ? 'not-allowed' : 'pointer',
              boxShadow: isFormValid && !loading ? 'var(--shadow-md)' : 'none',
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                AI Reply তৈরি করছে...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Reply
              </>
            )}
          </button>
        </div>
      </section>

      {/* Right Column - Output */}
      <div
        className="rounded-2xl p-5 lg:p-6 sticky top-6 h-fit"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: 'var(--primary)' }} aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
          Generated Replies
        </h2>

        {error && (
          <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--error-light)', border: '1px solid #f5c6c6' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--error)' }}>Error</h3>
                <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                style={{ background: 'var(--error)', color: '#fff' }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!replyMessages && !loading && !error && (
          <div className="text-center py-14" style={{ color: 'var(--text-muted)' }}>
            <div className="text-5xl mb-4">💬</div>
            <p className="text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              এখনো reply তৈরি হয়নি
            </p>
            <p className="text-sm mb-5">
              Received message এবং your name দাও, তারপর Generate Reply click করো
            </p>
            <div
              className="px-4 py-3 rounded-xl text-left"
              style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <strong>Example:</strong> তোমার boss বা HR যদি advice দিয়ে reply করে,
                সেটা এখানে paste করো এবং professional reply পাবে! 🎯
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-14">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
              style={{ background: 'var(--primary-light)' }}
            >
              <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none" aria-label="Loading" style={{ color: 'var(--primary)' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>AI reply তৈরি করছে...</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Professional এবং personalized reply লিখছে...
            </p>
          </div>
        )}

        {replyMessages && (
          <div className="space-y-4">
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: 'var(--success-light)', border: '1px solid #b8dfc8' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: 'var(--success)' }} aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>
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

            <div
              className="px-4 py-3 rounded-xl"
              style={{ background: 'var(--warning-light)', border: '1px solid #fde8b1' }}
            >
              <p className="text-xs flex items-start gap-2" style={{ color: 'var(--warning)' }}>
                <span className="text-base shrink-0">💡</span>
                <span>
                  <strong>Pro Tip:</strong> Reply পাঠানোর আগে একবার পড়ে নিন এবং
                  নিজের মতো করে customize করুন। Personal touch যোগ করলে আরো ভালো!
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
