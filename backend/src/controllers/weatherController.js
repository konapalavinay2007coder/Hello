import { getWeather } from '../services/weatherService.js';

/**
 * GET /api/weather
 * Query Params:
 *  - lat: latitude (default 27.2046)
 *  - lng: longitude (default 73.7417)
 *  - locationKey: e.g. nagaur-rajasthan
 */
export const getWeatherInfo = async (req, res) => {
  try {
    const { lat, lng, locationKey } = req.query;
    const result = await getWeather({ lat, lng, locationKey });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[weatherController] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve weather data',
      error: error.message
    });
  }
};
