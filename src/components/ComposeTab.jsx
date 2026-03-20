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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Input */}
      <div className="space-y-6">
        {/* Message Type Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">📨</span>
            Message Type নির্বাচন করুন
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setMessageType('connection_request')}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${messageType === 'connection_request'
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
                }`}
            >
              <div className="flex items-start">
                <div className="text-4xl mr-4">🤝</div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Connection Request Note</h3>
                  <p className="text-sm text-gray-600">প্রথম connection পাঠানোর সময় (300 chars limit)</p>
                  <div className="mt-2 text-xs bg-blue-100 text-blue-700 inline-block px-3 py-1 rounded-full">
                    50-60 words max
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMessageType('direct_message')}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${messageType === 'direct_message'
                  ? 'border-purple-600 bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300'
                }`}
            >
              <div className="flex items-start">
                <div className="text-4xl mr-4">💬</div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">Direct Message</h3>
                  <p className="text-sm text-gray-600">Already connected হলে concise message পাঠান</p>
                  <div className="mt-2 text-xs bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full">
                    80-150 words
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recipient Information */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">👤</span>
            যাকে Message পাঠাবেন
          </h2>
          <p className="text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
            💡 LinkedIn profile থেকে এই তথ্যগুলো দেখে নিয়ে এখানে লিখুন
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name (নাম) *</label>
              <input
                type="text"
                name="name"
                value={recipientData.name}
                onChange={handleRecipientChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="e.g., Sarah Ahmed"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Job Title (পদবি) *</label>
              <input
                type="text"
                name="jobTitle"
                value={recipientData.jobTitle}
                onChange={handleRecipientChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="e.g., Senior Product Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Company (কোম্পানি) *</label>
              <input
                type="text"
                name="company"
                value={recipientData.company}
                onChange={handleRecipientChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="e.g., Google, Microsoft, Startup Name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Key Skills/Expertise (দক্ষতা)</label>
              <input
                type="text"
                name="skills"
                value={recipientData.skills}
                onChange={handleRecipientChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="e.g., AI/ML, Product Strategy"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Recent Activity/Posts (সাম্প্রতিক পোস্ট)</label>
              <textarea
                name="recentActivity"
                value={recipientData.recentActivity}
                onChange={handleRecipientChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="e.g., সম্প্রতি AI-powered feature নিয়ে post করেছেন..."
              />
            </div>
          </div>
        </div>

        {/* Sender Information */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-3xl mr-3">🙋‍♂️</span>
            আপনার তথ্য
          </h2>
          <p className="text-sm text-gray-600 mb-6 bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
            💡 আপনার সম্পর্কে এবং কেন message পাঠাচ্ছেন সেটা বলুন
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Name (আপনার নাম) *</label>
              <input
                type="text"
                name="name"
                value={senderData.name}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                placeholder="e.g., Rakib Hassan"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Job Title (আপনার পদবি) *</label>
              <input
                type="text"
                name="jobTitle"
                value={senderData.jobTitle}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                placeholder="e.g., Software Engineer, Student"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Company (আপনার কোম্পানি) *</label>
              <input
                type="text"
                name="company"
                value={senderData.company}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                placeholder="e.g., Tech Startup, University Name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Background (আপনার পরিচয়) *</label>
              <textarea
                name="background"
                value={senderData.background}
                onChange={handleSenderChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                placeholder="e.g., 3 years experience in AI/ML, passionate about product development..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Purpose (উদ্দেশ্য) *</label>
              <select
                name="purpose"
                value={senderData.purpose}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
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
              <label className="block text-sm font-bold text-gray-700 mb-2">Specific Interest (নির্দিষ্ট কারণ)</label>
              <input
                type="text"
                name="specificInterest"
                value={senderData.specificInterest}
                onChange={handleSenderChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                placeholder="e.g., তাদের AI project সম্পর্কে জানতে চাই"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateMessages}
          disabled={loading || !isFormValid}
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-5 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <span className="flex items-center justify-center text-lg">
              <span className="text-2xl mr-3">⚡</span>
              {messageType === 'connection_request' ? 'Connection Request Note তৈরি করুন' : 'Direct Message তৈরি করুন'}
            </span>
          )}
        </button>
      </div>

      {/* Right Column - Output */}
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 sticky top-6 h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">✨</span>
          Generated Messages
        </h2>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error!</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        )}

        {!messages && !loading && !error && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-7xl mb-4">📝</div>
            <p className="text-xl font-medium mb-3">এখনো message তৈরি হয়নি</p>
            <p className="text-sm mb-6">উপরের সব required (*) fields পূরণ করুন এবং Generate button এ click করুন</p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>Tips:</strong> যত বেশি তথ্য দেবেন, তত ভালো personalized message পাবেন! 🎯
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mb-6"></div>
            <p className="text-gray-700 font-bold text-lg mb-2">AI message তৈরি করছে...</p>
            <p className="text-sm text-gray-500">
              {messageType === 'connection_request'
                ? 'সংক্ষিপ্ত এবং professional connection note লিখছে...'
                : 'Concise এবং professional message তৈরি করছে...'}
            </p>
          </div>
        )}

        {messages && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border-2 border-green-200">
              <p className="text-sm text-gray-700 font-medium flex items-center">
                <span className="text-2xl mr-2">✅</span>
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

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 flex items-start">
                <span className="text-2xl mr-3">💡</span>
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