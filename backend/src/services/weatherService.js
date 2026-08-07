import axios from 'axios';
import { WeatherCache } from '../models/WeatherCache.js';

// Weather code interpretation helper
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

export const getWeather = async ({ lat = 27.2046, lng = 73.7417, locationKey = 'nagaur-rajasthan' }) => {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const locKey = locationKey.toLowerCase().trim();

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${parsedLat}&longitude=${parsedLng}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

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
      locationKey: locKey,
      lat: parsedLat,
      lng: parsedLng,
      tempC,
      condition,
      forecastSummary,
      fetchedAt: new Date()
    };

    // Update DB cache asynchronously
    WeatherCache.findOneAndUpdate(
      { locationKey: locKey },
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

    // Fallback to cached entry in MongoDB
    const cachedEntry = await WeatherCache.findOne({ locationKey: locKey }).sort({ fetchedAt: -1 });

    if (cachedEntry) {
      return {
        live: false,
        stale: true,
        data: cachedEntry,
        message: 'Serving cached weather data due to live API timeout/error'
      };
    }

    // Default static fallback if database cache is completely empty
    return {
      live: false,
      stale: true,
      data: {
        locationKey: locKey,
        lat: parsedLat,
        lng: parsedLng,
        tempC: 32,
        condition: 'Sunny (Default Fallback)',
        forecastSummary: 'Hot and dry. Light rain expected in 2 days.',
        fetchedAt: new Date(Date.now() - 3600 * 1000)
      },
      message: 'Serving default fallback weather data'
    };
  }
};
