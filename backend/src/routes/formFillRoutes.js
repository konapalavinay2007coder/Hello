import express from 'express';
import { handleFormFill } from '../controllers/formFillController.js';

const router = express.Router();

// @route POST /api/form-fill
// @desc  Voice slot-filling dialogue endpoint for government scheme forms
router.post('/', handleFormFill);

export default router;
