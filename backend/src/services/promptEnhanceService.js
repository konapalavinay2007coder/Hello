/**
 * Prompt Enhancement Service
 * Converts casual, dialect-heavy, or incomplete rural user queries into a clear, structured instruction.
 */
export const enhancePrompt = (text = '', domain = 'agriculture') => {
  const cleanText = text.trim();
  if (!cleanText) return 'How can I assist you today?';

  // Rule-based quick rewrites for common rural query phrases
  if (/भाव|कीमत|मूल्य|rate|price|mandi|bhav|today/i.test(cleanText)) {
    return `Inquiring about current market APMC mandi prices and selling recommendations for: "${cleanText}"`;
  }

  if (/मौसम|बारिश|weather|rain|barish|taapman|temp/i.test(cleanText)) {
    return `Requesting weather forecast and farm advisory for: "${cleanText}"`;
  }

  if (/योजना|सब्सिडी|scheme|subsidy|yojana|paisa|kist/i.test(cleanText)) {
    return `Searching for government scheme eligibility, benefits, and helpline info regarding: "${cleanText}"`;
  }

  if (/कपास|टमाटर|आलू|गेहूं|मूंग|फसल|बीमारी|कीड़ा|crop|disease/i.test(cleanText)) {
    return `Seeking agricultural crop advice and disease management guidance for: "${cleanText}"`;
  }

  return `Advisory request in ${domain} regarding: "${cleanText}"`;
};
