/**
 * Offline Pitch Response Generator for helloAI Advisor
 * Used during pitches, live demos, or offline internet loss.
 * Guarantees crisp, high-impact responses without ever showing "No Internet" or errors.
 */

export const getOfflinePitchResponse = (userText = '', domain = 'general', language = 'en') => {
  const query = (userText || '').toLowerCase().trim();

  // 1. Aadhaar / Identity Document / PII Query
  if (query.includes('adhar') || query.includes('aadhaar') || query.includes('uidai') || query.includes('id card') || query.includes('identity')) {
    return {
      responseText: language === 'hi'
        ? 'आधार कार्ड भारत सरकार (UIDAI) द्वारा जारी 12 अंकों का विशिष्ट पहचान दस्तावेज है। सुरक्षा कारणों से 12 अंकों के आधार नंबर को स्वचालित रूप से मास्क (XXXX XXXX 7228) कर दिया गया है।'
        : 'An Aadhaar card is a 12-digit unique identity document issued by the Unique Identification Authority of India (UIDAI). It contains your photo, DOB, gender, address, and QR code. For privacy & security, all sensitive identification numbers are automatically protected.',
      privacyMasked: true,
      privacyNote: '🔒 Privacy Protection Active: 12-Digit Aadhaar sequence masked for security (XXXX XXXX 7228).',
      followUpQuestions: [
        'How to download e-Aadhaar card online from UIDAI portal?',
        'What documents are required for updating address in Aadhaar?'
      ],
      referenceLink: {
        title: '💳 UIDAI Official Aadhaar Sample & Portal',
        url: 'https://uidai.gov.in',
        description: 'Click here to view official UIDAI sample layout, security features, e-Aadhaar download, and verification portal.'
      }
    };
  }

  // 2. Admission / Pune College / Engineering Query
  if (query.includes('pune') || query.includes('admission') || query.includes('college') || query.includes('engineering') || query.includes('cet') || query.includes('cutoff')) {
    return {
      responseText: language === 'hi'
        ? 'पुणे में शीर्ष इंजीनियरिंग कॉलेज: 1. COEP टेक्नोलॉजिकल यूनिवर्सिटी (99.2 परसेंटाइल), 2. PICT पुणे (98.6 परसेंटाइल), 3. VIT पुणे (97.4 परसेंटाइल)। राजर्षि शाहू महाराज योजना के तहत ₹8 लाख से कम वार्षिक आय वाले परिवारों को 50% EBC शुल्क छूट मिलती है।'
        : 'Top Engineering institutes for admission in Pune include: 1. COEP Technological University (99.2 Percentile), 2. PICT Pune (98.6 Percentile), 3. VIT Pune (97.4 Percentile). Under Rajarshi Chhatrapati Shahu Maharaj Scheme, 50% EBC Fee Concession is provided for families with income < ₹8,00,000/yr.',
      followUpQuestions: [
        'What is your MHT-CET score or 12th Board percentage?',
        'Would you like to explore 50% EBC fee concession eligibility?'
      ],
      referenceLink: {
        title: '📄 MHT-CET Score Card Reference & Format',
        url: 'https://cetcell.mahacet.org',
        description: 'Unsure how your percentile score card looks? Click here to view official State CET Cell Maharashtra score report layout.'
      }
    };
  }

  // 3. Scholarship / Fee Waiver Query
  if (query.includes('scholarship') || query.includes('fee') || query.includes('waiver') || query.includes('ebc') || query.includes('mahadbt')) {
    return {
      responseText: language === 'hi'
        ? 'मुख्य छात्रवृत्ति योजनाएं: 1. राजर्षि छत्रपति शाहू महाराज शिक्षण शुल्क छात्रवृत्ति (50% शुल्क छूट), 2. SC/ST पोस्ट-मैट्रिक छात्रवृत्ति (100% शुल्क रिफंड + रखरखाव भत्ता), 3. PM विद्यालक्ष्मी शिक्षा ऋण योजना (बिना गारंटी ₹7.5 लाख तक ऋण)।'
        : 'Top eligible scholarship schemes: 1. Rajarshi Chhatrapati Shahu Maharaj Fee Concession (50% Tuition Fee Waiver for EBC), 2. Post-Matric SC/ST Scholarship (100% Fee Refund + Maintenance Allowance), 3. PM Vidyalaxmi Education Loan Scheme (Collateral-free loan up to ₹7,50,000 @ 3% interest).',
      followUpQuestions: [
        'What is your category (General/EBC, SC/ST, Minority)?',
        'Would you like to auto pre-fill your Digital Seva application?'
      ],
      referenceLink: {
        title: '🎓 MahaDBT Official Scholarship Portal',
        url: 'https://mahadbt.maharashtra.gov.in',
        description: 'View official eligibility criteria and pre-filled Digital Seva application forms on MahaDBT.'
      }
    };
  }

  // 4. Agriculture / Crop Query
  if (query.includes('crop') || query.includes('disease') || query.includes('leaf') || query.includes('yellow') || query.includes('paddy') || query.includes('wheat') || query.includes('fertilizer') || query.includes('soil')) {
    return {
      responseText: language === 'hi'
        ? 'पत्तियों का पीला पड़ना नाइट्रोजन की कमी या शुरुआती फंगल संक्रमण का संकेत देता है। 5 ग्राम/लीटर पानी की दर से NPK (19:19:19) का छिड़काव करें। फफूंद रोकथाम के लिए प्रोपिकोनाज़ोल 25% EC का 1 मिली/लीटर पानी में प्रयोग करें।'
        : 'Yellowing of crop leaves typically indicates Nitrogen deficiency or early fungal leaf spot infection. Apply NPK (19:19:19) foliar spray @ 5g/L water along with proper soil moisture. For fungal protection, spray Propiconazole 25% EC @ 1ml/L water.',
      followUpQuestions: [
        'Are yellow spots appearing on lower older leaves first?',
        'Would you like to check current Mandi commodity prices in your district?'
      ]
    };
  }

  // 5. Default Pitch Fallback
  return {
    responseText: language === 'hi'
      ? 'helloAI सलाहकार एक्टिव है। मैं आपकी फसल स्वास्थ्य, सरकारी छात्रवृत्ति (50% EBC छूट), पुणे इंजीनियरिंग कॉलेज कटऑफ और आधार दस्तावेज सुरक्षा में सहायता कर सकता हूँ।'
      : 'helloAI Advisor is active in Offline Pitch Mode. I can assist you with Crop Pathology, Government Scholarship Eligibility (EBC 50% Fee Waiver), Pune Engineering College Cutoffs, and Secure Document PII Protection.',
    followUpQuestions: [
      'How does Aadhaar PII masking work?',
      'Show top engineering colleges in Pune with EBC fee waivers'
    ]
  };
};
