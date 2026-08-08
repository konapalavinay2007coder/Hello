import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  authorName: { type: String, default: 'Community Member' },
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const communityPostSchema = new mongoose.Schema({
  userId: { type: String, default: 'anonymous' },
  domain: {
    type: String,
    enum: ['agriculture', 'education', 'schemes', 'dairy', 'general'],
    default: 'agriculture'
  },
  questionText: { type: String, required: true, trim: true },
  language: { type: String, default: 'hi' },
  location: {
    district: { type: String, default: 'Nagaur' },
    village: { type: String, default: '' }
  },
  answers: [answerSchema]
}, {
  timestamps: true,
  collection: 'community_posts'
});

export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
