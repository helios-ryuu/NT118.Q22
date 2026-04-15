export type NotificationType =
  | "ISSUE_CREATED"    // ai đó tạo issue trong idea của tôi
  | "COMMENT_ADDED"    // ai đó comment vào idea của tôi
  | "COLLAB_REQUEST"   // ai đó xin cộng tác idea của tôi
  | "COLLAB_ACCEPTED"  // yêu cầu cộng tác của tôi được chấp thuận
  | "MESSAGE_RECEIVED"; // tin nhắn mới (fallback)

export interface Notification {
  id: string; // Int64String
  type: NotificationType;
  targetId: string | null; // UUID của idea/issue liên quan
  metaData: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
  actorId: string;
  actorDisplayName: string | null;
  actorAvatarUrl: string | null;
}
