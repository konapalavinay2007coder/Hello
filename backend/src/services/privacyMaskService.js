/**
 * Privacy Masking Service
 * Detects and masks personal sensitive digit sequences (Phone numbers, Aadhaar numbers, Bank accounts)
 */
export const maskSensitiveData = (text = '') => {
  if (!text) return { maskedText: '', privacyMasked: false, details: [] };

  let maskedText = text;
  let privacyMasked = false;
  const details = [];

  // 1. Phone number pattern (+91 or 10-digit sequence like 9876543210, 09876543210)
  const phoneRegex = /(\+91[\-\s]?)?[6-9]\d{9}/g;
  if (phoneRegex.test(maskedText)) {
    maskedText = maskedText.replace(phoneRegex, '[phone number removed]');
    privacyMasked = true;
    details.push('phone');
  }

  // 2. Aadhaar number pattern (12-digit sequence with optional spaces: 1234 5678 9012)
  const aadhaarRegex = /\b[2-9]\d{3}[\s\-]?\d{4}[\s\-]?\d{4}\b/g;
  if (aadhaarRegex.test(maskedText)) {
    maskedText = maskedText.replace(aadhaarRegex, '[Aadhaar number removed]');
    privacyMasked = true;
    details.push('aadhaar');
  }

  // 3. Bank Account / Long ID number pattern (11 to 16 digit numbers standalone)
  const bankRegex = /\b\d{11,16}\b/g;
  if (bankRegex.test(maskedText)) {
    maskedText = maskedText.replace(bankRegex, '[account number removed]');
    privacyMasked = true;
    details.push('bank_account');
  }

  return {
    maskedText,
    privacyMasked,
    details
  };
};
