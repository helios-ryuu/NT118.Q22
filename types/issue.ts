// Kieu du lieu van de — theo schema.gql (Issue thuoc Idea)
export type IssueStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | "CANCELLED";

export interface Issue {
  id: string;
  ideaId: string;
  title: string;
  content: string;
  status: IssueStatus;
  authorId: string;
  authorDisplayName: string | null;
  authorAvatarUrl: string | null;
  createdAt: string;
}
