export const buildConnectionRequestPrompt = (recipientData, senderData) => {
  return `Generate 3 PROFESSIONAL CONNECTION REQUEST MESSAGES for LinkedIn (${recipientData.name}):

RECIPIENT PROFILE:
- Name: ${recipientData.name}
- Position: ${recipientData.jobTitle} at ${recipientData.company}
- Skills/Expertise: ${recipientData.skills || 'Not specified'}
${recipientData.recentActivity ? `- Recent Focus: ${recipientData.recentActivity}` : ''}
${recipientData.mutualConnections ? `- Mutual Connection: ${recipientData.mutualConnections}` : ''}

SENDER PROFILE:
- Name: ${senderData.name}
- Position: ${senderData.jobTitle} at ${senderData.company}
- Background: ${senderData.background}
${senderData.specificInterest ? `- Interested in: ${senderData.specificInterest}` : ''}

REQUIREMENTS:
- Each message should be 30-60 words, single paragraph
- Must include personalized reference to recipient's work/expertise
- Professional tone suitable for HR, Senior professionals, industry leaders
- Show genuine interest in their specific domain
- End with clear, soft call to action
- Avoid generic/template-like language
- Be authentic and specific, not generic

Return ONLY this JSON format (no extra text):
{
  "messages": [
    {"version": "Concise (30-40 words)", "text": "Message text here", "wordCount": 35},
    {"version": "Standard (45-55 words)", "text": "Message text here", "wordCount": 50},
    {"version": "Detailed (55-60 words)", "text": "Message text here", "wordCount": 58}
  ]
}`;
};

export const buildDirectMessagePrompt = (recipientData, senderData) => {
  return `Generate 3 PROFESSIONAL DIRECT MESSAGES in formal letter format for ${recipientData.name}:

RECIPIENT:
- Name: ${recipientData.name}
- Position: ${recipientData.jobTitle} at ${recipientData.company}
${recipientData.skills ? `- Expertise: ${recipientData.skills}` : ''}
${recipientData.recentActivity ? `- Recent Work: ${recipientData.recentActivity}` : ''}
${recipientData.education ? `- Education: ${recipientData.education}` : ''}

SENDER:
- Name: ${senderData.name}
- Position: ${senderData.jobTitle} at ${senderData.company}
- Background/Context: ${senderData.background}
${senderData.specificInterest ? `- Interest Area: ${senderData.specificInterest}` : ''}
- Purpose: ${senderData.purpose || 'Professional Connection'}

MESSAGE STRUCTURE (Must Follow):
1. Greeting: "Dear [Name]," or "Respected [Name],"
2. Introduction: Introduce yourself with name, role, and institution
3. Connection: Show knowledge of their work/achievements with specific details
4. Motivation: Explain why you're reaching out and what drew you to them
5. Value Proposition: How you might benefit from their mentorship/guidance
6. Call to Action: Polite request to connect with clear next step
7. Closing: Professional sign-off with name

STYLE GUIDELINES:
- Length: 250-300 words per message (around 3-4 paragraphs)
- Tone: Respectful, professional, genuine (like a formal business letter)
- Avoid: Generic language, too casual, desperate tone
- Focus: Personalization with specific details from their profile
- Benefits: Show mutual interest or learning opportunity

Return ONLY this JSON format (no extra text):
{
  "messages": [
    {"version": "Formal (250-265 words)", "text": "Full message text here", "wordCount": 258},
    {"version": "Standard (265-285 words)", "text": "Full message text here", "wordCount": 275},
    {"version": "Detailed (285-300 words)", "text": "Full message text here", "wordCount": 295}
  ]
}`;
};

export const buildReplyPrompt = (replyData) => {
  return `Generate 3 PROFESSIONAL REPLY MESSAGES to this message:
"${replyData.receivedMessage}"

FROM: ${replyData.yourName}

REQUIREMENTS:
- Each response: 120-200 words
- Professional and courteous tone
- Acknowledge their message specifically
- Provide valuable input or thoughtful response
- Maintain conversation flow
- Suitable for professional context (HR, boss, colleagues)

Return ONLY this JSON format (no extra text):
{
  "messages": [
    {"version": "Brief (120-140 words)", "text": "Message text here", "wordCount": 130},
    {"version": "Balanced (140-170 words)", "text": "Message text here", "wordCount": 155},
    {"version": "Detailed (170-200 words)", "text": "Message text here", "wordCount": 190}
  ]
}`;
};