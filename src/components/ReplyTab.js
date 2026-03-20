'use client';

import { useState } from 'react';
import MessageCard from './MessageCard';
import { buildReplyPrompt } from '@/utils/promptBuilder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*"messages"[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
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

  const labelClass = 'block text-sm font-semibold text-foreground mb-1.5';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-3">
            <span className="text-2xl">↩️</span>
            Reply to Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-5 bg-muted p-3 rounded-lg border-l-4" style={{ borderColor: 'var(--light-green)' }}>
            💡 তুমি যে message পেয়েছো সেটা paste করো এবং reply type select করো
          </p>

          <div className="space-y-4">
            <div>
              <label className={labelClass}>Your Name (তোমার নাম) *</label>
              <Input
                type="text"
                name="yourName"
                value={replyData.yourName}
                onChange={handleReplyChange}
                placeholder="e.g., Dhiman Tarafdar"
              />
            </div>

            <div>
              <label className={labelClass}>Received Message (যে message পেয়েছো) *</label>
              <Textarea
                name="receivedMessage"
                value={replyData.receivedMessage}
                onChange={handleReplyChange}
                rows={8}
                placeholder={`তুমি যে message receive করেছো সেটা এখানে paste করো...

Example:
Hi Dhiman,
It's great that you're already exploring PyTorch. At this stage, I'd recommend focusing on building a few solid end-to-end projects rather than just learning theory...`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                LinkedIn, Email বা যেকোনো platform এর message এখানে paste করো
              </p>
            </div>

            <div>
              <label className={labelClass}>Reply Type (কি ধরনের reply চাও) *</label>
              <select
                name="replyType"
                value={replyData.replyType}
                onChange={handleReplyChange}
                className="border-input dark:bg-input/30 h-10 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
              >
                <option value="thank_you_followup">🙏 Thank You + Follow-up Question</option>
                <option value="requesting_meeting">📅 Requesting Meeting/Call</option>
                <option value="asking_advice">💡 Asking for Specific Advice</option>
                <option value="sharing_update">📈 Sharing Update/Progress</option>
                <option value="expressing_interest">✨ Expressing Interest in Opportunity</option>
                <option value="requesting_feedback">📝 Requesting Feedback on Work</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                তোমার উদ্দেশ্য অনুযায়ী select করো
              </p>
            </div>

            <div>
              <label className={labelClass}>Additional Context (অতিরিক্ত তথ্য - optional)</label>
              <Textarea
                name="context"
                value={replyData.context}
                onChange={handleReplyChange}
                rows={3}
                placeholder={`যেমন: \n- GitHub: https://github.com/username\n- Portfolio: https://myportfolio.com\n- Specific questions you want to ask`}
              />
              <p className="text-xs text-muted-foreground mt-1">
                GitHub link, portfolio, বা specific questions যোগ করতে পারো
              </p>
            </div>

            {/* Reply Type Info Box */}
            <div className="bg-muted border border-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-foreground mb-1">
                {replyData.replyType === 'thank_you_followup' && '🙏 Thank You + Follow-up'}
                {replyData.replyType === 'requesting_meeting' && '📅 Requesting Meeting'}
                {replyData.replyType === 'asking_advice' && '💡 Asking Advice'}
                {replyData.replyType === 'sharing_update' && '📈 Sharing Update'}
                {replyData.replyType === 'expressing_interest' && '✨ Expressing Interest'}
                {replyData.replyType === 'requesting_feedback' && '📝 Requesting Feedback'}
              </h3>
              <p className="text-xs text-muted-foreground">
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
              className="w-full text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              style={{ backgroundColor: 'var(--light-green)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  AI Reply তৈরি করছে...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="text-2xl mr-3">⚡</span>
                  Generate Reply
                </span>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Right Column - Output */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 sticky top-6 h-fit">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <span className="text-3xl">✨</span>
          Generated Replies
        </h2>

        {error && (
          <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-destructive mb-2">Error!</h3>
            <p className="text-destructive/80 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 bg-destructive text-white px-4 py-2 rounded-lg hover:bg-destructive/90"
            >
              Close
            </button>
          </div>
        )}

        {!replyMessages && !loading && !error && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-7xl mb-4">💬</div>
            <p className="text-xl font-medium mb-3 text-foreground">এখনো reply তৈরি হয়নি</p>
            <p className="text-sm mb-6">
              Received message এবং your name দাও, তারপর Generate Reply click করো
            </p>
            <div className="bg-muted p-4 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Example:</strong> তোমার boss বা HR যদি advice দিয়ে reply করে,
                সেটা এখানে paste করো এবং professional reply পাবে! 🎯
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-4 mb-6" style={{ borderColor: 'var(--light-green)' }}></div>
            <p className="text-foreground font-bold text-lg mb-2">AI reply তৈরি করছে...</p>
            <p className="text-sm text-muted-foreground">
              Professional এবং personalized reply লিখছে...
            </p>
          </div>
        )}

        {replyMessages && (
          <div className="space-y-6">
            <div className="bg-muted border border-border p-4 rounded-xl">
              <p className="text-sm text-foreground font-medium flex items-center gap-2">
                <span className="text-2xl">✅</span>
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

            <div className="bg-muted border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <span>
                  <strong className="text-foreground">Pro Tip:</strong> Reply পাঠানোর আগে একবার পড়ে নিন এবং
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
