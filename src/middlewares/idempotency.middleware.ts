import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '@/utils/errorResponse';

export const idempotent = (req: Request, _res: Response, next: NextFunction): void => {
  const key = req.headers['idempotency-key'] as string | undefined;

  if (!key || !key.trim()) {
    return next(ErrorResponse.badRequest('idempotency-key header is required'));
  }

  req.idempotencyKey = key.trim();
  next();
};

export default idempotent;
