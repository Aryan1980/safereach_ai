export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  isPrimary: boolean;
  createdAt: number;
}

export interface EmergencySettings {
  customMessage?: string;
  includeAccuracy: boolean;
  autoAudioSiren: boolean;
  repeatIntervalSeconds?: number;
}

export interface EmergencyLog {
  id: string;
  timestamp: number;
  contactName: string;
  contactPhone: string;
  lat: number;
  lng: number;
  mapsUrl: string;
  status: 'dispatched_whatsapp' | 'copied' | 'shared';
}
