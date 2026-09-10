import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  cancelOrder,
} from '@/controllers/order.controller';
import { protect } from '@/middlewares/auth.middleware';
import { idempotent } from '@/middlewares/idempotency.middleware';

const router = Router();

router.post('/', protect, idempotent, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.post('/:id/cancel', protect, cancelOrder);

export default router;
