import express from 'express';
import { getMandiPriceInfo } from '../controllers/mandiController.js';

const router = express.Router();

// @route GET /api/mandi-prices
// @desc  Get live or cached mandi commodity prices
router.get('/', getMandiPriceInfo);

export default router;
