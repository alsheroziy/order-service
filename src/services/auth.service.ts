import {
    AuthResponseDto,
    LoginDto,
    RefreshTokenResponseDto,
    RegisterDto,
    UserResponseDto,
} from '@/dtos/user.dto';
import { IUser } from '@/interfaces/user.interface';
import userRepo from '@/repositories/user.repo';
import ErrorResponse from '@/utils/errorResponse';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt.util';
import bcrypt from 'bcrypt';

class AuthService {
    private buildAuthResponse(user: IUser): AuthResponseDto {
        const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });
        return {
            user: new UserResponseDto(user),
            ...tokens,
        };
    }

    private async findUserById(id: string): Promise<IUser> {
        const user = await userRepo.findById(id);
        if (!user) {
            throw ErrorResponse.notFound('user not found');
        }
        return user;
    }

    async register({ email, password, full_name }: RegisterDto): Promise<AuthResponseDto> {
        const userExists = await userRepo.findByEmail(email);
        if (userExists) {
            throw ErrorResponse.conflict('email already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userRepo.create({
            email,
            password_hash: hashedPassword,
            full_name,
        });

        return this.buildAuthResponse(newUser);
    }

    async login({ email, password }: LoginDto): Promise<AuthResponseDto> {
        const user = await userRepo.findByEmail(email);
        if (!user) {
            throw ErrorResponse.unauthorized('invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw ErrorResponse.unauthorized('invalid credentials');
        }

        return this.buildAuthResponse(user);
    }

    async refresh(refreshToken: string): Promise<RefreshTokenResponseDto> {
        if (!refreshToken) {
            throw ErrorResponse.badRequest('refresh token required');
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await this.findUserById(decoded.id);

        return generateTokens({ id: user.id, email: user.email, role: user.role });
    }

    async getProfile(userId: string): Promise<UserResponseDto> {
        const user = await this.findUserById(userId);
        return new UserResponseDto(user);
    }
}

export default new AuthService();
