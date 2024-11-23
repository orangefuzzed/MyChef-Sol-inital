import { Recipe } from './Recipe';  // Import the Recipe type

export interface ChatMessage {
  id: number;
  messageId: string;
  sessionId: string;
  timestamp: Date;
  sender: 'user' | 'ai'; // Allow "system" as a valid sender type
  text: string;
  suggestions?: Recipe[];  // Updated type
}
