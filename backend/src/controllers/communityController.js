import { CommunityPost } from '../models/CommunityPost.js';

/**
 * GET /api/community
 * Query Params: domain, district, search
 */
export const getPosts = async (req, res) => {
  try {
    const { domain, district, search } = req.query;
    const filter = {};

    if (domain) {
      filter.domain = new RegExp(`^${domain.trim()}$`, 'i');
    }

    if (district) {
      filter['location.district'] = new RegExp(`^${district.trim()}$`, 'i');
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { questionText: searchRegex },
        { 'answers.text': searchRegex }
      ];
    }

    const posts = await CommunityPost.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('[communityController] Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch community posts',
      error: error.message
    });
  }
};

/**
 * POST /api/community
 * Body: { questionText, domain, language, location: { district, village }, userId }
 */
export const createPost = async (req, res) => {
  try {
    const { questionText, domain = 'agriculture', language = 'hi', location = {}, userId = 'anonymous' } = req.body;

    if (!questionText || questionText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'questionText is required'
      });
    }

    const post = await CommunityPost.create({
      userId,
      domain: domain.toLowerCase(),
      questionText: questionText.trim(),
      language,
      location: {
        district: location.district || 'Nagaur',
        village: location.village || ''
      },
      answers: []
    });

    res.status(201).json({
      success: true,
      message: 'Community post created successfully',
      data: post
    });
  } catch (error) {
    console.error('[communityController] Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create community post',
      error: error.message
    });
  }
};

/**
 * POST /api/community/:id/answer
 * Body: { text, authorName }
 */
export const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, authorName = 'Community Member' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answer text is required'
      });
    }

    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Community post not found'
      });
    }

    const newAnswer = {
      text: text.trim(),
      authorName: authorName.trim(),
      upvotes: 0,
      createdAt: new Date()
    };

    post.answers.push(newAnswer);
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Answer added successfully',
      data: post
    });
  } catch (error) {
    console.error('[communityController] Error adding answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add answer',
      error: error.message
    });
  }
};

/**
 * POST /api/community/:id/answer/:answerId/upvote
 */
export const upvoteAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;

    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Community post not found'
      });
    }

    const answer = post.answers.id(answerId);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found'
      });
    }

    answer.upvotes += 1;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Upvoted successfully',
      upvotes: answer.upvotes,
      data: post
    });
  } catch (error) {
    console.error('[communityController] Error upvoting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upvote answer',
      error: error.message
    });
  }
};
