import mongoose from 'mongoose';

const directorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    enum: ['KCC', 'CSC', 'SHG', 'GOVERNMENT', 'OTHER']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    default: 'All'
  },
  lat: {
    type: Number,
    default: 0
  },
  lng: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'directories'
});

export const Directory = mongoose.model('Directory', directorySchema);
