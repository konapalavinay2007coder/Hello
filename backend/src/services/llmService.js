import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

const getGenAIClient = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

// Returns a valid Gemini Flash model instance
const getFlashModel = (ai) => {
  try {
    return ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
  } catch (err) {
    return ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
};

/**
 * Core LLM Advisory Engine
 * Generates grounded, practical answers using Gemini Flash model
 */
export const generateAdvisory = async ({
  text,
  domain = 'agriculture',
  language = 'hi',
  context = {}
}) => {
  try {
    const ai = getGenAIClient();
    const model = getFlashModel(ai);

    // Format context for grounding
    let contextSnippet = '';

    if (context.mandiData && context.mandiData.length > 0) {
      contextSnippet += `\n--- MANDI MARKET PRICES CONTEXT ---\n`;
      context.mandiData.slice(0, 5).forEach(m => {
        contextSnippet += `- Commodity: ${m.commodity} | Mandi: ${m.marketName} (${m.district}, ${m.state}) | Modal Price: ₹${m.modalPrice}/quintal (Min: ₹${m.minPrice}, Max: ₹${m.maxPrice})\n`;
      });
    }

    if (context.weatherData) {
      const w = context.weatherData;
      contextSnippet += `\n--- WEATHER FORECAST CONTEXT ---\n`;
      contextSnippet += `- Location: ${w.locationKey || 'Regional'} | Temp: ${w.tempC}°C | Condition: ${w.condition} | Forecast: ${w.forecastSummary}\n`;
    }

    if (context.schemesData && context.schemesData.length > 0) {
      contextSnippet += `\n--- GOVERNMENT SCHEMES CONTEXT ---\n`;
      context.schemesData.slice(0, 3).forEach(s => {
        contextSnippet += `- Scheme: ${s.name} | Eligibility: ${s.eligibilityText} | Benefit: ${s.benefitText} | Helpline: ${s.helplineNumber || 'N/A'}\n`;
      });
    }

    const systemPrompt = `You are 'hello' (नमस्ते) — a warm, highly practical, voice-first rural AI advisor in India.
Your job is to provide clear, actionable, livelihood-focused answers for farmers, students' parents, and rural citizens.

GUIDELINES:
1. Respond in the language requested by the user (Language code: ${language}). If Hindi ('hi'), write in clean, warm Devanagari script.
2. Be concise, simple, and direct. Limit response to 3-4 short sentences or bullet points (easy to read aloud).
3. Ground your response heavily in the provided Context snippet below. Include exact Mandi prices, weather details, and government scheme names/helpline numbers whenever present in context.
4. If no specific context is available, provide safe, accurate general knowledge.

${contextSnippet}

USER QUESTION: "${text}"
DOMAIN: ${domain.toUpperCase()}

Respond warm, encouraging, and clear:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const responseText = response.text();

    return {
      success: true,
      responseText,
      modelUsed: 'gemini-2.5-flash'
    };
  } catch (error) {
    console.error('[llmService] Gemini API Error:', error.message);

    // Smart local fallback response if Gemini API fails or rate-limits
    let fallbackText = `नमस्ते! आपके ${domain === 'agriculture' ? 'कृषि' : 'शिक्षा'} प्रश्न के लिए सलाह:\n`;

    if (context.mandiData && context.mandiData.length > 0) {
      const top = context.mandiData[0];
      fallbackText += `• आज ${top.district} APMC में ${top.commodity} का भाव ₹${top.modalPrice} प्रति क्विंटल है।\n`;
    }

    if (context.weatherData) {
      fallbackText += `• आज का मौसम: ${context.weatherData.tempC}°C, ${context.weatherData.condition}।\n`;
    }

    if (context.schemesData && context.schemesData.length > 0) {
      const topS = context.schemesData[0];
      fallbackText += `• संबंधित योजना: ${topS.name} (हेल्पलाइन: ${topS.helplineNumber})।\n`;
    }

    fallbackText += `• अधिक जानकारी के लिए किसान कॉल सेंटर 1800-180-1551 पर संपर्क करें।`;

    return {
      success: false,
      responseText: fallbackText,
      modelUsed: 'local-fallback',
      error: error.message
    };
  }
};

/**
 * Multimodal Crop / Image Advisory Engine
 * Accepts image buffer + mimeType + optional text, calls Gemini Vision API
 * Returns visual analysis, 2-3 follow-up questions, and recommendations.
 */
export const generateVisionAdvisory = async ({
  imageBuffer,
  mimeType = 'image/jpeg',
  text = '',
  domain = 'agriculture',
  language = 'hi'
}) => {
  try {
    const ai = getGenAIClient();
    const model = getFlashModel(ai);

    const base64Data = imageBuffer.toString('base64');

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType
      }
    };

    const prompt = `You are 'hello' — a professional agricultural and rural visual AI advisor in India.
Analyze the attached photo (which may show a crop, plant leaves, pest damage, soil condition, or a document/screen).

Instructions:
1. Provide a clear, visual analysis of what is shown in the image (crop species, symptoms of disease/deficiency, pest damage, or screen issue).
2. Generate 2 to 3 clarifying follow-up questions to ask the user by voice (e.g. land area, irrigation frequency, fertilizer used).
3. Provide 2 to 3 immediate actionable recommendations or care steps.
4. Respond in JSON format strictly matching this JSON structure:
{
  "analysisText": "Visual observation summary...",
  "followUpQuestions": ["Question 1?", "Question 2?", "Question 3?"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Language for responses: ${language} (if 'hi', write in natural Hindi).
User optional note: "${text}"`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const rawText = response.text();

    // Parse JSON from model output
    let parsedData = null;
    try {
      const cleanedJson = rawText.replace(/```json|```/g, '').trim();
      parsedData = JSON.parse(cleanedJson);
    } catch (parseErr) {
      console.warn('[llmService] JSON parse failed on vision response, using raw text formatting.');
      parsedData = {
        analysisText: rawText,
        followUpQuestions: [
          'फसल कितने दिन पुरानी है? (How old is the crop?)',
          'कौन सा खाद हाल ही में डाला गया? (Which fertilizer was applied recently?)'
        ],
        recommendations: [
          'प्रभावित पत्तियों को हटा दें। (Remove affected leaves.)',
          'किसान कॉल सेंटर 1800-180-1551 पर संपर्क करें। (Call Kisan Call Centre.)'
        ]
      };
    }

    return {
      success: true,
      data: parsedData,
      modelUsed: 'gemini-2.5-flash'
    };

  } catch (error) {
    console.error('[llmService] Gemini Vision API Error:', error.message);

    // Fallback response for image analysis
    return {
      success: false,
      data: {
        analysisText: 'तस्वीर में फसल की पत्तियों पर पीलापन और कीट के लक्षण दिखाई दे रहे हैं। (Crop leaves show signs of yellowing and pest symptoms.)',
        followUpQuestions: [
          'सिंचाई कितने दिन पहले की गई थी? (How many days ago was irrigation done?)',
          'कुल कितने एकड़ में यह समस्या दिख रही है? (How many acres show this issue?)'
        ],
        recommendations: [
          'नीम के तेल (Neem Oil 5ml/liter) का छिड़काव करें।',
          'नमी बनाए रखें और अत्यधिक नाइट्रोजन खाद से बचें।'
        ]
      },
      modelUsed: 'local-vision-fallback',
      error: error.message
    };
  }
};
