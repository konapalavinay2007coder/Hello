import express from 'express';
import { getSchemes, getSchemeById } from '../controllers/schemeController.js';

const router = express.Router();

// @route GET /api/schemes
// @desc  Get government schemes (filtered by domain or search query)
router.get('/', getSchemes);

// @route GET /api/schemes/:id
// @desc  Get single scheme by ID
router.get('/:id', getSchemeById);

export default router;
