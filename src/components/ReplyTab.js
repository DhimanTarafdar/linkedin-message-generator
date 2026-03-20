'use client';

import { useState } from 'react';
import MessageCard from './MessageCard';
import { buildReplyPrompt } from '@/utils/promptBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const replyTypeDescriptions = {
    thank_you_followup: 'তাদের advice এর জন্য ধন্যবাদ দিয়ে একটা thoughtful follow-up question করবে',
    requesting_meeting: 'তাদের সাথে একটা meeting/call request করবে',
    asking_advice: 'Specific advice চাইবে কোনো বিষয়ে',
    sharing_update: 'তোমার progress/update share করবে',
    expressing_interest: 'কোনো opportunity তে interest দেখাবে',
    requesting_feedback: 'তোমার work এ feedback চাইবে',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">↩️ Reply to Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-5 bg-secondary/50 p-3 rounded-lg border-l-4 border-light-green">
            💡 তুমি যে message পেয়েছো সেটা paste করো এবং reply type select করো
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="yourName">Your Name (তোমার নাম) *</Label>
              <Input
                id="yourName"
                type="text"
                name="yourName"
                value={replyData.yourName}
                onChange={handleReplyChange}
                placeholder="e.g., Dhiman Tarafdar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receivedMessage">Received Message (যে message পেয়েছো) *</Label>
              <Textarea
                id="receivedMessage"
                name="receivedMessage"
                value={replyData.receivedMessage}
                onChange={handleReplyChange}
                rows={8}
                placeholder={`তুমি যে message receive করেছো সেটা এখানে paste করো...

Example:
Hi Dhiman,
It's great that you're already exploring PyTorch. At this stage, I'd recommend focusing on building a few solid end-to-end projects rather than just learning theory...`}
              />
              <p className="text-xs text-muted-foreground">
                LinkedIn, Email বা যেকোনো platform এর message এখানে paste করো
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="replyType">Reply Type (কি ধরনের reply চাও) *</Label>
              <select
                id="replyType"
                name="replyType"
                value={replyData.replyType}
                onChange={handleReplyChange}
                className="border-input dark:bg-input/30 h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                <option value="thank_you_followup">🙏 Thank You + Follow-up Question</option>
                <option value="requesting_meeting">📅 Requesting Meeting/Call</option>
                <option value="asking_advice">💡 Asking for Specific Advice</option>
                <option value="sharing_update">📈 Sharing Update/Progress</option>
                <option value="expressing_interest">✨ Expressing Interest in Opportunity</option>
                <option value="requesting_feedback">📝 Requesting Feedback on Work</option>
              </select>
              <p className="text-xs text-muted-foreground">তোমার উদ্দেশ্য অনুযায়ী select করো</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Additional Context (অতিরিক্ত তথ্য - optional)</Label>
              <Textarea
                id="context"
                name="context"
                value={replyData.context}
                onChange={handleReplyChange}
                rows={3}
                placeholder={`যেমন: 
- GitHub: https://github.com/username
- Portfolio: https://myportfolio.com
- Specific questions you want to ask
- Any additional information`}
              />
              <p className="text-xs text-muted-foreground">
                GitHub link, portfolio, বা specific questions যোগ করতে পারো
              </p>
            </div>

            {/* Reply Type Info Box */}
            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">
                {replyTypeDescriptions[replyData.replyType]}
              </p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateReply}
              disabled={loading || !isFormValid}
              variant="light-green"
              size="lg"
              className="w-full py-6 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  AI Reply তৈরি করছে...
                </>
              ) : (
                <>
                  <Zap className="size-5" />
                  Generate Reply
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right Column - Output */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 lg:p-8 sticky top-28 h-fit">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
          ✨ Generated Replies
        </h2>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="font-semibold text-destructive mb-2">Error!</h3>
            <p className="text-destructive/80 text-sm">{error}</p>
            <Button
              onClick={() => setError(null)}
              variant="destructive"
              size="sm"
              className="mt-4"
            >
              Close
            </Button>
          </div>
        )}

        {!replyMessages && !loading && !error && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium mb-3">এখনো reply তৈরি হয়নি</p>
            <p className="text-sm mb-6">
              Received message এবং your name দাও, তারপর Generate Reply click করো
            </p>
            <div className="bg-secondary/50 p-4 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Example:</strong> তোমার boss বা HR যদি advice দিয়ে reply করে,
                সেটা এখানে paste করো এবং professional reply পাবে! 🎯
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <Loader2 className="size-16 animate-spin text-light-green mx-auto mb-6" />
            <p className="font-semibold text-lg mb-2">AI reply তৈরি করছে...</p>
            <p className="text-sm text-muted-foreground">
              Professional এবং personalized reply লিখছে...
            </p>
          </div>
        )}

        {replyMessages && (
          <div className="space-y-6">
            <div className="bg-light-green/10 p-4 rounded-xl border border-light-green/30">
              <p className="text-sm font-medium flex items-center gap-2">
                <span>✅</span>
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

            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground flex items-start gap-3">
                <span>💡</span>
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
