import express from 'express';
import cors from 'cors';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

// Validate LiveKit credentials
if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
  console.error('❌ Missing LiveKit credentials. Check your .env file.');
  process.exit(1);
}

// Initialize LiveKit Room Service Client
const roomService = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

console.log('🎓 XTRIUS ULTIMATE INTERVIEWER');
console.log('='.repeat(70));
console.log(`🔗 LiveKit URL: ${LIVEKIT_URL}`);
console.log('='.repeat(70));

// ============================================================
// API ENDPOINTS
// ============================================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ultimate Interviewer',
    livekit_connected: !!LIVEKIT_URL,
    timestamp: new Date().toISOString()
  });
});

/**
 * Generate access token for LiveKit room
 * 
 * Request body:
 * {
 *   "roomName": "interview-123",
 *   "participantName": "John Doe",
 *   "participantType": "candidate" | "interviewer" | "agent",
 *   "persona": "university_admissions" (optional),
 *   "metadata": {} (optional)
 * }
 */
app.post('/api/token', async (req, res) => {
  try {
    const {
      roomName,
      participantName,
      participantType = 'candidate',
      persona,
      metadata = {}
    } = req.body;

    if (!roomName || !participantName) {
      return res.status(400).json({
        error: 'roomName and participantName are required'
      });
    }

    // Create unique participant identity
    const identity = `${participantType}_${uuidv4()}`;

    // Prepare metadata
    const participantMetadata = {
      name: participantName,
      type: participantType,
      persona: persona || 'default',
      joinedAt: new Date().toISOString(),
      ...metadata
    };

    // Create access token
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
      name: participantName,
      metadata: JSON.stringify(participantMetadata),
    });

    // Grant permissions based on participant type
    const canPublish = participantType === 'candidate' || participantType === 'agent';
    const canPublishData = true;

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish,
      canSubscribe: true,
      canPublishData,
      canUpdateOwnMetadata: true,
    });

    const token = await at.toJwt();

    res.json({
      token,
      url: LIVEKIT_URL,
      roomName,
      identity,
      participantName,
      participantType,
      persona: persona || 'default'
    });

    console.log(`✅ Token generated: ${participantName} → ${roomName} (${participantType})`);
  } catch (error) {
    console.error('❌ Token generation error:', error);
    res.status(500).json({
      error: 'Failed to generate token',
      message: error.message
    });
  }
});

/**
 * Create a new interview room
 * 
 * Request body:
 * {
 *   "interviewType": "university_admissions",
 *   "candidateName": "John Doe",
 *   "duration": 1800 (seconds, optional)
 * }
 */
app.post('/api/interview/create', async (req, res) => {
  try {
    const {
      interviewType,
      candidateName,
      duration = 1800, // 30 minutes default
      enableRecording = true
    } = req.body;

    if (!interviewType || !candidateName) {
      return res.status(400).json({
        error: 'interviewType and candidateName are required'
      });
    }

    // Generate unique room name
    const roomName = `interview_${interviewType}_${Date.now()}`;

    // Create room with LiveKit
    const room = await roomService.createRoom({
      name: roomName,
      emptyTimeout: 300, // 5 minutes empty timeout
      maxParticipants: 10,
      metadata: JSON.stringify({
        interviewType,
        candidateName,
        createdAt: new Date().toISOString(),
        enableRecording
      })
    });

    console.log(`🏠 Room created: ${roomName}`);

    res.json({
      roomName: room.name,
      interviewType,
      candidateName,
      duration,
      enableRecording,
      createdAt: room.creationTime
    });
  } catch (error) {
    console.error('❌ Room creation error:', error);
    res.status(500).json({
      error: 'Failed to create interview room',
      message: error.message
    });
  }
});

/**
 * List active rooms
 */
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await roomService.listRooms();
    res.json({
      rooms: rooms.map(room => ({
        name: room.name,
        sid: room.sid,
        numParticipants: room.numParticipants,
        creationTime: room.creationTime,
        metadata: room.metadata ? JSON.parse(room.metadata) : {}
      }))
    });
  } catch (error) {
    console.error('❌ List rooms error:', error);
    res.status(500).json({
      error: 'Failed to list rooms',
      message: error.message
    });
  }
});

/**
 * Get room details
 */
app.get('/api/rooms/:roomName', async (req, res) => {
  try {
    const { roomName } = req.params;
    const participants = await roomService.listParticipants(roomName);
    
    res.json({
      roomName,
      participants: participants.map(p => ({
        identity: p.identity,
        name: p.name,
        metadata: p.metadata ? JSON.parse(p.metadata) : {},
        joinedAt: p.joinedAt
      }))
    });
  } catch (error) {
    console.error('❌ Get room error:', error);
    res.status(500).json({
      error: 'Failed to get room details',
      message: error.message
    });
  }
});

/**
 * End interview (delete room)
 */
app.delete('/api/interview/:roomName', async (req, res) => {
  try {
    const { roomName } = req.params;
    await roomService.deleteRoom(roomName);
    
    console.log(`🗑️ Room deleted: ${roomName}`);
    
    res.json({
      success: true,
      message: `Interview room ${roomName} has been ended`
    });
  } catch (error) {
    console.error('❌ Delete room error:', error);
    res.status(500).json({
      error: 'Failed to end interview',
      message: error.message
    });
  }
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/token`);
  console.log(`   POST /api/interview/create`);
  console.log(`   GET  /api/rooms`);
  console.log(`   GET  /api/rooms/:roomName`);
  console.log(`   DELETE /api/interview/:roomName`);
  console.log('\n' + '='.repeat(70) + '\n');
});
