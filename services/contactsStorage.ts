import { TrustedContact, EmergencySettings, EmergencyLog } from '@/types/contact';
import { Coordinates } from '@/types/places';

const CONTACTS_KEY = 'safereach_trusted_contacts_v1';
const SETTINGS_KEY = 'safereach_emergency_settings_v1';
const LAST_LOCATION_KEY = 'safereach_last_known_location_v1';
const LOGS_KEY = 'safereach_emergency_logs_v1';

export function getTrustedContacts(): TrustedContact[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read trusted contacts from localStorage:', e);
    return [];
  }
}

export function saveTrustedContacts(contacts: TrustedContact[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    return true;
  } catch (e) {
    console.error('Failed to save trusted contacts to localStorage:', e);
    return false;
  }
}

export function getPrimaryContact(): TrustedContact | null {
  const contacts = getTrustedContacts();
  if (contacts.length === 0) return null;
  const primary = contacts.find((c) => c.isPrimary);
  return primary || contacts[0];
}

export function addOrUpdateContact(contact: TrustedContact): TrustedContact[] {
  const contacts = getTrustedContacts();
  const existingIdx = contacts.findIndex((c) => c.id === contact.id);

  let updated: TrustedContact[];
  if (contact.isPrimary) {
    // Demote other primary contacts
    contacts.forEach((c) => (c.isPrimary = false));
  }

  if (existingIdx >= 0) {
    contacts[existingIdx] = contact;
    updated = [...contacts];
  } else {
    // If first contact, make primary by default
    if (contacts.length === 0) {
      contact.isPrimary = true;
    }
    updated = [contact, ...contacts];
  }

  saveTrustedContacts(updated);
  return updated;
}

export function deleteContact(id: string): TrustedContact[] {
  const contacts = getTrustedContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length > 0 && !filtered.some((c) => c.isPrimary)) {
    filtered[0].isPrimary = true;
  }
  saveTrustedContacts(filtered);
  return filtered;
}

export function getLastKnownLocation(): Coordinates | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_LOCATION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveLastKnownLocation(coords: Coordinates): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(coords));
  } catch {}
}

export function getEmergencySettings(): EmergencySettings {
  if (typeof window === 'undefined') {
    return { includeAccuracy: true, autoAudioSiren: false };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { includeAccuracy: true, autoAudioSiren: false };
    return JSON.parse(raw);
  } catch {
    return { includeAccuracy: true, autoAudioSiren: false };
  }
}

export function saveEmergencySettings(settings: EmergencySettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function logEmergencyEvent(log: EmergencyLog): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    const logs: EmergencyLog[] = raw ? JSON.parse(raw) : [];
    logs.unshift(log);
    // Keep max 20 logs
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 20)));
  } catch {}
}

export function getEmergencyLogs(): EmergencyLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
