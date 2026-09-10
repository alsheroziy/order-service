import userRepo from '@/repositories/user.repo';
import asyncHandler from '@/utils/async-handler';
import ErrorResponse from '@/utils/errorResponse';
import { verifyAccessToken } from '@/utils/jwt.util';
import { NextFunction, Request, Response } from 'express';

export const protect = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        let token: string | undefined;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            throw ErrorResponse.unauthorized('unauthorized');
        }

        const decoded = verifyAccessToken(token);
        const user = await userRepo.findById(decoded.id);

        if (!user) {
            throw ErrorResponse.unauthorized('user not found');
        }

        req.user = user;
        next();
    },
);

export const restrictTo = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw ErrorResponse.forbidden('forbidden');
        }
        next();
    };
};

export default {
    protect,
    restrictTo,
};
