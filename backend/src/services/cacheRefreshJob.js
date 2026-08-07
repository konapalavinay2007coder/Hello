import cron from 'node-cron';
import { getWeather } from './weatherService.js';
import { getMandiPrices } from './mandiPriceService.js';

// Fixed list of demo locations for weather caching
const DEMO_LOCATIONS = [
  { locationKey: 'nagaur-rajasthan', lat: 27.2046, lng: 73.7417 },
  { locationKey: 'jaipur-rajasthan', lat: 26.9124, lng: 75.7873 },
  { locationKey: 'pune-maharashtra', lat: 18.5204, lng: 73.8567 },
  { locationKey: 'merta-rajasthan', lat: 26.6482, lng: 74.0374 }
];

// Fixed list of demo commodities/districts for mandi price caching
const DEMO_COMMODITIES = [
  { commodity: 'Tomato', district: 'Nagaur', state: 'Rajasthan' },
  { commodity: 'Potato', district: 'Jaipur', state: 'Rajasthan' },
  { commodity: 'Onion', district: 'Pune', state: 'Maharashtra' },
  { commodity: 'Wheat', district: 'Nagaur', state: 'Rajasthan' },
  { commodity: 'Moong(Green Gram)', district: 'Nagaur', state: 'Rajasthan' }
];

// Execute a single refresh pass across all demo targets
export const runCacheRefresh = async () => {
  console.log(`[CacheRefreshJob] Starting scheduled cache refresh at ${new Date().toISOString()}...`);

  // Refresh Weather Cache
  for (const loc of DEMO_LOCATIONS) {
    try {
      const res = await getWeather(loc);
      console.log(`[CacheRefreshJob] Weather updated for ${loc.locationKey}: ${res.live ? 'LIVE' : 'CACHED/FALLBACK'}`);
    } catch (err) {
      console.error(`[CacheRefreshJob] Weather refresh failed for ${loc.locationKey}:`, err.message);
    }
  }

  // Refresh Mandi Prices Cache
  for (const item of DEMO_COMMODITIES) {
    try {
      const res = await getMandiPrices(item);
      console.log(`[CacheRefreshJob] Mandi prices updated for ${item.commodity} (${item.district}): ${res.live ? 'LIVE' : 'CACHED/FALLBACK'} (${res.count} records)`);
    } catch (err) {
      console.error(`[CacheRefreshJob] Mandi price refresh failed for ${item.commodity}:`, err.message);
    }
  }

  console.log(`[CacheRefreshJob] Cache refresh pass completed.`);
};

// Initialize cron schedule (Every 15 minutes)
export const initCacheRefreshJob = () => {
  console.log('[CacheRefreshJob] Initializing 15-minute scheduled cache refresh job...');

  // Schedule task every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    runCacheRefresh();
  });

  // Run immediate initial warm-up pass after 5 seconds
  setTimeout(() => {
    console.log('[CacheRefreshJob] Running immediate startup cache warm-up...');
    runCacheRefresh();
  }, 5000);
};
