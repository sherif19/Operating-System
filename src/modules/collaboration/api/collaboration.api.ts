import { CollaborationDB } from '../services/collaboration-db';
import { Conversation, Message, MessageFile } from '../types/domain.types';
import { useAuthStore } from '@/stores/auth.store';
import { FirebaseStorageService } from '@/lib/firebase/storage.service';
import { FirebaseFirestoreService } from '@/lib/firebase/firestore.service';

export class CollaborationApi {
  static async fetchConversations(): Promise<Conversation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(CollaborationDB.getConversations());
      }, 100);
    });
  }

  static async fetchMessages(conversationId: string): Promise<Message[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = CollaborationDB.getMessages().filter(
          (m) => m.conversationId === conversationId
        );
        resolve(filtered);
      }, 100);
    });
  }

  static async startDirectChat(
    targetEmployeeId: string,
    targetEmployeeName: string,
    targetAvatarUrl?: string
  ): Promise<Conversation> {
    const conversations = CollaborationDB.getConversations();
    const currentUser = useAuthStore.getState().user;
    const currentUserId = currentUser?.id || 'emp-owner';

    // Check if a direct conversation with this employee already exists
    let existing = conversations.find(
      (c) => c.type === 'direct' && c.members.includes(targetEmployeeId)
    );

    if (existing) {
      return existing;
    }

    // Otherwise create a new direct conversation
    const newConv: Conversation = {
      id: `dm-${targetEmployeeId}-${Date.now()}`,
      name: targetEmployeeName,
      type: 'direct',
      avatarUrl: targetAvatarUrl,
      members: [currentUserId, targetEmployeeId],
      admins: [],
      pinnedMessages: [],
      isArchived: false,
      isMuted: false,
      unreadCount: 0,
      lastMessageText: 'تم بدء دردشة خاصة جديدة',
      lastMessageTime: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    conversations.unshift(newConv);
    CollaborationDB.saveConversations(conversations);

    // Sync new conversation to Firestore
    FirebaseFirestoreService.saveConversation(newConv);

    return newConv;
  }

  static async sendMessage(
    conversationId: string,
    text: string,
    voiceUrl?: string,
    file?: MessageFile,
    voiceDuration?: string
  ): Promise<Message> {
    const messages = CollaborationDB.getMessages();
    const conversations = CollaborationDB.getConversations();
    const currentUser = useAuthStore.getState().user;

    let finalVoiceUrl = voiceUrl;
    let finalFile = file ? { ...file } : undefined;

    // 1. Upload Voice Note Blob/Data URL to Firebase Storage if present
    if (voiceUrl && voiceUrl.startsWith('data:')) {
      const storageUrl = await FirebaseStorageService.uploadChatFile(
        conversationId,
        voiceUrl,
        'voice_recording.webm'
      );
      if (storageUrl) {
        finalVoiceUrl = storageUrl;
      }
    }

    // 2. Upload Chat Attachment File to Firebase Storage if present
    if (finalFile && finalFile.url && finalFile.url.startsWith('data:')) {
      const storageUrl = await FirebaseStorageService.uploadChatFile(
        conversationId,
        finalFile.url,
        finalFile.name
      );
      if (storageUrl) {
        finalFile.url = storageUrl;
      }
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser?.id || 'emp-owner',
      senderName: currentUser?.displayName || 'م. أحمد العتيبي',
      senderAvatarUrl: currentUser?.avatarUrl,
      text,
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
      voiceUrl: finalVoiceUrl,
      voiceDuration,
      file: finalFile,
      reactions: [],
    };

    messages.push(newMsg);
    CollaborationDB.saveMessages(messages);

    // Sync message to Firestore collection 'messages'
    FirebaseFirestoreService.saveMessage(newMsg);

    // Update last message text in conversation list & sync to Firestore
    const cIdx = conversations.findIndex((c) => c.id === conversationId);
    if (cIdx !== -1) {
      let lastText = text;
      if (finalVoiceUrl) lastText = '🎙️ رسالة صوتية';
      else if (finalFile) lastText = `📎 ملف: ${finalFile.name}`;

      conversations[cIdx].lastMessageText = lastText;
      conversations[cIdx].lastMessageTime = newMsg.createdAt;
      CollaborationDB.saveConversations(conversations);

      // Sync updated conversation to Firestore collection 'conversations'
      FirebaseFirestoreService.saveConversation(conversations[cIdx]);
    }

    return newMsg;
  }

  static async addReaction(messageId: string, emoji: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      const messages = CollaborationDB.getMessages();
      const currentUser = useAuthStore.getState().user;
      const currentUserId = currentUser?.id || 'emp-owner';

      const idx = messages.findIndex((m) => m.id === messageId);
      if (idx === -1) return reject(new Error('Message not found'));

      const msg = messages[idx];
      const hasReaction = msg.reactions.some((r) => r.userId === currentUserId && r.emoji === emoji);

      if (!hasReaction) {
        msg.reactions.push({ emoji, userId: currentUserId });
      } else {
        msg.reactions = msg.reactions.filter((r) => !(r.userId === currentUserId && r.emoji === emoji));
      }

      messages[idx] = msg;
      CollaborationDB.saveMessages(messages);
      FirebaseFirestoreService.saveMessage(msg);
      resolve(msg);
    });
  }

  static async markAllAsRead(): Promise<void> {
    const conversations = CollaborationDB.getConversations();
    const updated = conversations.map((c) => ({ ...c, unreadCount: 0 }));
    CollaborationDB.saveConversations(updated);
  }

  static async clearAll(): Promise<void> {
    CollaborationDB.clearAll();
  }
}
