export interface Comment {
  id: string; // Int64String
  ideaId: string;
  content: string;
  authorId: string;
  authorDisplayName: string | null;
  authorAvatarUrl: string | null;
  createdAt: string;
}
