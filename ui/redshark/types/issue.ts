// Kieu du lieu van de va trang thai

export type Priority = number; // 1–10

export type IssueStatus = "cancelled" | "open" | "in_progress" | "closed";

export interface Issue {
  id: string;
  title: string;
  description: string;
  tags: string[];
  priority: Priority;
  status: IssueStatus;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
  expiresAt: string | null;
  durationDays: number | null;
}
