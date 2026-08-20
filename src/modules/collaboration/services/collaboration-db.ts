import { Conversation, Message } from '../types/domain.types';

// Clean initial state with no scripted dummy channels
const INITIAL_CONVERSATIONS: Conversation[] = [];
const INITIAL_MESSAGES: Message[] = [];

export class CollaborationDB {
  static get<T>(key: string, initial: T): T {
    const data = localStorage.getItem(`cos_col_${key}`);
    if (!data) {
      localStorage.setItem(`cos_col_${key}`, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initial;
    }
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(`cos_col_${key}`, JSON.stringify(value));
  }

  static getConversations(): Conversation[] {
    return this.get('convs_clean', INITIAL_CONVERSATIONS);
  }

  static saveConversations(c: Conversation[]): void {
    this.set('convs_clean', c);
  }

  static getMessages(): Message[] {
    return this.get('msgs_clean', INITIAL_MESSAGES);
  }

  static saveMessages(m: Message[]): void {
    this.set('msgs_clean', m);
  }

  static clearAll(): void {
    localStorage.removeItem('cos_col_convs');
    localStorage.removeItem('cos_col_msgs');
    localStorage.removeItem('cos_col_convs_clean');
    localStorage.removeItem('cos_col_msgs_clean');
  }
}
