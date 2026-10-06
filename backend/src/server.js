import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import { setupHealthSimulator } from './sockets/healthSimulator.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Connect to MongoDB
connectDB();

// Setup Socket.io with robust CORS configuration
const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Setup Health Telemetry Simulator on Socket.io
setupHealthSimulator(io);

// Middlewares
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/nutrition', foodRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'FitAdapt Cyberpunk AI Engine',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on FitAdapt server`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[GlobalErrorHandler]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚡ FitAdapt Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${CLIENT_URL}`);
  console.log(`📡 WebSocket Telemetry: Ready (every 4s sync)`);
  console.log(`🤖 AI Engine: Google Gemini API ready`);
  console.log(`===============================================`);
});
