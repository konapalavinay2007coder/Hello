/**
 * Text-to-Speech (TTS) Utility
 * Combines backend MP3 audio streaming proxy with Web Speech API
 */

let activeAudio = null;
const rawUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

/**
 * Clean markdown symbols for smooth audio reading
 */
export const cleanTextForSpeech = (text = '') => {
  return text
    .replace(/[*#_`]/g, '') // remove markdown bold/headers
    .replace(/₹/g, 'रुपये ') // replace rupee symbol with word
    .replace(/\//g, ' या ') // replace slash with 'or'
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Play Speech Audio
 */
export const speakText = (text, language = 'hi', onStart = () => {}, onEnd = () => {}, onError = () => {}) => {
  stopSpeech();

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return;

  const isHindi = /[\u0900-\u097F]/.test(cleaned) || language === 'hi';
  const langCode = isHindi ? 'hi' : 'en';

  // Build backend TTS audio proxy stream URL
  const audioUrl = `${API_BASE_URL}/tts?text=${encodeURIComponent(cleaned.slice(0, 250))}&lang=${langCode}`;

  activeAudio = new Audio(audioUrl);

  activeAudio.onplay = () => {
    console.log('[TTS] Audio playback started');
    onStart();
  };

  activeAudio.onended = () => {
    console.log('[TTS] Audio playback finished');
    onEnd();
  };

  activeAudio.onerror = (e) => {
    console.warn('[TTS] Proxy audio error, trying WebSpeech API:', e);
    // Fallback to Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = isHindi ? 'hi-IN' : 'en-US';
      utterance.onstart = onStart;
      utterance.onend = onEnd;
      utterance.onerror = (err) => {
        onEnd();
        onError(err);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      onEnd();
      onError(e);
    }
  };

  activeAudio.play().catch(err => {
    console.warn('[TTS] Audio play error:', err.message);
    onEnd();
    onError(err);
  });
};

/**
 * Stop any active audio stream
 */
export const stopSpeech = () => {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
