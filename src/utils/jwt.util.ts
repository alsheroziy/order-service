import { environments } from '@/config/enviroment';
import { UserRole } from '@/enums/user.enum';
import ErrorResponse from '@/utils/errorResponse';
import jwt from 'jsonwebtoken';

export interface ITokenPayload {
    id: string;
    email: string;
    role?: UserRole;
}

export const generateTokens = (payload: ITokenPayload) => {
    const accessToken = jwt.sign(payload, environments.JWT_ACCESS_SECRET, {
        expiresIn: environments.JWT_ACCESS_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, environments.JWT_REFRESH_SECRET, {
        expiresIn: environments.JWT_REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): ITokenPayload => {
    try {
        return jwt.verify(token, environments.JWT_ACCESS_SECRET) as ITokenPayload;
    } catch {
        throw ErrorResponse.unauthorized('invalid or expired access token');
    }
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
    try {
        return jwt.verify(token, environments.JWT_REFRESH_SECRET) as ITokenPayload;
    } catch {
        throw ErrorResponse.unauthorized('invalid or expired refresh token');
    }
};

export default {
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken,
};
