import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

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

// Candidate Gemini models in order of priority
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

/**
 * Call Groq LLM API (llama-3.3-70b-versatile) as high-speed fallback
 */
const callGroqLLM = async (systemPrompt, userText) => {
  const groqApiKey = process.env.GROQ_API_KEY || process.env.TEXT_API;
  if (!groqApiKey) {
    throw new Error('GROQ_API_KEY or TEXT_API is not defined in environment variables');
  }

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    },
    {
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq LLM returned empty message content');
  }

  return { text: content, modelName: 'groq-llama-3.3-70b' };
};

/**
 * Execute generative model with automatic multi-model fallback across Gemini & Groq LLM
 */
const generateContentWithFallback = async (ai, prompt, userText) => {
  let lastError = null;

  // 1. Try Gemini API candidate models
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = ai.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim().length > 0) {
        return { text, modelName };
      }
    } catch (err) {
      console.warn(`[llmService] Gemini model ${modelName} failed (${err.message.slice(0, 80)}...). Trying next candidate model...`);
      lastError = err;
    }
  }

  // 2. Secondary: Groq LLM API Fallback (llama-3.3-70b-versatile)
  console.warn('[llmService] All Gemini models failed or rate-limited. Falling back to Groq LLM API (llama-3.3-70b)...');
  try {
    const groqResult = await callGroqLLM(prompt, userText);
    console.log('[llmService] Groq LLM successfully generated advisory response!');
    return groqResult;
  } catch (groqErr) {
    console.error('[llmService] Groq LLM API also failed:', groqErr.message);
    throw lastError || groqErr;
  }
};

/**
 * Core LLM Advisory Engine with Multi-Turn Conversation History
 */
export const generateAdvisory = async ({
  text,
  domain = 'agriculture',
  language = 'hi',
  context = {},
  history = []
}) => {
  try {
    const ai = getGenAIClient();

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
      contextSnippet += `\n--- GOVERNMENT SCHEMES & SCHOLARSHIPS CONTEXT ---\n`;
      context.schemesData.slice(0, 5).forEach(s => {
        contextSnippet += `- Scheme: ${s.name} | Eligibility: ${s.eligibilityText} | Benefit: ${s.benefitText} | Helpline: ${s.helplineNumber || 'N/A'}\n`;
      });
    }

    if (context.directoryData && context.directoryData.length > 0) {
      contextSnippet += `\n--- INFRASTRUCTURE & INSTITUTIONS CONTEXT ---\n`;
      context.directoryData.slice(0, 5).forEach(d => {
        contextSnippet += `- Institution: ${d.name} (${d.type}) | District: ${d.district} | Phone: ${d.phone || 'N/A'} | Address: ${d.address || 'N/A'}\n`;
      });
    }

    // Format multi-turn conversation history
    let historySnippet = '';
    if (history && history.length > 0) {
      historySnippet += `\n--- PREVIOUS CONVERSATION HISTORY ---\n`;
      history.slice(-8).forEach(msg => {
        historySnippet += `${msg.role === 'user' ? 'User' : 'Assistant'}: "${msg.content}"\n`;
      });
    }

    const langName = language === 'en' ? 'English' : language === 'mr' ? 'Marathi' : 'Hindi';

    const systemPrompt = `You are 'hello' (नमस्ते) — a warm, highly practical, voice-first rural AI advisor in India.
Your job is to provide clear, actionable, grounded answers for farmers, students, parents, and rural citizens.

MULTI-TURN CONVERSATION INSTRUCTIONS:
1. Examine the PREVIOUS CONVERSATION HISTORY below carefully. Identify what the user has ALREADY answered (e.g., branch/stream, score/percentile, location, crop).
2. DO NOT repeat any question that the user has already answered in the history!
3. If the user's latest response provides a missing detail (e.g. "Computer Engineering"), acknowledge it ("Great! For Computer Engineering..."), and ask ONLY the NEXT missing detail (e.g. "What is your MHT-CET score or percentile?").
4. If ALL required details have been gathered (or if enough context exists), provide the FINAL recommended list/advice and leave followUpQuestions empty [].
5. Respond STRICTLY in ${langName} language (Language code: ${language}).

Respond in valid JSON format matching this exact schema:
{
  "responseText": "Warm response text acknowledging progress in ${langName}...",
  "followUpQuestions": [
    "Next missing clarifying question in ${langName}?"
  ]
}

${historySnippet}
${contextSnippet}

USER LATEST INPUT: "${text}"
DOMAIN: ${domain.toUpperCase()}

JSON Output:`;

    const { text: rawText, modelName } = await generateContentWithFallback(ai, systemPrompt, text);

    let responseText = rawText;
    let followUpQuestions = [];

    try {
      const cleanedJson = rawText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);
      responseText = parsed.responseText || rawText;
      followUpQuestions = parsed.followUpQuestions || [];
    } catch (parseErr) {
      if (domain === 'education') {
        const lowerText = (text + ' ' + (historySnippet || '')).toLowerCase();
        if (lowerText.includes('computer') || lowerText.includes('engineering')) {
          if (!lowerText.includes('percentile') && !lowerText.includes('score') && !lowerText.includes('marks')) {
            followUpQuestions = language === 'en'
              ? ["What is your MHT-CET score or 12th Board percentage?"]
              : ["12वीं या MHT-CET में आपके कितने प्रतिशत अंक आए हैं?"];
          }
        }
      }
    }

    return {
      success: true,
      responseText,
      followUpQuestions,
      modelUsed: modelName
    };

  } catch (error) {
    console.error('[llmService] Advisory generation failed:', error.message);

    const isEn = language === 'en';
    let fallbackText = isEn 
      ? `Hello! Thank you for updating your ${domain} details.` 
      : `नमस्ते! अपने ${domain === 'agriculture' ? 'कृषि' : 'शिक्षा'} विवरण अपडेट करने के लिए धन्यवाद।`;

    let followUpQuestions = [];

    if (domain === 'education') {
      const lower = text.toLowerCase();
      if (lower.includes('computer') || lower.includes('engineering')) {
        fallbackText += isEn
          ? ` Great! For Computer Engineering admission, your MHT-CET percentile is the key factor.`
          : ` बहुत बढ़िया! कंप्यूटर इंजीनियरिंग दाखिले के लिए आपका MHT-CET पर्सेंटाइल महत्वपूर्ण है।`;
        
        followUpQuestions = isEn
          ? ["What is your MHT-CET score or 12th Board percentage?"]
          : ["12वीं या MHT-CET में आपकी कितनी पर्सेंटाइल आई है?"];
      }
    }

    return {
      success: false,
      responseText: fallbackText,
      followUpQuestions,
      modelUsed: 'local-fallback',
      error: error.message
    };
  }
};

