import { UserRole } from '@/enums/user.enum';

export interface IUser {
    id: string;
    full_name: string | null;
    email: string;
    role: UserRole;
    password_hash: string;
    created_at: Date;
}

export default IUser;
