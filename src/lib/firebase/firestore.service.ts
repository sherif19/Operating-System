import { doc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { User } from '@/types/domain.types';
import { Conversation, Message } from '@/modules/collaboration/types/domain.types';

export class FirebaseFirestoreService {
  /**
   * Save or update User Profile in Firestore collection 'users'
   */
  static async saveUserProfile(user: User): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(
        userRef,
        {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber || '',
          avatarUrl: user.avatarUrl || '',
          role: user.role,
          organizationId: user.organizationId || 'org-1',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log('Firestore: User profile saved successfully for', user.id);
    } catch (error) {
      console.warn('Firestore saveUserProfile warning:', error);
    }
  }

  /**
   * Save Chat Message to Firestore collection 'messages'
   */
  static async saveMessage(message: Message): Promise<void> {
    try {
      const msgRef = doc(db, 'messages', message.id);
      await setDoc(
        msgRef,
        {
          ...message,
          savedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log('Firestore: Message saved successfully for message ID:', message.id);
    } catch (error) {
      console.warn('Firestore saveMessage warning:', error);
    }
  }

  /**
   * Save Conversation to Firestore collection 'conversations'
   */
  static async saveConversation(conversation: Conversation): Promise<void> {
    try {
      const convRef = doc(db, 'conversations', conversation.id);
      await setDoc(
        convRef,
        {
          ...conversation,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log('Firestore: Conversation saved successfully for ID:', conversation.id);
    } catch (error) {
      console.warn('Firestore saveConversation warning:', error);
    }
  }
}
