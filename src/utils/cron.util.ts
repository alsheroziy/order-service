import orderService from '@/services/order.service';
import cron from 'node-cron';

export const orderCleanup = (): void => {
    cron.schedule('*/1 * * * *', async () => {
        try {
            await orderService.cancelExpiredOrders();
        } catch (error) {
            console.error('failed to run order cleanup:', error);
        }
    });
};
