import { maskSensitiveData } from '../services/privacyMaskService.js';
import { enhancePrompt } from '../services/promptEnhanceService.js';
import { getMandiPrices } from '../services/mandiPriceService.js';
import { getWeather } from '../services/weatherService.js';
import { Scheme } from '../models/Scheme.js';
import { generateAdvisory } from '../services/llmService.js';
import { Query } from '../models/Query.js';

/**
 * POST /api/query
 * Main Advisory Orchestration Endpoint
 * Body: { text, domain, language, location: { district, state, lat, lng }, userId }
 */
export const handleQuery = async (req, res) => {
  try {
    const {
      text = '',
      domain = 'agriculture',
      language = 'hi',
      location = {},
      userId = 'anonymous_user'
    } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query text is required'
      });
    }

    const rawText = text.trim();
    const targetDomain = domain.toLowerCase();

    // 1. Privacy Masking Layer
    const { maskedText, privacyMasked, details } = maskSensitiveData(rawText);

    // 2. Prompt Enhancement Layer
    const enhanced = enhancePrompt(maskedText, targetDomain);

    // 3. Context Retrieval (Mandi, Weather, Schemes)
    const district = location.district || 'Nagaur';
    const state = location.state || 'Rajasthan';
    const lat = location.lat || 27.2046;
    const lng = location.lng || 73.7417;

    // Detect commodity from text or fallback
    let commodity = 'Tomato';
    if (/आलू|potato/i.test(maskedText)) commodity = 'Potato';
    else if (/प्याज़|प्याज|onion/i.test(maskedText)) commodity = 'Onion';
    else if (/गेहूं|wheat/i.test(maskedText)) commodity = 'Wheat';
    else if (/मूंग|moong|gram/i.test(maskedText)) commodity = 'Moong(Green Gram)';

    const [mandiRes, weatherRes, schemesData] = await Promise.all([
      getMandiPrices({ commodity, district, state }).catch(() => ({ data: [] })),
      getWeather({ lat, lng, locationKey: `${district.toLowerCase()}-${state.toLowerCase()}` }).catch(() => ({ data: null })),
      Scheme.find({ domain: new RegExp(`^${targetDomain}$`, 'i') }).limit(3).catch(() => [])
    ]);

    const contextPayload = {
      mandiData: mandiRes.data || [],
      weatherData: weatherRes.data || null,
      schemesData: schemesData || []
    };

    // 4. LLM Advisory Generation (Gemini API)
    const llmResult = await generateAdvisory({
      text: maskedText,
      domain: targetDomain,
      language,
      context: contextPayload
    });

    // 5. Store Query in MongoDB
    const queryDoc = await Query.create({
      userId,
      domain: targetDomain,
      inputType: 'text',
      originalText: rawText,
      maskedText,
      privacyMasked,
      enhancedPrompt: enhanced,
      detectedLanguage: language,
      responseText: llmResult.responseText,
      sources: {
        mandi: contextPayload.mandiData,
        weather: contextPayload.weatherData,
        schemes: contextPayload.schemesData
      },
      wasOffline: false
    });

    // 6. Return response payload
    res.status(200).json({
      success: true,
      queryId: queryDoc._id,
      originalText: rawText,
      maskedText,
      privacyMasked,
      privacyMaskDetails: details,
      enhancedPrompt: enhanced,
      domain: targetDomain,
      detectedLanguage: language,
      responseText: llmResult.responseText,
      modelUsed: llmResult.modelUsed,
      sources: {
        mandi: contextPayload.mandiData,
        weather: contextPayload.weatherData,
        schemes: contextPayload.schemesData
      }
    });

  } catch (error) {
    console.error('[queryController] Advisory processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process advisory query',
      error: error.message
    });
  }
};
