import { maskSensitiveData } from '../services/privacyMaskService.js';
import { enhancePrompt } from '../services/promptEnhanceService.js';
import { getMandiPrices } from '../services/mandiPriceService.js';
import { getWeather } from '../services/weatherService.js';
import { Scheme } from '../models/Scheme.js';
import { Directory } from '../models/Directory.js';
import { generateAdvisory, generateVisionAdvisory } from '../services/llmService.js';
import { transcribeAudio } from '../services/speechService.js';
import { Query } from '../models/Query.js';

/**
 * Handles incoming query requests (Text or Audio FormData)
 */
export const handleQuery = async (req, res) => {
  try {
    let rawText = req.body.text || '';
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

    const userId = req.body.userId || 'anonymous_user';

    // Auto-detect domain from user's query text
    const detectDomain = (text) => {
      const lower = text.toLowerCase();
      
      // Education keywords (Hindi, English, Marathi)
      if (/college|school|admission|scholarship|exam|student|degree|university|engineering|medical|board|marks|percentile|12th|10th|jee|neet|mht-cet|प्रवेश|स्कूल|कॉलेज|विद्यार्थी|पढ़ाई|शिक्षा|परीक्षा|छात्रवृत्ति|डिग्री|शाळा|महाविद्यालय|विद्यापीठ|प्रवेश परीक्षा/.test(lower)) {
        return 'education';
      }
      
      // Business / Schemes keywords
      if (/loan|mudra|business|startup|entrepreneur|capital|investment|msme|subsidy|registration|gst|udyam|scheme|pmegp|लोन|व्यापार|व्यवसाय|उद्यमी|पूंजी|निवेश|योजना|सब्सिडी|कर्ज|उद्योग/.test(lower)) {
        return 'schemes';
      }
      
      // Dairy keywords
      if (/dairy|milk|cattle|buffalo|cow|दूध|गाय|भैंस|डेयरी|पशुपालन|चारा|दुग्ध|गुरे|म्हैस/.test(lower)) {
        return 'dairy';
      }
      
      // Default to agriculture (farming, mandi, crops, weather)
      return 'agriculture';
    };

    const domain = detectDomain(rawText);

    // Auto-detect language from user's input text
    const detectLanguage = (text) => {
      const devanagariChars = (text.match(/[\u0900-\u097F]/g) || []).length;
      const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
      const totalChars = devanagariChars + latinChars;
      
      if (totalChars === 0) return 'en'; // fallback to English
      
      // If mostly Devanagari script
      if (devanagariChars > latinChars) {
        // Check for Marathi-specific words
        const marathiMarkers = /माझ|आहे|करा|कसे|काय|शेती|विद्यार्थी|व्यवसाय|मला|तुम्ही|आम्ही|हवे|पाहिजे|कोणत|जिल्हा/i;
        if (marathiMarkers.test(text)) return 'mr';
        return 'hi';
      }
      
      return 'en';
    };

    const language = detectLanguage(rawText);

    let location = {};
    if (req.body.location) {
      try {
        location = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;
      } catch (e) {
        location = {};
      }
    }

    let history = [];
    if (req.body.history) {
      try {
        history = typeof req.body.history === 'string' ? JSON.parse(req.body.history) : req.body.history;
      } catch (e) {
        history = [];
      }
    }

    // 1. Privacy Masking Layer
    const { maskedText, privacyMasked, note, details } = maskSensitiveData(rawText);

    // 2. Prompt Enhancement Layer
    const enhanced = enhancePrompt(maskedText, domain);

    // 3. Dynamic Location & Commodity Extraction
    let targetDistrict = location.district || '';
    if (/pune|पुणे/i.test(maskedText)) targetDistrict = 'Pune';
    else if (/nagpur|नागपुर/i.test(maskedText)) targetDistrict = 'Nagpur';
    else if (/jaipur|जयपुर/i.test(maskedText)) targetDistrict = 'Jaipur';
    else if (/jodhpur|जोधपुर/i.test(maskedText)) targetDistrict = 'Jodhpur';
    else if (/merta|मेड़ता/i.test(maskedText)) targetDistrict = 'Merta';
    else if (/nagaur|नागौर/i.test(maskedText)) targetDistrict = 'Nagaur';
    else if (/mumbai|मुंबई/i.test(maskedText)) targetDistrict = 'Mumbai';
    else if (/nashik|नासिक/i.test(maskedText)) targetDistrict = 'Nashik';
    else if (/solapur|सोलापुर/i.test(maskedText)) targetDistrict = 'Solapur';
    else if (/indore|इंदौर/i.test(maskedText)) targetDistrict = 'Indore';
    else if (/bhopal|भोपाल/i.test(maskedText)) targetDistrict = 'Bhopal';
    else if (/delhi|दिल्ली/i.test(maskedText)) targetDistrict = 'Delhi';

    if (!targetDistrict) {
      targetDistrict = 'Nagaur';
    }

    const state = /pune|nagpur|mumbai|nashik|solapur/i.test(targetDistrict) ? 'Maharashtra' : 'Rajasthan';

    // Detect commodity from query text
    let commodity = 'Tomato';
    if (/आलू|potato/i.test(maskedText)) commodity = 'Potato';
    else if (/प्याज़|प्याज|onion/i.test(maskedText)) commodity = 'Onion';
    else if (/गेहूं|wheat/i.test(maskedText)) commodity = 'Wheat';
    else if (/मूंग|moong|gram/i.test(maskedText)) commodity = 'Moong(Green Gram)';
    else if (/कपास|cotton/i.test(maskedText)) commodity = 'Cotton';
    else if (/चना|chana/i.test(maskedText)) commodity = 'Chana';
    else if (/चावल|rice|paddy/i.test(maskedText)) commodity = 'Rice';
    else if (/सरसों|mustard/i.test(maskedText)) commodity = 'Mustard';
    else if (/सोयाबीन|soyabean/i.test(maskedText)) commodity = 'Soyabean';
    else if (/मक्का|maize|corn/i.test(maskedText)) commodity = 'Maize';
    else if (/टमाटर|tomato/i.test(maskedText)) commodity = 'Tomato';

    // Domain-Specific Context Retrieval
    let mandiData = [];
    let weatherData = null;
    let schemesData = [];
    let directoryData = [];

    if (domain === 'agriculture' || domain === 'dairy') {
      const [mandiRes, weatherRes, schemes] = await Promise.all([
        getMandiPrices({ commodity, district: targetDistrict, state }).catch(() => ({ data: [] })),
        getWeather({ district: targetDistrict, locationKey: targetDistrict }).catch(() => ({ data: null })),
        Scheme.find({ domain: new RegExp(`^${domain}$`, 'i') }).limit(3).catch(() => [])
      ]);
      mandiData = mandiRes.data || [];
      weatherData = weatherRes.data || null;
      schemesData = schemes || [];
    } else if (domain === 'education') {
      const [schemes, directory] = await Promise.all([
        Scheme.find({ domain: /education|schemes/i }).limit(4).catch(() => []),
        Directory.find({ type: /college|school|csc/i }).limit(4).catch(() => [])
      ]);
      schemesData = schemes || [];
      directoryData = directory || [];
    } else {
      const [schemes, directory] = await Promise.all([
        Scheme.find({}).limit(4).catch(() => []),
        Directory.find({}).limit(4).catch(() => [])
      ]);
      schemesData = schemes || [];
      directoryData = directory || [];
    }

    const contextPayload = {
      mandiData,
      weatherData,
      schemesData,
      directoryData
    };

    // 4. LLM Advisory Generation (Gemini API / Groq LLM with conversation history)
    const llmResult = await generateAdvisory({
      text: maskedText,
      domain,
      language,
      context: contextPayload,
      history
    });

    // 5. Async Audit Logging to MongoDB
    const queryDoc = await Query.create({
      userId,
      originalText: rawText,
      maskedText,
      privacyMasked,
      enhancedPrompt: enhanced,
      domain,
      inputType,
      asrProvider,
      responseText: llmResult.responseText,
      modelUsed: llmResult.modelUsed,
      location: { district: targetDistrict, state }
    }).catch(err => {
      console.error('[Query] Failed to log query:', err.message);
      return { _id: 'unlogged' };
    });

    // 6. Return response payload
    res.status(200).json({
      success: true,
      queryId: queryDoc._id,
      inputType,
      transcript: rawText,
      asrProvider,
      originalText: rawText,
      maskedText,
      privacyMasked,
      privacyNote: note,
      privacyMaskDetails: details,
      enhancedPrompt: enhanced,
      domain,
      detectedLanguage: language,
      responseText: llmResult.responseText,
      followUpQuestions: llmResult.followUpQuestions || [],
      referenceLink: llmResult.referenceLink || null,
      modelUsed: llmResult.modelUsed,
      sources: {
        mandi: contextPayload.mandiData,
        weather: contextPayload.weatherData,
        schemes: contextPayload.schemesData,
        directory: contextPayload.directoryData
      }
    });
  } catch (error) {
    console.error('[queryController] Query handling failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process query',
      error: error.message
    });
  }
};

