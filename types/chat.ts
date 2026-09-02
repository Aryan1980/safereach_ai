export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isUrgent?: boolean;
  actionLinks?: Array<{
    title: string;
    url: string;
    type: 'call' | 'nav' | 'external';
  }>;
}

export interface QuickPrompt {
  id: string;
  category: 'immediate_concern' | 'transit_safety' | 'planning' | 'legal_rights';
  title: string;
  prompt: string;
  icon: string;
}
