import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'anonymous_user'
  },
  domain: {
    type: String,
    required: true,
    enum: ['agriculture', 'education', 'schemes', 'dairy', 'general'],
    default: 'agriculture'
  },
  inputType: {
    type: String,
    enum: ['text', 'voice', 'image'],
    default: 'text'
  },
  originalText: {
    type: String,
    required: true
  },
  maskedText: {
    type: String,
    required: true
  },
  privacyMasked: {
    type: Boolean,
    default: false
  },
  enhancedPrompt: {
    type: String,
    default: ''
  },
  detectedLanguage: {
    type: String,
    default: 'hi'
  },
  responseText: {
    type: String,
    required: true
  },
  sources: {
    mandi: { type: Array, default: [] },
    weather: { type: Object, default: null },
    schemes: { type: Array, default: [] }
  },
  wasOffline: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'queries'
});

export const Query = mongoose.model('Query', querySchema);
