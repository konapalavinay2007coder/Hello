import { getMandiPrices } from '../services/mandiPriceService.js';

/**
 * GET /api/mandi-prices
 * Query Params:
 *  - commodity: crop name (e.g. Tomato, Potato, Onion, Wheat)
 *  - district: district name (e.g. Nagaur, Jaipur, Pune)
 *  - state: state name (e.g. Rajasthan, Maharashtra)
 */
export const getMandiPriceInfo = async (req, res) => {
  try {
    const { commodity, district, state } = req.query;
    const result = await getMandiPrices({ commodity, district, state });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[mandiController] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mandi market prices',
      error: error.message
    });
  }
};
