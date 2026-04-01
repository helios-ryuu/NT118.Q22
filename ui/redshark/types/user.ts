// Kieu du lieu nguoi dung

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  birthday: string | null;
  isOnline: boolean;
}