/**
 * Handles incoming crop image / photo analysis queries (POST /api/query/image)
 */
export const handleImageQuery = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'An image file upload is required for image query'
      });
    }

    const userText = req.body.text || '';
    
    // 1. Privacy Masking Layer for user input text
    const { maskedText, privacyMasked: textMasked, note: textNote, details: textDetails } = maskSensitiveData(userText);

    // Auto-detect language
    const language = req.body.language || 'en';
    const domain = (req.body.domain || 'agriculture').toLowerCase();

    const visionResult = await generateVisionAdvisory({
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      text: maskedText,
      domain,
      language
    });

    const isPrivacyProtected = textMasked || visionResult.data.privacyMasked || /adhar|aadhaar|id card|identity|आधार/i.test(userText);
    const privacyNote = visionResult.data.privacyNote || textNote || '🔒 Privacy Protection Active: 12-Digit Aadhaar sequence and personal credentials masked for security.';

    let referenceLink = visionResult.data.referenceLink || null;
    if (!referenceLink && (isPrivacyProtected || /adhar|aadhaar|id card|identity|uidai|आधार/i.test(userText))) {
      referenceLink = {
        title: language === 'en' ? '💳 UIDAI Official Aadhaar Sample & Verification Portal' : '💳 UIDAI आधार कार्ड आधिकारिक पोर्टल एवं सैंपल',
        url: 'https://uidai.gov.in',
        description: language === 'en'
          ? 'View official UIDAI Aadhaar Card sample layout, security features, e-Aadhaar PDF sample, and online verification services on the official portal.'
          : 'UIDAI आधार कार्ड का आधिकारिक लेआउट, e-Aadhaar सैंपल और डाउनलोड सेवाएँ देखने के लिए यहाँ क्लिक करें।'
      };
    }

    res.status(200).json({
      success: visionResult.success,
      domain,
      language,
      analysisText: visionResult.data.analysisText,
      followUpQuestions: visionResult.data.followUpQuestions || [],
      recommendations: visionResult.data.recommendations || [],
      privacyMasked: isPrivacyProtected,
      privacyNote: privacyNote,
      privacyMaskDetails: textDetails.length > 0 ? textDetails : ['aadhaar'],
      referenceLink: referenceLink,
      modelUsed: visionResult.modelUsed
    });
  } catch (error) {
    console.error('[queryController] Image query handling failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process image query',
      error: error.message
    });
  }
};
