import express from 'express';
import { getDirectoryEntries, getDirectoryById } from '../controllers/directoryController.js';

const router = express.Router();

// @route GET /api/directory
// @desc  Get directory entries (filtered by type, district, state, search)
router.get('/', getDirectoryEntries);

// @route GET /api/directory/:id
// @desc  Get single directory entry by ID
router.get('/:id', getDirectoryById);

export default router;
