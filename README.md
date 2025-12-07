# 🎤 Ultimate Interviewer

**The Ultimate LiveKit Interview Agent** - A multi-persona AI interview platform built entirely on LiveKit Cloud. Transform into any interviewer type (university admissions, corporate HR, executive coach, etc.) and conduct interviews via phone, web, or mobile with full recording and transcription.

## 🚀 Features

- **Multi-Persona System** - Unlimited interviewer personalities (university admissions, corporate HR, executive coach, warehouse screening, etc.)
- **Multi-Channel Access** - Web, phone (SIP), mobile, and kiosk modes
- **LiveKit Inference API** - Built-in STT, TTS, and LLM (no external API keys needed)
- **Full Recording** - Video + audio with real-time transcription via LiveKit Egress
- **AI Scoring** - Automated evaluation against custom rubrics
- **100% Cloud-Native** - No self-hosted infrastructure required

## 🏗️ Architecture

Built entirely on **LiveKit Cloud**:

- **LiveKit Agents Framework** - Voice pipeline agents
- **LiveKit Room Service** - Interview session management
- **LiveKit Inference API** - STT/TTS/LLM (built-in models)
- **LiveKit Egress** - Recording and transcription
- **LiveKit SIP** - Phone access via Twilio/Telephony plugins
- **LiveKit Data Channels** - Real-time metadata and scoring

## 📋 Prerequisites

- Node.js >= 18.0.0
- LiveKit Cloud account ([cloud.livekit.io](https://cloud.livekit.io))
- LiveKit CLI installed and authenticated
- (Optional) Twilio account for phone access

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ultimate-interviewer.git
cd ultimate-interviewer

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your LiveKit credentials
```

## ⚙️ Configuration

Update `.env` with your LiveKit Cloud credentials:

```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

### Optional: SIP/Phone Access

For phone-based interviews, add Twilio credentials:

```env
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_phone_number
```

## 🎯 Usage

### Start the API Server

```bash
npm start
```

### Run the Voice Pipeline Agent

```bash
npm run agent
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

## 📂 Project Structure

```
ultimate-interviewer/
├── src/
│   ├── server.js              # API server (token generation, room management)
│   ├── agents/
│   │   ├── interview-agent.js # Main voice pipeline agent
│   │   ├── scoring-agent.js   # Scoring and evaluation
│   │   └── recording-agent.js # Egress management
│   ├── personas/
│   │   ├── university_admissions.yaml
│   │   ├── corporate_hr.yaml
│   │   └── ...
│   └── utils/
│       ├── persona-loader.js
│       └── scoring.js
├── public/                    # Web client
├── .env
├── package.json
└── README.md
```

## 🎭 Personas

Each persona is defined in a YAML file with:

- Voice characteristics (tone, pace, language)
- Question banks
- Scoring rubrics
- Evaluation criteria

Example personas:
- University Admissions Officer
- Corporate HR Recruiter
- Executive Coach
- Warehouse Screening Agent
- Parent Coach
- Verification Officer

## 🔧 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **SDKs**: livekit-server-sdk, @livekit/rtc-node
- **AI/Voice**: LiveKit Inference API (built-in)
- **Config**: YAML for personas
- **Storage**: Cloudflare R2 / AWS S3 (optional)
- **Database**: Neon PostgreSQL (optional)

## 📖 Documentation

- [LiveKit Docs](https://docs.livekit.io)
- [LiveKit Agents](https://docs.livekit.io/agents)
- [LiveKit Cloud](https://cloud.livekit.io)
- [LiveKit Inference API](https://docs.livekit.io/inference)
- [LiveKit SIP](https://docs.livekit.io/sip)

## 🚢 Deployment

### Vercel (API Server)

```bash
vercel --prod
```

### LiveKit Cloud (Agents)

```bash
lk agent deploy
```

## 📄 License

MIT

## 🙋 Support

For issues and questions, please check the [LiveKit Docs MCP Server](https://docs.livekit.io/mcp) or open an issue.

---

Built with ❤️ by XTRIUS
