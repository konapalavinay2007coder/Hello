import mongoose from 'mongoose';

const weatherCacheSchema = new mongoose.Schema({
  locationKey: {
    type: String,
    required: true,
    index: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  tempC: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    default: 'Clear'
  },
  forecastSummary: {
    type: String,
    default: ''
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'weather_cache'
});

export const WeatherCache = mongoose.model('WeatherCache', weatherCacheSchema);
