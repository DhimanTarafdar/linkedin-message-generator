'use client';

import { useState } from 'react';
import MessageCard from './MessageCard';
import { buildConnectionRequestPrompt, buildDirectMessagePrompt } from '@/utils/promptBuilder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

  const labelClass = 'block text-sm font-semibold text-foreground mb-1.5';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Input */}
      <div className="space-y-6">
        {/* Message Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <span className="text-2xl">📨</span>
              Message Type নির্বাচন করুন
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setMessageType('connection_request')}
                className={`p-5 rounded-xl border-2 transition-all text-left ${
                  messageType === 'connection_request'
                    ? 'border-[var(--light-green)] bg-[var(--light-green)]/10 shadow-md'
                    : 'border-border hover:border-[var(--light-green)]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🤝</div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1">Connection Request Note</h3>
                    <p className="text-sm text-muted-foreground">প্রথম connection পাঠানোর সময় (300 chars limit)</p>
                    <div className="mt-2 text-xs inline-block px-3 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--light-green)', color: 'white' }}>
                      50-60 words max
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMessageType('direct_message')}
                className={`p-5 rounded-xl border-2 transition-all text-left ${
                  messageType === 'direct_message'
                    ? 'border-[var(--light-green)] bg-[var(--light-green)]/10 shadow-md'
                    : 'border-border hover:border-[var(--light-green)]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💬</div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1">Direct Message</h3>
                    <p className="text-sm text-muted-foreground">Already connected হলে concise message পাঠান</p>
                    <div className="mt-2 text-xs inline-block px-3 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--light-green)', color: 'white' }}>
                      80-150 words
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recipient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3">
              <span className="text-2xl">👤</span>
              যাকে Message পাঠাবেন
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-5 bg-muted p-3 rounded-lg border-l-4" style={{ borderColor: 'var(--light-green)' }}>
              💡 LinkedIn profile থেকে এই তথ্যগুলো দেখে নিয়ে এখানে লিখুন
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Name (নাম) *</label>
                <Input
                  type="text"
                  name="name"
                  value={recipientData.name}
                  onChange={handleRecipientChange}
                  placeholder="e.g., Sarah Ahmed"
                />
              </div>

              <div>
                <label className={labelClass}>Job Title (পদবি) *</label>
                <Input
                  type="text"
                  name="jobTitle"
                  value={recipientData.jobTitle}
                  onChange={handleRecipientChange}
                  placeholder="e.g., Senior Product Manager"
                />
              </div>

              <div>
                <label className={labelClass}>Company (কোম্পানি) *</label>
                <Input
                  type="text"
                  name="company"
                  value={recipientData.company}
                  onChange={handleRecipientChange}
                  placeholder="e.g., Google, Microsoft, Startup Name"
                />
              </div>

              <div>
                <label className={labelClass}>Key Skills/Expertise (দক্ষতা)</label>
                <Input
                  type="text"
                  name="skills"
                  value={recipientData.skills}
                  onChange={handleRecipientChange}
                  placeholder="e.g., AI/ML, Product Strategy"
                />
              </div>

              <div>
                <label className={labelClass}>Recent Activity/Posts (সাম্প্রতিক পোস্ট)</label>
                <Textarea
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
            <CardTitle className="text-xl flex items-center gap-3">
              <span className="text-2xl">🙋‍♂️</span>
              আপনার তথ্য
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-5 bg-muted p-3 rounded-lg border-l-4" style={{ borderColor: 'var(--light-green)' }}>
              💡 আপনার সম্পর্কে এবং কেন message পাঠাচ্ছেন সেটা বলুন
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Your Name (আপনার নাম) *</label>
                <Input
                  type="text"
                  name="name"
                  value={senderData.name}
                  onChange={handleSenderChange}
                  placeholder="e.g., Rakib Hassan"
                />
              </div>

              <div>
                <label className={labelClass}>Your Job Title (আপনার পদবি) *</label>
                <Input
                  type="text"
                  name="jobTitle"
                  value={senderData.jobTitle}
                  onChange={handleSenderChange}
                  placeholder="e.g., Software Engineer, Student"
                />
              </div>

              <div>
                <label className={labelClass}>Your Company (আপনার কোম্পানি) *</label>
                <Input
                  type="text"
                  name="company"
                  value={senderData.company}
                  onChange={handleSenderChange}
                  placeholder="e.g., Tech Startup, University Name"
                />
              </div>

              <div>
                <label className={labelClass}>Your Background (আপনার পরিচয়) *</label>
                <Textarea
                  name="background"
                  value={senderData.background}
                  onChange={handleSenderChange}
                  rows={3}
                  placeholder="e.g., 3 years experience in AI/ML, passionate about product development..."
                />
              </div>

              <div>
                <label className={labelClass}>Purpose (উদ্দেশ্য) *</label>
                <select
                  name="purpose"
                  value={senderData.purpose}
                  onChange={handleSenderChange}
                  className="border-input dark:bg-input/30 h-10 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-foreground"
                >
                  <option value="collaboration">🤝 Collaboration খুঁজছি</option>
                  <option value="job_opportunity">💼 Job Opportunity</option>
                  <option value="mentorship">🎓 Mentorship চাইছি</option>
                  <option value="project_partnership">🚀 Project Partnership</option>
                  <option value="knowledge_exchange">📚 Knowledge Exchange</option>
                  <option value="business_proposal">💡 Business Proposal</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Specific Interest (নির্দিষ্ট কারণ)</label>
                <Input
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
        <button
          onClick={generateMessages}
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
              AI Message তৈরি করছে...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <span className="text-2xl mr-3">⚡</span>
              {messageType === 'connection_request' ? 'Connection Request Note তৈরি করুন' : 'Direct Message তৈরি করুন'}
            </span>
          )}
        </button>
      </div>

      {/* Right Column - Output */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8 sticky top-6 h-fit">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <span className="text-3xl">✨</span>
          Generated Messages
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

        {!messages && !loading && !error && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-7xl mb-4">📝</div>
            <p className="text-xl font-medium mb-3 text-foreground">এখনো message তৈরি হয়নি</p>
            <p className="text-sm mb-6">উপরের সব required (*) fields পূরণ করুন এবং Generate button এ click করুন</p>
            <div className="bg-muted p-4 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Tips:</strong> যত বেশি তথ্য দেবেন, তত ভালো personalized message পাবেন! 🎯
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-4 mb-6" style={{ borderColor: 'var(--light-green)' }}></div>
            <p className="text-foreground font-bold text-lg mb-2">AI message তৈরি করছে...</p>
            <p className="text-sm text-muted-foreground">
              {messageType === 'connection_request'
                ? 'সংক্ষিপ্ত এবং professional connection note লিখছে...'
                : 'Concise এবং professional message তৈরি করছে...'}
            </p>
          </div>
        )}

        {messages && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--light-green)10', borderColor: 'var(--light-green)30' }}>
              <p className="text-sm text-foreground font-medium flex items-center gap-2">
                <span className="text-2xl">✅</span>
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

            <div className="bg-muted border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <span>
                  <strong className="text-foreground">Pro Tip:</strong> Message copy করার আগে একবার পড়ে নিন এবং প্রয়োজনে নিজের মতো করে edit করে নিন।
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
