export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageAt: string;
}

export interface Message {
  id: string; // Int64String
  conversationId: string;
  content: string;
  senderId: string;
  senderDisplayName: string | null;
  senderAvatarUrl: string | null;
  createdAt: string;
}
