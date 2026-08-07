import axios from 'axios';
import { WeatherCache } from '../models/WeatherCache.js';

// Coordinates lookup for common Indian districts
const DISTRICT_COORDINATES = {
  'nagaur': { lat: 27.2046, lng: 73.7417, name: 'Nagaur, Rajasthan' },
  'jaipur': { lat: 26.9124, lng: 75.7873, name: 'Jaipur, Rajasthan' },
  'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' },
  'nagpur': { lat: 21.1458, lng: 79.0882, name: 'Nagpur, Maharashtra' },
  'merta': { lat: 26.6482, lng: 74.0374, name: 'Merta, Rajasthan' },
  'jodhpur': { lat: 26.2389, lng: 73.0243, name: 'Jodhpur, Rajasthan' },
  'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
  'nashik': { lat: 20.0059, lng: 73.7898, name: 'Nashik, Maharashtra' },
  'solapur': { lat: 17.6599, lng: 75.9064, name: 'Solapur, Maharashtra' },
  'indore': { lat: 22.7196, lng: 75.8577, name: 'Indore, Madhya Pradesh' },
  'bhopal': { lat: 23.2599, lng: 77.4126, name: 'Bhopal, Madhya Pradesh' },
  'delhi': { lat: 28.6139, lng: 77.2090, name: 'Delhi' }
};

const getWeatherCondition = (code) => {
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Light / Moderate Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Clear';
};

export const getWeather = async ({ lat, lng, district = '', locationKey = '' }) => {
  let searchKey = (district || locationKey).toLowerCase().replace(/-rajasthan|-maharashtra/g, '').trim();
  let coords = DISTRICT_COORDINATES[searchKey];

  if (!coords) {
    // If explicit lat/lng provided, use them
    if (lat && lng) {
      coords = { lat: parseFloat(lat), lng: parseFloat(lng), name: searchKey || 'Regional Location' };
    } else {
      coords = DISTRICT_COORDINATES['nagaur']; // Default fallback
    }
  }

  const locKey = searchKey || 'nagaur';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    // 3-second timeout requirement
    const response = await axios.get(url, { timeout: 3000 });
    const current = response.data.current_weather;
    const daily = response.data.daily;

    const tempC = Math.round(current.temperature);
    const condition = getWeatherCondition(current.weathercode);
    const maxTemp = daily?.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : tempC + 4;
    const minTemp = daily?.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : tempC - 4;
    const precip = daily?.precipitation_sum?.[0] || 0;

    const forecastSummary = `Temp: ${minTemp}°C - ${maxTemp}°C. ${condition}. Rain: ${precip}mm.`;

    const weatherData = {
      locationKey: coords.name,
      lat: coords.lat,
      lng: coords.lng,
      tempC,
      condition,
      forecastSummary,
      fetchedAt: new Date()
    };

    // Update DB cache asynchronously
    WeatherCache.findOneAndUpdate(
      { locationKey: coords.name },
      weatherData,
      { upsert: true, new: true }
    ).catch(err => console.error('[WeatherCache] DB update error:', err.message));

    return {
      live: true,
      stale: false,
      data: weatherData
    };
  } catch (error) {
    console.warn(`[weatherService] Live API call failed (${error.message}). Falling back to MongoDB cache...`);

    const cachedEntry = await WeatherCache.findOne({ locationKey: new RegExp(locKey, 'i') }).sort({ fetchedAt: -1 });

    if (cachedEntry) {
      return {
        live: false,
        stale: true,
        data: cachedEntry,
        message: 'Serving cached weather data due to live API timeout/error'
      };
    }

    return {
      live: false,
      stale: true,
      data: {
        locationKey: coords.name,
        lat: coords.lat,
        lng: coords.lng,
        tempC: 30,
        condition: 'Partly Cloudy',
        forecastSummary: 'Temp: 25°C - 34°C. Partly Cloudy.',
        fetchedAt: new Date()
      },
      message: 'Serving default fallback weather data'
    };
  }
};
