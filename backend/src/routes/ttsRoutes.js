import express from 'express';
import axios from 'axios';

const router = express.Router();

// @route GET /api/tts
// @desc  Proxy Hindi / Regional Text-to-Speech MP3 audio stream to bypass browser CORS
router.get('/', async (req, res) => {
  try {
    const text = req.query.text ? req.query.text.trim() : '';
    const lang = req.query.lang || 'hi';

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text query param is required' });
    }

    // Truncate text to 200 chars per chunk for TTS
    const textChunk = text.slice(0, 200).replace(/[*#_`]/g, '');
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textChunk)}&tl=${lang}&client=tw-ob`;

    const response = await axios.get(ttsUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      timeout: 5000
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length,
      'Accept-Ranges': 'bytes'
    });

    res.status(200).send(Buffer.from(response.data));
  } catch (error) {
    console.error('[ttsRoute] Audio proxy error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate audio stream',
      error: error.message
    });
  }
});

export default router;
