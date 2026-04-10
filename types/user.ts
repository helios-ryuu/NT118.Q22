// Kieu du lieu nguoi dung — theo schema.gql
export interface User {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  skillIds: number[];
}
