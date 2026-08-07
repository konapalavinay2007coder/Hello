import express from 'express';
import { handleQuery } from '../controllers/queryController.js';

const router = express.Router();

// @route POST /api/query
// @desc  Main Multilingual Conversational Advisory Endpoint
router.post('/', handleQuery);

export default router;
