/**
 * Form Filling Slot-Filling Controller
 * Performs step-by-step dialogue slot filling for government scheme forms
 */
export const handleFormFill = async (req, res) => {
  try {
    const {
      formId = 'scheme_application',
      fields = [],
      collectedData = {},
      userMessage = '',
      language = 'hi'
    } = req.body;

    // Standard demo fields fallback if none provided in request
    const defaultFields = [
      { key: 'applicantName', label: 'Applicant Full Name', promptHi: 'आपका पूरा नाम क्या है?', promptEn: 'What is your full name?' },
      { key: 'landSizeAcres', label: 'Land Size (Acres)', promptHi: 'आपकी भूमि कितने एकड़ है?', promptEn: 'How many acres of land do you cultivate?' },
      { key: 'district', label: 'District Name', promptHi: 'आपका जिला कौन सा है?', promptEn: 'Which district do you reside in?' },
      { key: 'aadhaarLast4', label: 'Aadhaar Last 4 Digits', promptHi: 'आधार कार्ड के आखिरी 4 अंक दर्ज करें:', promptEn: 'Enter the last 4 digits of your Aadhaar card:' }
    ];

    const activeFields = fields.length > 0 ? fields : defaultFields;
    const currentData = { ...collectedData };

    // Find first missing field before processing current user message
    let missingField = activeFields.find(f => !currentData[f.key] || String(currentData[f.key]).trim() === '');

    // Parse userMessage if provided to extract answer for the missing field
    if (userMessage && userMessage.trim().length > 0 && missingField) {
      const text = userMessage.trim();
      currentData[missingField.key] = text;
    }

    // Re-check missing fields after slot filling
    const remainingMissing = activeFields.find(f => !currentData[f.key] || String(currentData[f.key]).trim() === '');

    if (!remainingMissing) {
      return res.status(200).json({
        success: true,
        formId,
        isComplete: true,
        completedData: currentData,
        completionMessage: language === 'hi'
          ? 'बधाई हो! आपकी योजना का फॉर्म सफलतापूर्वक भर दिया गया है।'
          : 'Success! Your scheme application form has been completed.'
      });
    }

    // Determine prompt question for the next missing field
    const nextQuestion = language === 'hi'
      ? (remainingMissing.promptHi || `कृपया ${remainingMissing.label} बताएं:`)
      : (remainingMissing.promptEn || `Please provide ${remainingMissing.label}:`);

    res.status(200).json({
      success: true,
      formId,
      isComplete: false,
      nextField: remainingMissing.key,
      nextQuestion,
      collectedData: currentData,
      remainingFieldsCount: activeFields.filter(f => !currentData[f.key]).length
    });

  } catch (error) {
    console.error('[formFillController] Slot filling error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process form slot filling',
      error: error.message
    });
  }
};
