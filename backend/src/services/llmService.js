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
    
    // Use gemini-1.5-flash (or fallback model)
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
      modelUsed: 'gemini-1.5-flash'
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
