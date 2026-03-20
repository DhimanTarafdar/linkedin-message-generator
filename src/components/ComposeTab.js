'use client';

import { useState } from 'react';
import MessageCard from './MessageCard';
import { buildConnectionRequestPrompt, buildDirectMessagePrompt } from '@/utils/promptBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Handshake, MessageSquare, Loader2, Zap, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ComposeTab() {
  const [messageType, setMessageType] = useState('connection_request');
  const [recipientData, setRecipientData] = useState({
    name: '', jobTitle: '', company: '', skills: '',
    recentActivity: '', mutualConnections: '', education: ''
  });
  const [senderData, setSenderData] = useState({
    name: '', jobTitle: '', company: '', background: '',
    purpose: 'collaboration', specificInterest: ''
  });
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecipientChange = (e) => {
    setRecipientData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSenderChange = (e) => {
    setSenderData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateMessages = async () => {
    setLoading(true);
    setError(null);
    setMessages(null);

    try {
      const isConnectionRequest = messageType === 'connection_request';
      const prompt = isConnectionRequest
        ? buildConnectionRequestPrompt(recipientData, senderData)
        : buildDirectMessagePrompt(recipientData, senderData);

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
        setMessages(result.messages);
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

  const isFormValid = recipientData.name && recipientData.jobTitle &&
    recipientData.company && senderData.name && senderData.jobTitle &&
    senderData.company && senderData.background;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Input */}
      <div className="space-y-6">
        {/* Message Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <FileText className="size-5 text-light-green" />
              Message Type নির্বাচন করুন
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setMessageType('connection_request')}
                className={cn(
                  'p-5 rounded-xl border-2 transition-all text-left hover:scale-[1.01]',
                  messageType === 'connection_request'
                    ? 'border-light-green bg-light-green/5 shadow-sm'
                    : 'border-border hover:border-light-green/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <Handshake className="size-7 text-light-green mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Connection Request Note</h3>
                    <p className="text-sm text-muted-foreground">প্রথম connection পাঠানোর সময় (300 chars limit)</p>
                    <span className="mt-2 inline-block text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      50-60 words max
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMessageType('direct_message')}
                className={cn(
                  'p-5 rounded-xl border-2 transition-all text-left hover:scale-[1.01]',
                  messageType === 'direct_message'
                    ? 'border-light-green bg-light-green/5 shadow-sm'
                    : 'border-border hover:border-light-green/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="size-7 text-light-green mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Direct Message</h3>
                    <p className="text-sm text-muted-foreground">Already connected হলে concise message পাঠান</p>
                    <span className="mt-2 inline-block text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                      80-150 words
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recipient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">👤 যাকে Message পাঠাবেন</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-5 bg-secondary/50 p-3 rounded-lg border-l-4 border-light-green">
              💡 LinkedIn profile থেকে এই তথ্যগুলো দেখে নিয়ে এখানে লিখুন
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="r-name">Name (নাম) *</Label>
                <Input
                  id="r-name"
                  type="text"
                  name="name"
                  value={recipientData.name}
                  onChange={handleRecipientChange}
                  placeholder="e.g., Sarah Ahmed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-jobTitle">Job Title (পদবি) *</Label>
                <Input
                  id="r-jobTitle"
                  type="text"
                  name="jobTitle"
                  value={recipientData.jobTitle}
                  onChange={handleRecipientChange}
                  placeholder="e.g., Senior Product Manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-company">Company (কোম্পানি) *</Label>
                <Input
                  id="r-company"
                  type="text"
                  name="company"
                  value={recipientData.company}
                  onChange={handleRecipientChange}
                  placeholder="e.g., Google, Microsoft, Startup Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-skills">Key Skills/Expertise (দক্ষতা)</Label>
                <Input
                  id="r-skills"
                  type="text"
                  name="skills"
                  value={recipientData.skills}
                  onChange={handleRecipientChange}
                  placeholder="e.g., AI/ML, Product Strategy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="r-recentActivity">Recent Activity/Posts (সাম্প্রতিক পোস্ট)</Label>
                <Textarea
                  id="r-recentActivity"
                  name="recentActivity"
                  value={recipientData.recentActivity}
                  onChange={handleRecipientChange}
                  rows={3}
                  placeholder="e.g., সম্প্রতি AI-powered feature নিয়ে post করেছেন..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sender Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🙋‍♂️ আপনার তথ্য</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-5 bg-secondary/50 p-3 rounded-lg border-l-4 border-light-green">
              💡 আপনার সম্পর্কে এবং কেন message পাঠাচ্ছেন সেটা বলুন
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="s-name">Your Name (আপনার নাম) *</Label>
                <Input
                  id="s-name"
                  type="text"
                  name="name"
                  value={senderData.name}
                  onChange={handleSenderChange}
                  placeholder="e.g., Rakib Hassan"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s-jobTitle">Your Job Title (আপনার পদবি) *</Label>
                <Input
                  id="s-jobTitle"
                  type="text"
                  name="jobTitle"
                  value={senderData.jobTitle}
                  onChange={handleSenderChange}
                  placeholder="e.g., Software Engineer, Student"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s-company">Your Company (আপনার কোম্পানি) *</Label>
                <Input
                  id="s-company"
                  type="text"
                  name="company"
                  value={senderData.company}
                  onChange={handleSenderChange}
                  placeholder="e.g., Tech Startup, University Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s-background">Your Background (আপনার পরিচয়) *</Label>
                <Textarea
                  id="s-background"
                  name="background"
                  value={senderData.background}
                  onChange={handleSenderChange}
                  rows={3}
                  placeholder="e.g., 3 years experience in AI/ML, passionate about product development..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="s-purpose">Purpose (উদ্দেশ্য) *</Label>
                <select
                  id="s-purpose"
                  name="purpose"
                  value={senderData.purpose}
                  onChange={handleSenderChange}
                  className="border-input dark:bg-input/30 h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="collaboration">🤝 Collaboration খুঁজছি</option>
                  <option value="job_opportunity">💼 Job Opportunity</option>
                  <option value="mentorship">🎓 Mentorship চাইছি</option>
                  <option value="project_partnership">🚀 Project Partnership</option>
                  <option value="knowledge_exchange">📚 Knowledge Exchange</option>
                  <option value="business_proposal">💡 Business Proposal</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="s-specificInterest">Specific Interest (নির্দিষ্ট কারণ)</Label>
                <Input
                  id="s-specificInterest"
                  type="text"
                  name="specificInterest"
                  value={senderData.specificInterest}
                  onChange={handleSenderChange}
                  placeholder="e.g., তাদের AI project সম্পর্কে জানতে চাই"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Button
          onClick={generateMessages}
          disabled={loading || !isFormValid}
          variant="light-green"
          size="lg"
          className="w-full py-6 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              AI Message তৈরি করছে...
            </>
          ) : (
            <>
              <Zap className="size-5" />
              {messageType === 'connection_request' ? 'Connection Request Note তৈরি করুন' : 'Direct Message তৈরি করুন'}
            </>
          )}
        </Button>
      </div>

      {/* Right Column - Output */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 lg:p-8 sticky top-28 h-fit">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
          ✨ Generated Messages
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

        {!messages && !loading && !error && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-lg font-medium mb-3">এখনো message তৈরি হয়নি</p>
            <p className="text-sm mb-6">উপরের সব required (*) fields পূরণ করুন এবং Generate button এ click করুন</p>
            <div className="bg-secondary/50 p-4 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Tips:</strong> যত বেশি তথ্য দেবেন, তত ভালো personalized message পাবেন! 🎯
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <Loader2 className="size-16 animate-spin text-light-green mx-auto mb-6" />
            <p className="font-semibold text-lg mb-2">AI message তৈরি করছে...</p>
            <p className="text-sm text-muted-foreground">
              {messageType === 'connection_request'
                ? 'সংক্ষিপ্ত এবং professional connection note লিখছে...'
                : 'Concise এবং professional message তৈরি করছে...'}
            </p>
          </div>
        )}

        {messages && (
          <div className="space-y-6">
            <div className="bg-light-green/10 p-4 rounded-xl border border-light-green/30">
              <p className="text-sm font-medium flex items-center gap-2">
                <span>✅</span>
                {messageType === 'connection_request'
                  ? `${messages.length}টি Connection Request Note তৈরি হয়েছে!`
                  : `${messages.length}টি Direct Message তৈরি হয়েছে!`}
              </p>
            </div>

            {messages.map((msg, index) => (
              <MessageCard
                key={index}
                msg={msg}
                index={index}
                messageType={messageType}
              />
            ))}

            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground flex items-start gap-3">
                <span>💡</span>
                <span>
                  <strong>Pro Tip:</strong> Message copy করার আগে একবার পড়ে নিন এবং প্রয়োজনে নিজের মতো করে edit করে নিন।
                  {messageType === 'connection_request'
                    ? ' Connection Request এ maximum 300 characters allowed!'
                    : ' সংক্ষিপ্ত message বেশি কার্যকর!'}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
