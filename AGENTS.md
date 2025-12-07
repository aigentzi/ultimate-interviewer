# Agent Instructions for Ultimate Interviewer

## Project Overview

This is the **Ultimate LiveKit Interview Agent** - a multi-persona AI interview platform built entirely on LiveKit Cloud. The platform transforms into any interviewer type (university admissions, corporate HR, executive coach, etc.) and is accessible via phone, web, or mobile with full recording and transcription.

## LiveKit Documentation

LiveKit Agents is a fast-evolving project, and the documentation is updated frequently. You should always refer to the latest documentation when working with this project. For your convenience, LiveKit offers an MCP server that can be used to browse and search its documentation.

**CRITICAL**: Always consult the LiveKit Docs MCP Server at `https://docs.livekit.io/mcp` before implementing any LiveKit-related functionality.

## Architecture Requirements

This project MUST use:

1. **LiveKit Cloud** - 100% cloud-native, no self-hosted infrastructure
2. **LiveKit Agents Framework** - For building voice pipeline agents
3. **LiveKit Room Service** - For managing interview sessions
4. **LiveKit Egress** - For recording interviews (video/audio)
5. **LiveKit SIP** - For phone access integration
6. **LiveKit Data Channels** - For real-time metadata and scoring

## Key Features to Implement

### 1. Multi-Persona System
- Load persona configurations from YAML files
- Each persona has unique voice, tone, question banks, and scoring rubrics
- Personas: university_admissions, corporate_hr, executive_coach, warehouse_screening, parent_coach, verification_officer

### 2. Access Modes
- **Web**: Browser-based with video
- **Phone**: SIP/Twilio integration
- **Mobile**: Native app support
- **Kiosk**: Supervised interview stations

### 3. Voice Pipeline Agent
- STT (Speech-to-Text)
- LLM (Language Model for responses)
- TTS (Text-to-Speech)
- VAD (Voice Activity Detection)

### 4. Recording & Transcription
- Full interview recording via Egress
- Real-time transcription
- Video + audio sync
- Cloud storage integration (R2/S3)

### 5. Scoring System
- AI-based evaluation against rubrics
- Real-time scoring during interview
- Automated report generation

## Development Guidelines

1. **Always check LiveKit docs** via MCP before implementing features
2. **Use LiveKit Cloud services** - no custom WebRTC implementations
3. **Follow LiveKit Agents patterns** - use official SDKs and frameworks
4. **Leverage LiveKit plugins** - for STT/TTS/LLM integrations
5. **Use TypeScript/Node.js or Python** - official LiveKit agent languages

## Tech Stack

- **Runtime**: Node.js (>= 18.0.0)
- **SDK**: livekit-server-sdk, @livekit/rtc-node
- **Agents**: @livekit/agents (when available for Node.js)
- **Framework**: Express.js for API server
- **Config**: YAML for persona definitions
- **Storage**: Cloudflare R2 / AWS S3
- **Database**: Neon PostgreSQL (optional)
- **Email**: Resend (optional)

## Project Structure

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
├── .env.example
├── package.json
└── AGENTS.md (this file)
```

## References

- LiveKit Docs: https://docs.livekit.io
- LiveKit Agents: https://docs.livekit.io/agents
- LiveKit Cloud: https://cloud.livekit.io
- LiveKit MCP: https://docs.livekit.io/mcp
