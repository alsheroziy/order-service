export interface RegisterDto {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUserDbDto {
  email: string;
  password_hash: string;
  full_name?: string;
  role?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: Date;
}
