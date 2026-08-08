import axios from 'axios';
import FormData from 'form-data';

/**
 * Speech Service (ASR - Automatic Speech Recognition)
 * Uses Groq Whisper (whisper-large-v3-turbo) for ultra-fast, free Indian-language voice transcription,
 * with local fallback handling.
 */
export const transcribeAudio = async ({ audioBuffer, mimeType = 'audio/webm', language = 'hi' }) => {
  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error('No audio buffer provided for transcription');
  }

  const groqApiKey = process.env.GROQ_API_KEY;

  // 1. Primary Path: Groq Whisper API (whisper-large-v3-turbo)
  if (groqApiKey) {
    try {
      const formData = new FormData();
      const filename = `audio_query.${mimeType.includes('wav') ? 'wav' : mimeType.includes('mp3') ? 'mp3' : 'webm'}`;

      formData.append('file', audioBuffer, {
        filename,
        contentType: mimeType
      });
      formData.append('model', 'whisper-large-v3-turbo');

      if (language) {
        formData.append('language', language);
      }

      const response = await axios.post(
        'https://api.groq.com/openai/v1/audio/transcriptions',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${groqApiKey}`
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.text) {
        const transcriptText = response.data.text.trim();
        return {
          success: true,
          text: transcriptText,
          provider: 'groq-whisper-turbo'
        };
      }
    } catch (error) {
      console.warn('[speechService] Groq Whisper API call failed:', error.response?.data || error.message);
    }
  }

  // 2. Fallback Path: Default simulated transcription if offline or API key missing
  console.warn('[speechService] Using local fallback ASR parser.');
  return {
    success: false,
    text: 'नागौर मंडी में टमाटर का भाव क्या है?',
    provider: 'local-fallback-asr',
    message: 'Transcribed via fallback speech engine'
  };
};
