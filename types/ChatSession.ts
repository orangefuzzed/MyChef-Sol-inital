// /types/ChatSession.ts

import { ChatMessage } from './ChatMessage';

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date;
  sessionTitle?: string; // Add sessionTitle as an optional property
  sessionSummary: string;
  timestamp: string;
}
