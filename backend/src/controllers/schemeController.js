import { Scheme } from '../models/Scheme.js';

/**
 * GET /api/schemes
 * Query Params:
 *  - domain: filter by domain (e.g. agriculture, education, schemes, dairy)
 *  - search: keyword search in name, eligibilityText, benefitText
 *  - lang / language: optional language key (e.g. hi, mr) to return translated fields if available
 */
export const getSchemes = async (req, res) => {
  try {
    const { domain, search, lang, language } = req.query;
    const filter = {};

    // Filter by domain
    if (domain) {
      filter.domain = new RegExp(`^${domain.trim()}$`, 'i');
    }

    // Keyword search
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { eligibilityText: searchRegex },
        { benefitText: searchRegex }
      ];
    }

    const schemes = await Scheme.find(filter).sort({ createdAt: -1 });

    const targetLang = (lang || language || '').toLowerCase();

    // Map localized content if requested and present
    const formattedData = schemes.map(scheme => {
      const obj = scheme.toObject();
      if (targetLang && obj.translations && obj.translations[targetLang]) {
        const trans = obj.translations[targetLang];
        return {
          ...obj,
          name: trans.name || obj.name,
          eligibilityText: trans.eligibilityText || obj.eligibilityText,
          benefitText: trans.benefitText || obj.benefitText,
          activeLanguage: targetLang
        };
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      count: formattedData.length,
      data: formattedData
    });
  } catch (error) {
    console.error('[schemeController] Error fetching schemes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch government schemes',
      error: error.message
    });
  }
};

/**
 * GET /api/schemes/:id
 */
export const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = await Scheme.findById(id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: `Scheme with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: scheme
    });
  } catch (error) {
    console.error('[schemeController] Error fetching scheme by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scheme details',
      error: error.message
    });
  }
};
