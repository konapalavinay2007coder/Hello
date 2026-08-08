import mongoose from 'mongoose';

const marketPriceCacheSchema = new mongoose.Schema({
  commodity: {
    type: String,
    required: true,
    index: true
  },
  marketName: {
    type: String,
    default: 'Local APMC Mandi'
  },
  state: {
    type: String,
    default: 'Rajasthan'
  },
  district: {
    type: String,
    required: true,
    index: true
  },
  minPrice: {
    type: Number,
    required: true
  },
  maxPrice: {
    type: Number,
    required: true
  },
  modalPrice: {
    type: Number,
    required: true
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'market_price_cache'
});

export const MarketPriceCache = mongoose.model('MarketPriceCache', marketPriceCacheSchema);
