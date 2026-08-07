import express from 'express';
import multer from 'multer';
import { handleQuery, handleImageQuery } from '../controllers/queryController.js';

const router = express.Router();

// Memory storage for multer file upload (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// @route POST /api/query
// @desc  Main Multilingual Conversational Advisory Endpoint (Supports text JSON OR optional audio upload)
router.post('/', upload.single('audio'), handleQuery);

// @route POST /api/query/image
// @desc  Multimodal Crop Photo Vision Analysis Endpoint
router.post('/image', upload.single('image'), handleImageQuery);

export default router;
