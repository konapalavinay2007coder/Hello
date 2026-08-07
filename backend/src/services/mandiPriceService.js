import axios from 'axios';
import { MarketPriceCache } from '../models/MarketPriceCache.js';

/**
 * Fetch real-time Mandi commodity market prices from data.gov.in Agmarknet API
 */
export const getMandiPrices = async ({ commodity = 'Tomato', district = '', state = '' }) => {
  const commClean = commodity.trim();
  const distClean = district.trim();

  try {
    const apiKey = process.env.AGMARKNET_API_KEY;
    if (!apiKey) {
      throw new Error('AGMARKNET_API_KEY missing in environment variables');
    }

    let records = [];
    let isLive = false;

    // Strategy 1: Attempt live Agmarknet query with district filter if provided
    if (distClean) {
      try {
        const distUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=50&filters[district]=${encodeURIComponent(distClean)}`;
        const distRes = await axios.get(distUrl, { timeout: 3000 });
        if (distRes.data && distRes.data.records && distRes.data.records.length > 0) {
          records = distRes.data.records;
          isLive = true;
        }
      } catch (distErr) {
        console.warn(`[mandiPriceService] Agmarknet district filter query (${distClean}) failed:`, distErr.message);
      }
    }

    // Strategy 2: Attempt live Agmarknet query with commodity filter if district returned 0 or wasn't provided
    if (records.length === 0 && commClean) {
      const commUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=50&filters[commodity]=${encodeURIComponent(commClean)}`;
      const commRes = await axios.get(commUrl, { timeout: 3000 });
      if (commRes.data && commRes.data.records && commRes.data.records.length > 0) {
        records = commRes.data.records;
        isLive = true;
      }
    }

    // Strategy 3: General live Agmarknet query if both were empty
    if (records.length === 0) {
      const genUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=25`;
      const genRes = await axios.get(genUrl, { timeout: 3000 });
      if (genRes.data && genRes.data.records) {
        records = genRes.data.records;
        isLive = true;
      }
    }

    if (records.length > 0) {
      // Map Agmarknet live API records
      let formattedRecords = records.map(rec => ({
        commodity: rec.commodity || commClean,
        marketName: rec.market || `${rec.district || 'Regional'} APMC`,
        state: rec.state || 'India',
        district: rec.district || distClean || 'Regional',
        minPrice: parseInt(rec.min_price) || 1500,
        maxPrice: parseInt(rec.max_price) || 2500,
        modalPrice: parseInt(rec.modal_price) || 2000,
        arrivalDate: rec.arrival_date || new Date().toLocaleDateString('en-IN'),
        fetchedAt: new Date()
      }));

      // Filter/Prioritize records matching requested commodity first
      if (commClean) {
        const commRegex = new RegExp(commClean, 'i');
        const commMatched = formattedRecords.filter(r => commRegex.test(r.commodity));
        if (commMatched.length > 0) {
          formattedRecords = commMatched;
        }
      }

      // Filter/Prioritize records matching requested district if applicable
      if (distClean) {
        const distRegex = new RegExp(distClean, 'i');
        const distMatched = formattedRecords.filter(r => distRegex.test(r.district) || distRegex.test(r.marketName));
        if (distMatched.length > 0) {
          formattedRecords = distMatched;
        }
      }

      // Asynchronously update MongoDB cache with real live data
      for (const rec of formattedRecords.slice(0, 10)) {
        MarketPriceCache.findOneAndUpdate(
          { commodity: rec.commodity, district: rec.district, marketName: rec.marketName },
          rec,
          { upsert: true }
        ).catch(err => console.error('[MarketPriceCache] DB update error:', err.message));
      }

      return {
        live: isLive,
        stale: false,
        count: formattedRecords.length,
        data: formattedRecords.slice(0, 10)
      };
    } else {
      throw new Error('Agmarknet API returned 0 records');
    }
  } catch (error) {
    console.warn(`[mandiPriceService] Live API call failed (${error.message}). Falling back to cached MongoDB records...`);

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
        message: 'Serving cached mandi market prices due to live API timeout/error'
      };
    }

    return {
      live: false,
      stale: true,
      count: 0,
      data: [],
      message: 'No mandi records found for requested search'
    };
  }
};
