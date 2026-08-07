import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import schemeRoutes from './src/routes/schemeRoutes.js';
import directoryRoutes from './src/routes/directoryRoutes.js';
import weatherRoutes from './src/routes/weatherRoutes.js';
import mandiRoutes from './src/routes/mandiRoutes.js';
import queryRoutes from './src/routes/queryRoutes.js';
import communityRoutes from './src/routes/communityRoutes.js';
import formFillRoutes from './src/routes/formFillRoutes.js';
import { initCacheRefreshJob } from './src/services/cacheRefreshJob.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize background cache refresh cron job
initCacheRefreshJob();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'hello backend server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/query', queryRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/directory', directoryRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/mandi-prices', mandiRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/form-fill', formFillRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`[hello-backend] Server running on http://localhost:${PORT}`);
});
