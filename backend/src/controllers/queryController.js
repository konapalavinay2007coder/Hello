import { maskSensitiveData } from '../services/privacyMaskService.js';
import { enhancePrompt } from '../services/promptEnhanceService.js';
import { getMandiPrices } from '../services/mandiPriceService.js';
import { getWeather } from '../services/weatherService.js';
import { Scheme } from '../models/Scheme.js';
import { generateAdvisory, generateVisionAdvisory } from '../services/llmService.js';
import { transcribeAudio } from '../services/speechService.js';
import { Query } from '../models/Query.js';

/**
 * POST /api/query
 * Main Advisory Orchestration Endpoint
 * Supports both JSON text payload AND Multipart Audio file upload (via req.file)
 */
export const handleQuery = async (req, res) => {
  try {
    let rawText = req.body.text ? req.body.text.trim() : '';
    let inputType = 'text';
    let asrProvider = null;

    // Check if audio file was uploaded
    if (req.file) {
      inputType = 'voice';
      const asrResult = await transcribeAudio({
        audioBuffer: req.file.buffer,
        mimeType: req.file.mimetype,
        language: req.body.language || 'hi'
      });
      rawText = asrResult.text;
      asrProvider = asrResult.provider;
    }

    if (!rawText || rawText.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query text or audio file is required'
      });
    }

    const domain = (req.body.domain || 'agriculture').toLowerCase();
    const language = req.body.language || 'hi';
    const userId = req.body.userId || 'anonymous_user';

    let location = {};
    if (req.body.location) {
      try {
        location = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;
      } catch (e) {
        location = {};
      }
    }

    // 1. Privacy Masking Layer
    const { maskedText, privacyMasked, note, details } = maskSensitiveData(rawText);

    // 2. Prompt Enhancement Layer
    const enhanced = enhancePrompt(maskedText, domain);

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
      Scheme.find({ domain: new RegExp(`^${domain}$`, 'i') }).limit(3).catch(() => [])
    ]);

    const contextPayload = {
      mandiData: mandiRes.data || [],
      weatherData: weatherRes.data || null,
      schemesData: schemesData || []
    };

    // 4. LLM Advisory Generation (Gemini API)
    const llmResult = await generateAdvisory({
      text: maskedText,
      domain,
      language,
      context: contextPayload
    });

    // 5. Store Query in MongoDB
    const queryDoc = await Query.create({
      userId,
      domain,
      inputType,
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
      inputType,
      transcript: inputType === 'voice' ? rawText : undefined,
      asrProvider: asrProvider || undefined,
      originalText: rawText,
      maskedText,
      privacyMasked,
      privacyNote: note,
      privacyMaskDetails: details,
      enhancedPrompt: enhanced,
      domain,
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

/**
 * POST /api/query/image
 * Multimodal Crop Photo Vision Analysis Endpoint
 */
export const handleImageQuery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const {
      text = '',
      domain = 'agriculture',
      language = 'hi',
      userId = 'anonymous_user'
    } = req.body;

    const visionResult = await generateVisionAdvisory({
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      text,
      domain: domain.toLowerCase(),
      language
    });

    const advisoryData = visionResult.data;

    // Save query to MongoDB
    const queryDoc = await Query.create({
      userId,
      domain: domain.toLowerCase(),
      inputType: 'image',
      originalText: text || 'Photo crop analysis',
      maskedText: text || 'Photo crop analysis',
      privacyMasked: false,
      enhancedPrompt: `Multimodal crop photo analysis for domain: ${domain}`,
      detectedLanguage: language,
      responseText: advisoryData.analysisText,
      wasOffline: false
    });

    res.status(200).json({
      success: true,
      queryId: queryDoc._id,
      analysisText: advisoryData.analysisText,
      followUpQuestions: advisoryData.followUpQuestions,
      recommendations: advisoryData.recommendations,
      modelUsed: visionResult.modelUsed
    });

  } catch (error) {
    console.error('[queryController] Vision processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process image advisory',
      error: error.message
    });
  }
};
