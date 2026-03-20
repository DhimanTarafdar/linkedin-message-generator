'use client';

import { useState } from 'react';
import MessageCard from './MessageCard';
import { FormInput, inputClass, inputStyle } from './FormField';
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
      <div className="space-y-4">

        {/* Message Type Selection */}
        <section
          className="rounded-2xl p-5"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: 'var(--primary)' }} aria-hidden="true">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            Message Type নির্বাচন করুন
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setMessageType('connection_request')}
              className="p-4 rounded-xl text-left transition-all"
              style={
                messageType === 'connection_request'
                  ? { border: '2px solid var(--primary)', background: 'var(--primary-light)' }
                  : { border: '1.5px solid var(--border)', background: 'var(--card-bg)' }
              }
            >
              <div className="text-2xl mb-2">🤝</div>
              <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                Connection Request Note
              </h3>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                প্রথম connection পাঠানোর সময় (300 chars limit)
              </p>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
              >
                50-60 words max
              </span>
            </button>

            <button
              onClick={() => setMessageType('direct_message')}
              className="p-4 rounded-xl text-left transition-all"
              style={
                messageType === 'direct_message'
                  ? { border: '2px solid var(--primary)', background: 'var(--primary-light)' }
                  : { border: '1.5px solid var(--border)', background: 'var(--card-bg)' }
              }
            >
              <div className="text-2xl mb-2">💬</div>
              <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                Direct Message
              </h3>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                Already connected হলে concise message পাঠান
              </p>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
              >
                80-150 words
              </span>
            </button>
          </div>
        </section>

        {/* Recipient Information */}
        <section
          className="rounded-2xl p-5"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <h2 className="text-base font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: 'var(--primary)' }} aria-hidden="true">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
            যাকে Message পাঠাবেন
          </h2>
          <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ color: 'var(--text-secondary)', background: 'var(--primary-light)' }}>
            💡 LinkedIn profile থেকে এই তথ্যগুলো দেখে নিয়ে এখানে লিখুন
          </p>

          <div className="space-y-3.5">
            <FormInput label="Name (নাম)" required>
              <input
                type="text"
                name="name"
                value={recipientData.name}
                onChange={handleRecipientChange}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g., Sarah Ahmed"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>

            <FormInput label="Job Title (পদবি)" required>
              <input
                type="text"
                name="jobTitle"
                value={recipientData.jobTitle}
                onChange={handleRecipientChange}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g., Senior Product Manager"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>

            <FormInput label="Company (কোম্পানি)" required>
              <input
                type="text"
                name="company"
                value={recipientData.company}
                onChange={handleRecipientChange}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g., Google, Microsoft, Startup Name"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>

            <FormInput label="Key Skills/Expertise (দক্ষতা)">
              <input
                type="text"
                name="skills"
                value={recipientData.skills}
                onChange={handleRecipientChange}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g., AI/ML, Product Strategy"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>

            <FormInput label="Recent Activity/Posts (সাম্প্রতিক পোস্ট)">
              <textarea
                name="recentActivity"
                value={recipientData.recentActivity}
                onChange={handleRecipientChange}
                rows="3"
                className={inputClass}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="e.g., সম্প্রতি AI-powered feature নিয়ে post করেছেন..."
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>
          </div>
        </section>

        {/* Sender Information */}
        <section
          className="rounded-2xl p-5"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <h2 className="text-base font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: 'var(--primary)' }} aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            আপনার তথ্য
          </h2>
          <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ color: 'var(--text-secondary)', background: '#f0faf4' }}>
            💡 আপনার সম্পর্কে এবং কেন message পাঠাচ্ছেন সেটা বলুন
          </p>

          <div className="space-y-3.5">
            <FormInput label="Your Name (আপনার নাম)" required>
              <input
                type="text"
                name="name"
                value={senderData.name}
                onChange={handleSenderChange}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g., Rakib Hassan"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>

            <FormInput label="Your Job Title (আপনার পদবি)" required>
              <input
                type="text"
                name="jobTitle"
                value={senderData.jobTitle}
                onChange={handleSenderChange}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g., Software Engineer, Student"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>

            <FormInput label="Your Company (আপনার কোম্পানি)" required>
              <input
                type="text"
                name="company"
                value={senderData.company}
                onChange={handleSenderChange}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g., Tech Startup, University Name"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>

            <FormInput label="Your Background (আপনার পরিচয়)" required>
              <textarea
                name="background"
                value={senderData.background}
                onChange={handleSenderChange}
                rows="3"
                className={inputClass}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="e.g., 3 years experience in AI/ML, passionate about product development..."
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>

            <FormInput label="Purpose (উদ্দেশ্য)" required>
              <select
                name="purpose"
                value={senderData.purpose}
                onChange={handleSenderChange}
                className={inputClass}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="collaboration">🤝 Collaboration খুঁজছি</option>
                <option value="job_opportunity">💼 Job Opportunity</option>
                <option value="mentorship">🎓 Mentorship চাইছি</option>
                <option value="project_partnership">🚀 Project Partnership</option>
                <option value="knowledge_exchange">📚 Knowledge Exchange</option>
                <option value="business_proposal">💡 Business Proposal</option>
              </select>
            </FormInput>

            <FormInput label="Specific Interest (নির্দিষ্ট কারণ)">
              <input
                type="text"
                name="specificInterest"
                value={senderData.specificInterest}
                onChange={handleSenderChange}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g., তাদের AI project সম্পর্কে জানতে চাই"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(10,102,194,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </FormInput>
          </div>
        </section>

        {/* Generate Button */}
        <button
          onClick={generateMessages}
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
              AI Message তৈরি করছে...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {messageType === 'connection_request' ? 'Connection Request Note তৈরি করুন' : 'Direct Message তৈরি করুন'}
            </>
          )}
        </button>
      </div>

      {/* Right Column - Output */}
      <div
        className="rounded-2xl p-5 lg:p-6 sticky top-6 h-fit"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: 'var(--primary)' }} aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
          Generated Messages
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

        {!messages && !loading && !error && (
          <div className="text-center py-14" style={{ color: 'var(--text-muted)' }}>
            <div className="text-5xl mb-4">📝</div>
            <p className="text-base font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              এখনো message তৈরি হয়নি
            </p>
            <p className="text-sm mb-5">
              উপরের সব required (*) fields পূরণ করুন এবং Generate button এ click করুন
            </p>
            <div
              className="px-4 py-3 rounded-xl text-left"
              style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                <strong>Tips:</strong> যত বেশি তথ্য দেবেন, তত ভালো personalized message পাবেন! 🎯
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
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>AI message তৈরি করছে...</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {messageType === 'connection_request'
                ? 'সংক্ষিপ্ত এবং professional connection note লিখছে...'
                : 'Concise এবং professional message তৈরি করছে...'}
            </p>
          </div>
        )}

        {messages && (
          <div className="space-y-4">
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: 'var(--success-light)', border: '1px solid #b8dfc8' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: 'var(--success)', flexShrink: 0 }} aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>
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

            <div
              className="px-4 py-3 rounded-xl"
              style={{ background: 'var(--warning-light)', border: '1px solid #fde8b1' }}
            >
              <p className="text-xs flex items-start gap-2" style={{ color: 'var(--warning)' }}>
                <span className="text-base shrink-0">💡</span>
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
