'use client';

import { useState } from 'react';
import MessageCard from './MessageCard';
import { buildConnectionRequestPrompt, buildDirectMessagePrompt } from '@/utils/promptBuilder';

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Left Column - Input */}
      <div className="space-y-5">
        {/* Message Type Selection */}
        <div className="li-card p-5">
          <h2 className="li-section-title">
            <span className="w-8 h-8 rounded-full bg-[#EAF0F9] flex items-center justify-center text-[#0A66C2] text-base">📨</span>
            Message Type নির্বাচন করুন
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setMessageType('connection_request')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                messageType === 'connection_request'
                  ? 'border-[#0A66C2] bg-[#EAF0F9]'
                  : 'border-[#E0E0E0] hover:border-[#0A66C2] hover:bg-[#EAF0F9]'
              }`}
            >
              <div className="text-2xl mb-2">🤝</div>
              <h3 className="text-sm font-semibold text-[#191919] mb-1">Connection Request Note</h3>
              <p className="text-xs text-[#666666] mb-2">প্রথম connection পাঠানোর সময়</p>
              <span className="text-xs bg-[#EAF0F9] text-[#0A66C2] px-2 py-0.5 rounded-full font-medium border border-[#0A66C2]/20">
                50-60 words max
              </span>
            </button>

            <button
              onClick={() => setMessageType('direct_message')}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                messageType === 'direct_message'
                  ? 'border-[#0A66C2] bg-[#EAF0F9]'
                  : 'border-[#E0E0E0] hover:border-[#0A66C2] hover:bg-[#EAF0F9]'
              }`}
            >
              <div className="text-2xl mb-2">💬</div>
              <h3 className="text-sm font-semibold text-[#191919] mb-1">Direct Message</h3>
              <p className="text-xs text-[#666666] mb-2">Already connected হলে message পাঠান</p>
              <span className="text-xs bg-[#EAF0F9] text-[#0A66C2] px-2 py-0.5 rounded-full font-medium border border-[#0A66C2]/20">
                80-150 words
              </span>
            </button>
          </div>
        </div>

        {/* Recipient Information */}
        <div className="li-card p-5">
          <h2 className="li-section-title">
            <span className="w-8 h-8 rounded-full bg-[#EAF0F9] flex items-center justify-center text-[#0A66C2] text-base">👤</span>
            যাকে Message পাঠাবেন
          </h2>
          <div className="li-info-banner">
            💡 LinkedIn profile থেকে এই তথ্যগুলো দেখে নিয়ে এখানে লিখুন
          </div>

          <div className="space-y-4">
            <div>
              <label className="li-label">Name (নাম) *</label>
              <input
                type="text"
                name="name"
                value={recipientData.name}
                onChange={handleRecipientChange}
                className="li-input"
                placeholder="e.g., Sarah Ahmed"
              />
            </div>

            <div>
              <label className="li-label">Job Title (পদবি) *</label>
              <input
                type="text"
                name="jobTitle"
                value={recipientData.jobTitle}
                onChange={handleRecipientChange}
                className="li-input"
                placeholder="e.g., Senior Product Manager"
              />
            </div>

            <div>
              <label className="li-label">Company (কোম্পানি) *</label>
              <input
                type="text"
                name="company"
                value={recipientData.company}
                onChange={handleRecipientChange}
                className="li-input"
                placeholder="e.g., Google, Microsoft, Startup Name"
              />
            </div>

            <div>
              <label className="li-label">Key Skills/Expertise (দক্ষতা)</label>
              <input
                type="text"
                name="skills"
                value={recipientData.skills}
                onChange={handleRecipientChange}
                className="li-input"
                placeholder="e.g., AI/ML, Product Strategy"
              />
            </div>

            <div>
              <label className="li-label">Recent Activity/Posts (সাম্প্রতিক পোস্ট)</label>
              <textarea
                name="recentActivity"
                value={recipientData.recentActivity}
                onChange={handleRecipientChange}
                rows="3"
                className="li-input resize-none"
                placeholder="e.g., সম্প্রতি AI-powered feature নিয়ে post করেছেন..."
              />
            </div>
          </div>
        </div>

        {/* Sender Information */}
        <div className="li-card p-5">
          <h2 className="li-section-title">
            <span className="w-8 h-8 rounded-full bg-[#EAF0F9] flex items-center justify-center text-[#0A66C2] text-base">🙋‍♂️</span>
            আপনার তথ্য
          </h2>
          <div className="li-info-banner li-info-banner--success">
            💡 আপনার সম্পর্কে এবং কেন message পাঠাচ্ছেন সেটা বলুন
          </div>

          <div className="space-y-4">
            <div>
              <label className="li-label">Your Name (আপনার নাম) *</label>
              <input
                type="text"
                name="name"
                value={senderData.name}
                onChange={handleSenderChange}
                className="li-input"
                placeholder="e.g., Rakib Hassan"
              />
            </div>

            <div>
              <label className="li-label">Your Job Title (আপনার পদবি) *</label>
              <input
                type="text"
                name="jobTitle"
                value={senderData.jobTitle}
                onChange={handleSenderChange}
                className="li-input"
                placeholder="e.g., Software Engineer, Student"
              />
            </div>

            <div>
              <label className="li-label">Your Company (আপনার কোম্পানি) *</label>
              <input
                type="text"
                name="company"
                value={senderData.company}
                onChange={handleSenderChange}
                className="li-input"
                placeholder="e.g., Tech Startup, University Name"
              />
            </div>

            <div>
              <label className="li-label">Your Background (আপনার পরিচয়) *</label>
              <textarea
                name="background"
                value={senderData.background}
                onChange={handleSenderChange}
                rows="3"
                className="li-input resize-none"
                placeholder="e.g., 3 years experience in AI/ML, passionate about product development..."
              />
            </div>

            <div>
              <label className="li-label">Purpose (উদ্দেশ্য) *</label>
              <select
                name="purpose"
                value={senderData.purpose}
                onChange={handleSenderChange}
                className="li-input"
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
              <label className="li-label">Specific Interest (নির্দিষ্ট কারণ)</label>
              <input
                type="text"
                name="specificInterest"
                value={senderData.specificInterest}
                onChange={handleSenderChange}
                className="li-input"
                placeholder="e.g., তাদের AI project সম্পর্কে জানতে চাই"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateMessages}
          disabled={loading || !isFormValid}
          className="li-btn-primary w-full py-4 text-base"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              AI Message তৈরি করছে...
            </>
          ) : (
            <>
              <span>⚡</span>
              {messageType === 'connection_request' ? 'Connection Request Note তৈরি করুন' : 'Direct Message তৈরি করুন'}
            </>
          )}
        </button>
      </div>

      {/* Right Column - Output */}
      <div className="li-card p-5 sticky top-6 h-fit">
        <h2 className="li-section-title">
          <span className="w-8 h-8 rounded-full bg-[#EAF0F9] flex items-center justify-center text-[#0A66C2] text-base">✨</span>
          Generated Messages
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

        {!messages && !loading && !error && (
          <div className="text-center py-14 text-[#666666]">
            <div className="text-6xl mb-3">📝</div>
            <p className="text-base font-medium mb-2 text-[#191919]">এখনো message তৈরি হয়নি</p>
            <p className="text-xs mb-5 max-w-xs mx-auto">
              উপরের সব required (*) fields পূরণ করুন এবং Generate button এ click করুন
            </p>
            <div className="bg-[#EAF0F9] rounded-lg p-4 border border-[#0A66C2]/20">
              <p className="text-xs text-[#0A66C2]">
                <strong>Tips:</strong> যত বেশি তথ্য দেবেন, তত ভালো personalized message পাবেন! 🎯
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-14">
            <div className="inline-block animate-spin rounded-full h-14 w-14 border-b-2 border-[#0A66C2] mb-5"></div>
            <p className="text-sm font-semibold text-[#191919] mb-1">AI message তৈরি করছে...</p>
            <p className="text-xs text-[#666666]">
              {messageType === 'connection_request'
                ? 'সংক্ষিপ্ত এবং professional connection note লিখছে...'
                : 'Concise এবং professional message তৈরি করছে...'}
            </p>
          </div>
        )}

        {messages && (
          <div className="space-y-5">
            <div className="bg-[#E8F5EF] rounded-lg p-3 border border-[#057642]/30 flex items-center gap-2">
              <span className="text-lg">✅</span>
              <p className="text-sm text-[#057642] font-medium">
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

            <div className="bg-[#FFF9F0] border border-[#915907]/30 rounded-lg p-4 flex items-start gap-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-xs text-[#666666]">
                <strong className="text-[#191919]">Pro Tip:</strong> Message copy করার আগে একবার পড়ে নিন এবং প্রয়োজনে নিজের মতো করে edit করে নিন।
                {messageType === 'connection_request'
                  ? ' Connection Request এ maximum 300 characters allowed!'
                  : ' সংক্ষিপ্ত message বেশি কার্যকর!'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}