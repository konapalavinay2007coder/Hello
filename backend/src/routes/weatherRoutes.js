import express from 'express';
import { getWeatherInfo } from '../controllers/weatherController.js';

const router = express.Router();

// @route GET /api/weather
// @desc  Get live or cached weather info
router.get('/', getWeatherInfo);

export default router;
