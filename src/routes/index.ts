import { Router } from 'express';
import authRoute from '@/routes/auth.route';
import productRoute from '@/routes/product.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/products', productRoute);

export default router;