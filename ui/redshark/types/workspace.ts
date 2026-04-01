// Kieu du lieu workspace — phien lam viec chung giua nguoi giup va nguoi can giup

export type SessionStatus = "active" | "completed" | "in_progress" | "closed";

export interface WorkspaceMember {
  id: string;
  name: string;
  avatar: string | null;
  role: "author" | "helper";
}

export interface Session {
  id: string;
  issueId: string;
  issueTitle: string;
  issueStatus: string;
  status: SessionStatus;
  isPublic: boolean;
  members: WorkspaceMember[];
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  workspaceId: string;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: string;
}
