import axios from 'axios';
import { MarketPriceCache } from '../models/MarketPriceCache.js';

export const getMandiPrices = async ({ commodity = 'Tomato', district = 'Nagaur', state = 'Rajasthan' }) => {
  const commClean = commodity.trim();
  const distClean = district.trim();
  const stateClean = state.trim();

  try {
    const apiKey = process.env.AGMARKNET_API_KEY;
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=10&filters[commodity]=${encodeURIComponent(commClean)}`;

    // 3-second timeout requirement
    const response = await axios.get(url, { timeout: 3000 });

    if (response.data && response.data.records && response.data.records.length > 0) {
      const records = response.data.records;

      // Map API records to clean format
      const formattedRecords = records.map(rec => ({
        commodity: rec.commodity || commClean,
        marketName: rec.market || `${distClean} APMC`,
        state: rec.state || stateClean,
        district: rec.district || distClean,
        minPrice: parseInt(rec.min_price) || 2000,
        maxPrice: parseInt(rec.max_price) || 3000,
        modalPrice: parseInt(rec.modal_price) || 2500,
        fetchedAt: new Date()
      }));

      // Cache records to MongoDB asynchronously
      for (const rec of formattedRecords) {
        MarketPriceCache.findOneAndUpdate(
          { commodity: rec.commodity, district: rec.district, marketName: rec.marketName },
          rec,
          { upsert: true }
        ).catch(err => console.error('[MarketPriceCache] DB update error:', err.message));
      }

      return {
        live: true,
        stale: false,
        count: formattedRecords.length,
        data: formattedRecords
      };
    } else {
      throw new Error('No live records found for specified commodity/district');
    }
  } catch (error) {
    console.warn(`[mandiPriceService] Live API call failed or timed out (${error.message}). Falling back to MongoDB cache...`);

    // Fallback to cached entries in MongoDB
    const commRegex = new RegExp(commClean, 'i');
    const distRegex = new RegExp(distClean, 'i');

    const cachedRecords = await MarketPriceCache.find({
      $or: [
        { commodity: commRegex, district: distRegex },
        { commodity: commRegex },
        { district: distRegex }
      ]
    }).sort({ fetchedAt: -1 }).limit(10);

    if (cachedRecords && cachedRecords.length > 0) {
      return {
        live: false,
        stale: true,
        count: cachedRecords.length,
        data: cachedRecords,
        message: 'Serving cached mandi market prices due to API timeout/error'
      };
    }

    // Default fallback entry if database cache is empty
    const defaultFallback = [{
      commodity: commClean,
      marketName: `${distClean} APMC Mandi`,
      state: stateClean,
      district: distClean,
      minPrice: 2200,
      maxPrice: 2800,
      modalPrice: 2500,
      fetchedAt: new Date(Date.now() - 7200 * 1000)
    }];

    return {
      live: false,
      stale: true,
      count: 1,
      data: defaultFallback,
      message: 'Serving fallback mandi price data'
    };
  }
};
