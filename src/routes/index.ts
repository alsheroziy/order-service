import { Router } from 'express';
import authRoute from '@/routes/auth.route';
import productRoute from '@/routes/product.route';
import orderRoute from '@/routes/order.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/products', productRoute);
router.use('/orders', orderRoute);

export default router;