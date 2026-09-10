import { UserRole } from '@/enums/user.enum';
import { IUser } from '@/interfaces/user.interface';

export interface RegisterDto {
    email: string;
    password: string;
    full_name?: string;
    role?: UserRole;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface CreateUserDbDto {
    email: string;
    password_hash: string;
    full_name?: string;
    role?: UserRole;
}

export class UserResponseDto {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    created_at: Date;

    constructor(user: IUser) {
        this.id = user.id;
        this.email = user.email;
        this.full_name = user.full_name;
        this.role = user.role;
        this.created_at = user.created_at;
    }
}

export interface AuthResponseDto {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
}
