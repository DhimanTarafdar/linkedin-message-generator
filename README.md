# LinkedIn Message Generator

A free AI-powered web app that helps you write personalized LinkedIn messages in seconds — no more staring at a blank screen wondering what to say.

---

## Why I Built This

Writing LinkedIn messages is something almost everyone struggles with. Generic connection requests get ignored, and crafting a thoughtful personalized message takes way too much time. I built this tool to solve exactly that problem — give it a few details about the person you want to reach, and it generates professional, personalized messages for you instantly.

---

## What It Does

### 1. Connection Request Note
Generates short, personalized connection notes that fit within LinkedIn's 300-character limit. No more copy-paste templates.

### 2. Direct Message
Creates professional and concise messages for people you are already connected with. You can choose your purpose — mentorship, collaboration, job opportunity, knowledge exchange, and more.

### 3. Reply Generator
Paste any message you received on LinkedIn and get a well-structured, professional reply tailored to your goal.

For each type, the AI gives you **3 different variants** so you can pick the one that feels most natural to you.

---

## How to Use It

1. Open the [live app](http://linkedin-message-generator-j3dxu11tr-dhiman-tarafdars-projects.vercel.app)
2. Select the message type you need
3. Fill in the recipient's details (name, job title, company)
4. Add your own details and purpose
5. Click **Generate** and get your messages instantly
6. Copy and send — done!

No signup required. Completely free.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 (App Router) | Frontend framework |
| Groq API (Llama 3.1 8B) | AI message generation |
| Shadcn UI | UI components |
| Tailwind CSS v4 | Styling |
| Vercel | Deployment |

---

## Getting Started Locally

### Prerequisites
- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/DhimanTarafdar/linkedin-message-generator.git

# Navigate into the project
cd linkedin-message-generator

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Add your Groq API key to `.env.local`:
```
GROQ_API_KEY=your_api_key_here
```

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/
│   ├── api/generate/     # API route for Groq
│   ├── globals.css       # Global styles
│   ├── layout.js         # Root layout
│   └── page.js           # Main page
├── components/
│   ├── Navbar.jsx        # Navigation bar
│   ├── Header.jsx        # Tab switcher
│   ├── ComposeTab.jsx    # New message section
│   ├── ReplyTab.jsx      # Reply section
│   └── MessageCard.jsx   # Generated message card
└── utils/
    ├── promptBuilder.js  # AI prompt templates
    └── helpers.js        # Utility functions
```

---

## What I Learned

Building this project taught me a lot:

- How to integrate and work with LLM APIs (Groq)
- Prompt engineering for consistent, structured JSON responses
- Building a clean dark-themed UI with Shadcn and Tailwind v4
- Next.js App Router and API routes
- Deploying and managing a production app on Vercel

---

## Contributing

Found a bug or have a feature idea? Feel free to open an issue or submit a pull request. All contributions are welcome.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built by [Dhiman Tarafdar](https://github.com/DhimanTarafdar)
