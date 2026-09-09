export interface IUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  password_hash: string;
  created_at: Date;
}
