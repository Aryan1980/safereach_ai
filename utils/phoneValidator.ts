/**
 * Phone number validation and formatting utilities for SafeReach AI.
 * Supports Indian phone numbers (+91, 0 prefix, 10 digits) and international E.164 formats.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  cleanNumber: string;      // E.g., "919876543210" for WhatsApp deep links
  formattedDisplay: string;  // E.g., "+91 98765 43210"
  error?: string;
  countryCode: string;
}

export function validateAndFormatPhone(rawInput: string, defaultCountryCode: string = '91'): PhoneValidationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      cleanNumber: '',
      formattedDisplay: '',
      error: 'Phone number is required.',
      countryCode: defaultCountryCode,
    };
  }

  // Remove spaces, dashes, parentheses, dots
  let cleaned = rawInput.trim().replace(/[\s\-\(\)\.]/g, '');

  // Handle leading '+'
  let hasPlus = cleaned.startsWith('+');
  if (hasPlus) {
    cleaned = cleaned.substring(1);
  }

  // If starts with 0 and followed by 10 digits (common Indian mobile dial format: 09876543210)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = defaultCountryCode + cleaned.substring(1);
  } else if (!hasPlus && cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    // 10-digit Indian mobile number starting with 6, 7, 8, 9
    cleaned = defaultCountryCode + cleaned;
  }

  // Check if remaining characters are digits only
  if (!/^\d{7,15}$/.test(cleaned)) {
    return {
      isValid: false,
      cleanNumber: '',
      formattedDisplay: rawInput,
      error: 'Please enter a valid phone number with 10 digits (or country code + number).',
      countryCode: defaultCountryCode,
    };
  }

  // Format display nicely
  let formattedDisplay = `+${cleaned}`;
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    formattedDisplay = `+91 ${cleaned.substring(2, 7)} ${cleaned.substring(7)}`;
  }

  return {
    isValid: true,
    cleanNumber: cleaned,
    formattedDisplay,
    countryCode: cleaned.length > 10 ? cleaned.substring(0, cleaned.length - 10) : defaultCountryCode,
  };
}

/**
 * Creates a standard tel: URI for native mobile dialers
 */
export function getTelUri(phone: string): string {
  const result = validateAndFormatPhone(phone);
  return `tel:+${result.cleanNumber}`;
}
