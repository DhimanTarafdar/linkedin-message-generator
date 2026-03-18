import React, { useState } from 'react';

export default function LinkedInMessageGenerator() {
  const [activeTab, setActiveTab] = useState('compose');
  const [messageType, setMessageType] = useState('connection_request');
  
  // Compose Message State
  const [recipientData, setRecipientData] = useState({
    name: '', jobTitle: '', company: '', skills: '', recentActivity: '', mutualConnections: '', education: ''
  });
  const [senderData, setSenderData] = useState({
    name: '', jobTitle: '', company: '', background: '', purpose: 'collaboration', specificInterest: ''
  });
  
  // Reply Generator State
  const [replyData, setReplyData] = useState({
    receivedMessage: '', replyType: 'thank_you_followup', context: '', yourName: ''
  });
  
  const [messages, setMessages] = useState(null);
  const [replyMessages, setReplyMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyError, setReplyError] = useState(null);

  const handleRecipientChange = (e) => setRecipientData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSenderChange = (e) => setSenderData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleReplyChange = (e) => setReplyData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const generateReply = async () => {
    setReplyLoading(true);
    setReplyError(null);
    setReplyMessages(null);

    try {
      const replyTypes = {
        'thank_you_followup': 'Thank You + Follow-up Question',
        'requesting_meeting': 'Requesting a Meeting/Call',
        'asking_advice': 'Asking for Specific Advice',
        'sharing_update': 'Sharing an Update/Progress',
        'expressing_interest': 'Expressing Interest in Opportunity',
        'requesting_feedback': 'Requesting Feedback on Work'
      };

      const prompt = `Generate 3 REPLY MESSAGES (80-150 words each) to this LinkedIn message:

RECEIVED MESSAGE:
"${replyData.receivedMessage}"

REPLY TYPE: ${replyTypes[replyData.replyType]}
YOUR NAME: ${replyData.yourName}
CONTEXT: ${replyData.context || 'None'}

Requirements:
1. Short (80-100 words), Balanced (100-120 words), Detailed (120-150 words)
2. Professional, grateful, respectful of time
3. Proper formatting with \\n\\n between paragraphs
4. Reference their message specifically
5. Clear ask/next step
6. End with your name

EXAMPLE:
"Thank you again for your earlier guidance, it really helped me to get a clearer direction.

I wanted to ask for your advice regarding AI/ML internships. As a 3rd-year CSE student, I'm planning to apply soon and would appreciate suggestions on preparation.

Also, I've been working on projects on my GitHub. If you have a moment, I'd be grateful for feedback.

Thanks again for your support.

Best regards,
${replyData.yourName}"

Return JSON only:
{
  "messages": [
    {"version": "Short (80-100 words)", "text": "...", "wordCount": 90},
    {"version": "Balanced (100-120 words)", "text": "...", "wordCount": 110},
    {"version": "Detailed (120-150 words)", "text": "...", "wordCount": 135}
  ]
}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const responseText = data.content.filter(i => i.type === 'text').map(i => i.text).join('\n');
      const cleanText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const result = JSON.parse(cleanText);
      
      if (result.messages && Array.isArray(result.messages)) {
        setReplyMessages(result.messages);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setReplyError(err.message);
    } finally {
      setReplyLoading(false);
    }
  };

  const generateMessages = async () => {
    setLoading(true);
    setError(null);
    setMessages(null);

    try {
      const isConnectionRequest = messageType === 'connection_request';
      
      const prompt = isConnectionRequest 
        ? `Generate 3 CONNECTION REQUEST notes (30-60 words, single paragraph):

RECIPIENT: ${recipientData.name}, ${recipientData.jobTitle} at ${recipientData.company}
Skills: ${recipientData.skills || 'N/A'}
YOUR INFO: ${senderData.name}, ${senderData.jobTitle} at ${senderData.company}
Background: ${senderData.background}

Requirements:
- Ultra Short (30-40 words), Short (40-50 words), Standard (50-60 words)
- Single paragraph, no line breaks
- Start with "Hello [Name]" or "Hi [Name]"
- Professional, warm, specific reason to connect

Example: "Hello Mr. Joy, I'm Dhiman, a 3rd-year CSE student at HSTU focusing on ML. I'm highly impressed by your work in AI automation at Softvence. As an aspiring ML engineer, I'd be honored to connect and learn from your expertise."

Return JSON:
{
  "messages": [
    {"version": "Ultra Short (30-40 words)", "text": "...", "length": "~35 words", "wordCount": 35},
    {"version": "Short (40-50 words)", "text": "...", "length": "~45 words", "wordCount": 45},
    {"version": "Standard (50-60 words)", "text": "...", "length": "~55 words", "wordCount": 55}
  ]
}`
        : `Generate 3 DIRECT MESSAGES (80-150 words):

RECIPIENT: ${recipientData.name}, ${recipientData.jobTitle} at ${recipientData.company}
YOUR INFO: ${senderData.name}, ${senderData.background}
PURPOSE: ${senderData.purpose}

Requirements:
- Concise (80-100), Balanced (100-120), Detailed (120-150 words)
- Proper \\n\\n paragraph breaks
- Professional, respectful of time, clear ask

Return JSON:
{
  "messages": [
    {"version": "Concise (80-100 words)", "text": "...", "length": "~90 words", "wordCount": 90},
    {"version": "Balanced (100-120 words)", "text": "...", "length": "~110 words", "wordCount": 110},
    {"version": "Detailed (120-150 words)", "text": "...", "length": "~135 words", "wordCount": 135}
  ]
}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const responseText = data.content.filter(i => i.type === 'text').map(i => i.text).join('\n');
      const cleanText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      const result = JSON.parse(cleanText);
      
      if (result.messages && Array.isArray(result.messages)) {
        setMessages(result.messages);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text, index, isReply = false) => {
    navigator.clipboard.writeText(text).then(() => {
      const buttons = document.querySelectorAll(isReply ? '.reply-copy-btn' : '.copy-btn');
      const button = buttons[index];
      if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span class="text-lg mr-2">✅</span>Copied!';
        button.classList.add('bg-green-600');
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.classList.remove('bg-green-600');
        }, 2000);
      }
    }).catch(() => alert('Copy failed!'));
  };

  const getCharCount = (text) => text.length;
  const getWordCount = (text) => text.trim().split(/\s+/).length;

  const MessageCard = ({ msg, index, isReply = false }) => {
    const charCount = getCharCount(msg.text);
    const wordCount = getWordCount(msg.text);
    const isConnReq = !isReply && messageType === 'connection_request';
    const exceedsLimit = isConnReq && charCount > 300;

    return (
      <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center">
            <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">{index + 1}</span>
            {msg.version}
          </h3>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
            {isConnReq ? `${charCount} chars` : `${wordCount} words`}
          </span>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-4 border border-gray-200">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600">
                {isConnReq ? `Characters: ${charCount}/300 | Words: ~${wordCount}` : `Words: ~${wordCount}`}
              </p>
              {exceedsLimit && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">⚠️ Too long!</span>}
              {isConnReq && !exceedsLimit && charCount <= 300 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Perfect</span>}
            </div>
            {exceedsLimit && <p className="text-xs text-red-600 mt-2">⚠️ Must be under 300 characters!</p>}
          </div>
        </div>
        
        <button
          onClick={() => copyMessage(msg.text, index, isReply)}
          className={`${isReply ? 'reply-copy-btn' : 'copy-btn'} w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition font-medium flex items-center justify-center`}
          disabled={exceedsLimit}
        >
          <span className="text-lg mr-2">📋</span>
          {exceedsLimit ? 'Too Long' : 'Copy Message'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-6 md:p-8 mb-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">LinkedIn Message Generator</h1>
          <p className="text-blue-100 text-base md:text-lg mb-6">AI-powered personalized messages এবং replies</p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('compose')}
              className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'compose' ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/20 hover:bg-white/30'}`}
            >
              <span className="text-xl mr-2">✍️</span>নতুন Message
            </button>
            <button
              onClick={() => setActiveTab('reply')}
              className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'reply' ? 'bg-white text-indigo-600 shadow-lg' : 'bg-white/20 hover:bg-white/30'}`}
            >
              <span className="text-xl mr-2">↩️</span>Reply Generator
            </button>
          </div>
        </div>

        {activeTab === 'compose' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {/* Message Type */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold mb-4">📨 Message Type</h2>
                <div className="grid gap-4">
                  {[
                    { type: 'connection_request', icon: '🤝', title: 'Connection Request', desc: '300 chars / 50-60 words' },
                    { type: 'direct_message', icon: '💬', title: 'Direct Message', desc: '80-150 words' }
                  ].map(({ type, icon, title, desc }) => (
                    <button
                      key={type}
                      onClick={() => setMessageType(type)}
                      className={`p-4 rounded-xl border-2 text-left transition ${messageType === type ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                    >
                      <span className="text-3xl mr-3">{icon}</span>
                      <strong>{title}</strong>
                      <span className="text-sm text-gray-600 block">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">👤 Recipient Info</h2>
                <div className="space-y-4">
                  {[
                    { name: 'name', label: 'Name *', placeholder: 'Sarah Ahmed' },
                    { name: 'jobTitle', label: 'Job Title *', placeholder: 'Senior Product Manager' },
                    { name: 'company', label: 'Company *', placeholder: 'Google' },
                    { name: 'skills', label: 'Skills', placeholder: 'AI/ML, Product Strategy' }
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-bold mb-2">{label}</label>
                      <input
                        name={name}
                        value={recipientData[name]}
                        onChange={handleRecipientChange}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 outline-none"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">🙋‍♂️ Your Info</h2>
                <div className="space-y-4">
                  {[
                    { name: 'name', label: 'Your Name *', placeholder: 'Rakib Hassan' },
                    { name: 'jobTitle', label: 'Your Title *', placeholder: 'Software Engineer' },
                    { name: 'company', label: 'Your Company *', placeholder: 'Tech Startup' }
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-bold mb-2">{label}</label>
                      <input
                        name={name}
                        value={senderData[name]}
                        onChange={handleSenderChange}
                        className="w-full px-4 py-3 border-2 rounded-lg focus:border-green-500 outline-none"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-bold mb-2">Background *</label>
                    <textarea
                      name="background"
                      value={senderData.background}
                      onChange={handleSenderChange}
                      rows="3"
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-green-500 outline-none"
                      placeholder="3 years in AI/ML..."
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={generateMessages}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-2xl disabled:opacity-50"
              >
                {loading ? '⏳ Generating...' : '⚡ Generate Messages'}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 h-fit">
              <h2 className="text-2xl font-bold mb-6">✨ Generated Messages</h2>
              {error && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center"><p className="text-red-600">{error}</p></div>}
              {!messages && !loading && !error && <div className="text-center py-16 text-gray-400"><div className="text-7xl mb-4">📝</div><p>Fill the form and generate</p></div>}
              {loading && <div className="text-center py-16"><div className="animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600 mx-auto mb-4"></div><p>Generating...</p></div>}
              {messages && <div className="space-y-5">{messages.map((msg, i) => <MessageCard key={i} msg={msg} index={i} />)}</div>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4">↩️ Reply to Message</h2>
              <p className="text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded-lg">তুমি যে message পেয়েছো সেটা paste করো এবং reply type select করো</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Your Name *</label>
                  <input
                    name="yourName"
                    value={replyData.yourName}
                    onChange={handleReplyChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-purple-500 outline-none"
                    placeholder="Dhiman Tarafdar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Received Message *</label>
                  <textarea
                    name="receivedMessage"
                    value={replyData.receivedMessage}
                    onChange={handleReplyChange}
                    rows="8"
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-purple-500 outline-none"
                    placeholder="তুমি যে message receive করেছো সেটা এখানে paste করো..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Reply Type *</label>
                  <select
                    name="replyType"
                    value={replyData.replyType}
                    onChange={handleReplyChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-purple-500 outline-none"
                  >
                    <option value="thank_you_followup">🙏 Thank You + Follow-up Question</option>
                    <option value="requesting_meeting">📅 Requesting Meeting/Call</option>
                    <option value="asking_advice">💡 Asking for Specific Advice</option>
                    <option value="sharing_update">📈 Sharing Update/Progress</option>
                    <option value="expressing_interest">✨ Expressing Interest in Opportunity</option>
                    <option value="requesting_feedback">📝 Requesting Feedback on Work</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Additional Context (optional)</label>
                  <textarea
                    name="context"
                    value={replyData.context}
                    onChange={handleReplyChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-purple-500 outline-none"
                    placeholder="যেমন: GitHub link, specific questions, etc."
                  />
                </div>

                <button
                  onClick={generateReply}
                  disabled={replyLoading || !replyData.receivedMessage || !replyData.yourName}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-2xl disabled:opacity-50"
                >
                  {replyLoading ? '⏳ Generating Reply...' : '⚡ Generate Reply'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 h-fit">
              <h2 className="text-2xl font-bold mb-6">✨ Generated Replies</h2>
              {replyError && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center"><p className="text-red-600">{replyError}</p></div>}
              {!replyMessages && !replyLoading && !replyError && <div className="text-center py-16 text-gray-400"><div className="text-7xl mb-4">💬</div><p>Fill the form to generate replies</p></div>}
              {replyLoading && <div className="text-center py-16"><div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-600 mx-auto mb-4"></div><p>Generating replies...</p></div>}
              {replyMessages && (
                <div className="space-y-5">
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <p className="text-sm font-medium">✅ {replyMessages.length}টি reply তৈরি হয়েছে!</p>
                  </div>
                  {replyMessages.map((msg, i) => <MessageCard key={i} msg={msg} index={i} isReply={true} />)}
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                    <p className="text-sm">💡 <strong>Tip:</strong> Reply পাঠানোর আগে একবার পড়ে নিন এবং নিজের মতো করে customize করুন।</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 text-center bg-gray-800 text-white rounded-2xl p-6">
          <p className="text-gray-300">Made with ❤️ using Claude AI | v3.0</p>
        </div>
      </div>
    </div>
  );
}