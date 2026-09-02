import { Coordinates } from '@/types/places';
import { TrustedContact } from '@/types/contact';
import { validateAndFormatPhone } from '@/utils/phoneValidator';

export interface GeneratedEmergencyMessage {
  text: string;
  mapsUrl: string;
  whatsappUrl: string;
  smsUrl: string;
  recipientName?: string;
  recipientPhone?: string;
}

/**
 * Creates Google Maps coordinate URL
 */
export function buildGoogleMapsUrl(coords: Coordinates): string {
  return `https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
}

/**
 * Creates OpenStreetMap coordinate URL (alternative)
 */
export function buildOsmUrl(coords: Coordinates): string {
  return `https://www.openstreetmap.org/?mlat=${coords.lat.toFixed(6)}&mlon=${coords.lng.toFixed(6)}#map=17/${coords.lat.toFixed(6)}/${coords.lng.toFixed(6)}`;
}

/**
 * Generates the standardized Emergency Alert message text and platform action links
 */
export function generateEmergencyPayload(
  coords: Coordinates | null,
  contact: TrustedContact | null,
  customNote?: string
): GeneratedEmergencyMessage {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  
  let locationStr = 'Location unavailable (Live GPS could not be acquired)';
  let mapsUrl = '';

  if (coords) {
    mapsUrl = buildGoogleMapsUrl(coords);
    const accuracyStr = coords.accuracy ? ` [±${Math.round(coords.accuracy)}m]` : '';
    const addressStr = coords.address ? `\nApprox. Address: ${coords.address}` : '';
    locationStr = `${mapsUrl}${accuracyStr}${addressStr}`;
  }

  const customPart = customNote && customNote.trim() ? `\nNote: ${customNote.trim()}` : '';

  // Standard high-priority emergency template
  const text = `🚨 EMERGENCY! I may need help.
My current location is: ${locationStr}
Time: ${timestamp}${customPart}
Please check on me immediately or contact local emergency services (112) if I do not respond.
- Sent via SafeReach AI`;

  let cleanPhone = '';
  if (contact && contact.phone) {
    const phoneResult = validateAndFormatPhone(contact.phone);
    cleanPhone = phoneResult.cleanNumber;
  }

  const encodedText = encodeURIComponent(text);

  // WhatsApp deep link format: https://api.whatsapp.com/send?phone=...&text=... or https://wa.me/...
  const whatsappUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  // Standard SMS uri: sms:PHONE?body=MESSAGE (cross-platform compatible)
  const smsUrl = cleanPhone
    ? `sms:${cleanPhone}?body=${encodedText}`
    : `sms:?body=${encodedText}`;

  return {
    text,
    mapsUrl,
    whatsappUrl,
    smsUrl,
    recipientName: contact?.name,
    recipientPhone: contact?.phone,
  };
}

/**
 * Triggers native system share dialog if supported, otherwise copies to clipboard
 */
export async function shareEmergencyAlert(text: string, title: string = 'SafeReach AI Emergency Alert'): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
      });
      return 'shared';
    } catch (e: unknown) {
      if ((e as Error).name !== 'AbortError') {
        console.warn('Navigator share error, falling back to clipboard:', e);
      } else {
        return 'shared'; // User cancelled the modal
      }
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return 'copied';
    } catch (e) {
      console.error('Failed to copy to clipboard:', e);
      return 'failed';
    }
  }

  return 'failed';
}
