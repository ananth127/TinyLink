import express from 'express';
import cors from 'cors';
import linksRouter from './routes/links.js';
import redirectRouter from './routes/redirect.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api', linksRouter);

// Redirect routes (must be last to not interfere with other routes)
app.use('/', redirectRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;