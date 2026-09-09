import { Request, Response } from 'express';
import asyncHandler from '@/utils/async-handler';
import authService from '@/services/auth.service';
import { setCookie, clearCookie } from '@/utils/cookie.util';
import { StatusCode } from '@/enums/status-code.enum';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body);
  setCookie(res, 'refreshToken', result.refreshToken);
  res.status(StatusCode.Created).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);
  setCookie(res, 'refreshToken', result.refreshToken);
  res.status(StatusCode.Ok).json(result);
});

export const refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const result = await authService.refresh(token);
  setCookie(res, 'refreshToken', result.refreshToken);
  res.status(StatusCode.Ok).json(result);
});

export const logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  clearCookie(res, 'refreshToken');
  res.status(StatusCode.Ok).json({ message: 'Logged out successfully' });
});
