import express from 'express';
import { getPosts, createPost, addAnswer, upvoteAnswer } from '../controllers/communityController.js';

const router = express.Router();

// @route GET /api/community
// @desc  Get community posts (filtered by domain, district, search)
router.get('/', getPosts);

// @route POST /api/community
// @desc  Create a new community question post
router.post('/', createPost);

// @route POST /api/community/:id/answer
// @desc  Add an answer to a community post
router.post('/:id/answer', addAnswer);

// @route POST /api/community/:id/answer/:answerId/upvote
// @desc  Upvote an answer
router.post('/:id/answer/:answerId/upvote', upvoteAnswer);

export default router;