/**
 * Multimodal Crop / Image Advisory Engine
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
1. Provide a clear, visual analysis of what is shown in the image.
2. Generate 2 to 3 clarifying follow-up questions to ask the user.
3. Provide 2 to 3 immediate actionable recommendations.
4. Respond in JSON format matching this structure:
{
  "analysisText": "Visual observation summary...",
  "followUpQuestions": ["Question 1?", "Question 2?"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Language for responses: ${language === 'en' ? 'English' : 'Hindi'}.
User optional note: "${text}"`;

    let parsedData = null;
    let modelUsedName = 'gemini-2.5-flash';

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = ai.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const rawText = response.text();
        const cleanedJson = rawText.replace(/```json|```/g, '').trim();
        parsedData = JSON.parse(cleanedJson);
        modelUsedName = modelName;
        break;
      } catch (err) {
        console.warn(`[llmService] Vision model ${modelName} failed (${err.message.slice(0, 80)}...). Trying next...`);
      }
    }

    if (!parsedData) {
      throw new Error('All vision models failed');
    }

    return {
      success: true,
      data: parsedData,
      modelUsed: modelUsedName
    };

  } catch (error) {
    console.error('[llmService] Gemini Vision API Error:', error.message);

    return {
      success: false,
      data: {
        analysisText: language === 'en'
          ? 'The photo shows symptoms of leaf yellowing and potential pest/deficiency issue.'
          : 'तस्वीर में फसल की पत्तियों पर पीलापन और कीट के लक्षण दिखाई दे रहे हैं।',
        followUpQuestions: language === 'en' ? [
          'How many days ago was irrigation done?',
          'Which fertilizer was applied recently?'
        ] : [
          'सिंचाई कितने दिन पहले की गई थी?',
          'कौन सा खाद हाल ही में डाला गया?'
        ],
        recommendations: language === 'en' ? [
          'Apply Neem Oil spray (5ml/liter).',
          'Maintain balanced soil moisture and contact Kisan Call Centre (1800-180-1551).'
        ] : [
          'नीम के तेल (Neem Oil 5ml/liter) का छिड़काव करें।',
          'किसान कॉल सेंटर 1800-180-1551 पर संपर्क करें।'
        ]
      },
      modelUsed: 'local-vision-fallback',
      error: error.message
    };
  }
};
