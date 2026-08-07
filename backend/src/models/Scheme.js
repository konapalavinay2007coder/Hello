import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  name: { type: String },
  eligibilityText: { type: String },
  benefitText: { type: String }
}, { _id: false });

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    enum: ['agriculture', 'education', 'schemes', 'dairy', 'general']
  },
  eligibilityText: {
    type: String,
    required: true
  },
  benefitText: {
    type: String,
    required: true
  },
  applyLink: {
    type: String,
    default: ''
  },
  helplineNumber: {
    type: String,
    default: ''
  },
  translations: {
    type: Map,
    of: translationSchema,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'schemes'
});

export const Scheme = mongoose.model('Scheme', schemeSchema);
