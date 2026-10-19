import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isMongoConnected } from './config/db.js';

// Import route modules
import consultationRoutes from './routes/consultationRoutes.js';
import calculatorRoutes from './routes/calculatorRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import solutionRoutes from './routes/solutionRoutes.js';
import authRoutes from './routes/authRoutes.js';

/**
 * --------------------------------------------------------------------------
 * 1. CONFIGURATION & ENVIRONMENT VARIABLES
 * --------------------------------------------------------------------------
 * dotenv.config() loads settings from the '.env' file into process.env.
 * This keeps sensitive credentials (like database passwords and port numbers)
 * out of the source code.
 */
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * --------------------------------------------------------------------------
 * 2. CONNECT TO DATABASE
 * --------------------------------------------------------------------------
 * Connects to MongoDB via Mongoose. If MongoDB is not running locally,
 * it falls back gracefully to local file storage so your server never crashes.
 */
connectDB();

/**
 * --------------------------------------------------------------------------
 * 3. MIDDLEWARE
 * --------------------------------------------------------------------------
 * What is Middleware?
 * - Middleware functions run between receiving a request and sending a response.
 * - cors(): Allows your frontend (running on http://localhost:5173) to communicate
 *   with this backend (running on http://localhost:5000). Without CORS, the browser
 *   blocks cross-origin requests for security reasons.
 * - express.json(): Automatically converts incoming JSON request bodies into
 *   accessible JavaScript objects (available as req.body).
 */
app.use(cors({
  origin: '*', // Allows requests from any origin (ideal for local development)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Friendly Request Logger (helps you see incoming API calls in your terminal!)
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\x1b[35m[${timestamp}]\x1b[0m \x1b[36m${req.method}\x1b[0m ${req.url}`);
  next(); // Pass control to the next middleware or route
});

/**
 * --------------------------------------------------------------------------
 * 4. API ROUTES
 * --------------------------------------------------------------------------
 * Here we map URL prefixes to their respective router handlers.
 */

// A. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'SolarPro Clean Energy Systems Backend API',
    uptime: `${Math.floor(process.uptime())} seconds`,
    database: isMongoConnected ? 'MongoDB (Connected)' : 'Local File Storage (Active Fallback)',
    timestamp: new Date().toISOString()
  });
});

// B. Core Solar API Endpoints
app.use('/api/consultations', consultationRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/auth', authRoutes);

// C. Welcome / Root Endpoint with helpful API Documentation
app.get('/', (req, res) => {
  res.json({
    message: '⚡ Welcome to SolarPro Clean Energy API!',
    status: 'Running',
    database: isMongoConnected ? 'MongoDB' : 'Local Fallback Storage',
    availableEndpoints: [
      { method: 'GET', path: '/api/health', description: 'Server and database health check' },
      { method: 'POST', path: '/api/consultations', description: 'Submit a free quote request' },
      { method: 'GET', path: '/api/consultations', description: 'List all submitted quotes' },
      { method: 'GET', path: '/api/consultations/:id', description: 'Get a single quote by Ticket Number' },
      { method: 'POST', path: '/api/calculator/calculate', description: 'Solar sizing & savings calculations' },
      { method: 'GET', path: '/api/projects', description: 'List all solar installation projects' },
      { method: 'GET', path: '/api/solutions', description: 'List all solar engineering services' }
    ]
  });
});

/**
 * --------------------------------------------------------------------------
 * 5. ERROR HANDLING MIDDLEWARE
 * --------------------------------------------------------------------------
 */

// 404 Not Found Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route "${req.originalUrl}" does not exist. Visit http://localhost:${PORT}/ to see available endpoints.`
  });
});

// Global Error Handler for unexpected exceptions
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/**
 * --------------------------------------------------------------------------
 * 6. START SERVER
 * --------------------------------------------------------------------------
 */
// Guard app.listen so Vercel Serverless environment can invoke app directly without port conflict
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', '=======================================================');
    console.log(`\x1b[32m🚀 SolarPro Backend Server is RUNNING on port ${PORT}\x1b[0m`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📋 API Docs: http://localhost:${PORT}/`);
    console.log('\x1b[32m%s\x1b[0m', '=======================================================');
  });
}

export default app;
