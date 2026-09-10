import { Request, Response } from 'express';
import asyncHandler from '@/utils/async-handler';
import orderService from '@/services/order.service';
import { StatusCode } from '@/enums/status-code.enum';

export const createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const idempotencyKey = req.idempotencyKey!;
  const order = await orderService.createOrder(userId, idempotencyKey, req.body);
  res.status(StatusCode.Created).json(order);
});

export const getOrderById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const order = await orderService.getOrderById(id, userId);
  res.status(StatusCode.Ok).json(order);
});

export const getUserOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  const orders = await orderService.getUserOrders(userId, limit, offset);
  res.status(StatusCode.Ok).json(orders);
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const order = await orderService.cancelOrder(id, userId);
  res.status(StatusCode.Ok).json(order);
});
