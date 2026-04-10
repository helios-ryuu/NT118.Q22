// Kieu du lieu y tuong — theo schema.gql
export type IdeaStatus = "ACTIVE" | "CLOSED" | "CANCELLED";

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  tagIds: number[];
  collaboratorIds: string[];
  authorId: string;
  authorDisplayName: string | null;
  authorAvatarUrl: string | null;
  lastActivityAt: string;
  createdAt: string;
}
