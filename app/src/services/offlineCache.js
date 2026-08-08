const CACHE_KEY = 'hello_offline_cache';

const INITIAL_SEED_DATA = [
  {
    query: 'tomato price nagaur',
    response: 'Nagaur APMC में आज टमाटर का भाव ₹2,100 - ₹2,500 प्रति क्विंटल है। (Offline Cached Data)',
    sources: { mandi: true, weather: true }
  },
  {
    query: 'tomato price pune',
    response: 'Pune APMC में आज टमाटर का भाव ₹1,050 - ₹1,400 प्रति क्विंटल है। (Offline Cached Data)',
    sources: { mandi: true, weather: true }
  },
  {
    query: 'what to grow',
    response: 'इस सीजन में नागौर की 2 एकड़ जमीन के लिए मूंग दाल (MH 421) या बाजरा बोना सबसे फायदेमंद रहेगा।',
    sources: { schemes: true }
  },
  {
    query: 'pm kisan helpline',
    response: 'PM-KISAN टोल-फ्री हेल्पलाइन: 155261 या 1800-180-1551। पोर्टल: pmkisan.gov.in',
    sources: { schemes: true }
  },
  {
    query: 'engineering college pune',
    response: 'पुणे में MHT-CET के तहत COEP पुणे, PICT पुणे, और VIT पुणे मुख्य कॉलेज हैं। राजर्षि शाहू महाराज योजना से 50% फीस छूट मिलती है।',
    sources: { directory: true, schemes: true }
  }
];

export function initOfflineCache() {
  const existing = localStorage.getItem(CACHE_KEY);
  if (!existing) {
    localStorage.setItem(CACHE_KEY, JSON.stringify(INITIAL_SEED_DATA));
  }
}

export function getCachedResponse(userQuery) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : INITIAL_SEED_DATA;

    const cleanQuery = userQuery.toLowerCase().trim();
    
    // Fuzzy matching against cached queries
    const match = cache.find(item => {
      const words = item.query.toLowerCase().split(' ');
      return words.some(w => w.length > 3 && cleanQuery.includes(w));
    });

    if (match) {
      return {
        found: true,
        responseText: match.response,
        cachedAt: new Date().toLocaleTimeString()
      };
    }
  } catch (err) {
    console.error('[offlineCache] Read error:', err);
  }

  return {
    found: false,
    responseText: '📶 आप ऑफलाइन मोड में हैं। इस विशिष्ट प्रश्न के लिए इंटरनेट कनेक्शन आवश्यक है। लेकिन आप मंडी भाव और पीएम-किसान हेल्पलाइन पूछ सकते हैं।'
  };
}

export function saveToCache(userQuery, responseText) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : INITIAL_SEED_DATA;

    cache.unshift({
      query: userQuery,
      response: responseText,
      timestamp: Date.now()
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache.slice(0, 50)));
  } catch (err) {
    console.error('[offlineCache] Save error:', err);
  }
}
