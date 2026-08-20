export type ConversationType = 'direct' | 'group' | 'channel' | 'announcement';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Conversation {
  id: string;
  name: string;
  type: ConversationType;
  avatarUrl?: string;
  departmentId?: string;
  members: string[]; // list of Employee IDs
  admins: string[]; // list of Admin Employee IDs
  pinnedMessages: string[];
  isArchived: boolean;
  isMuted: boolean;
  draft?: string;
  lastMessageText?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
}

export interface MessageFile {
  name: string;
  size: string;
  url: string;
  type: 'image' | 'pdf' | 'document' | 'audio' | 'video' | 'archive' | 'file';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  text: string;
  createdAt: string;
  status: MessageStatus;
  voiceUrl?: string;
  voiceDuration?: string;
  voiceTranscription?: string;
  file?: MessageFile;
  replyToId?: string; // links parent message ID for quoted replies
  reactions: MessageReaction[];
  isPinned?: boolean;
  isStarred?: boolean;
}
