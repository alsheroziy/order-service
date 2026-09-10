import { pool } from '@/config/db.config';
import { CreateOrderDto } from '@/dtos/order.dto';
import { IOrder } from '@/interfaces/order.interface';
import orderRepo from '@/repositories/order.repo';
import productRepo from '@/repositories/product.repo';
import productService from '@/services/product.service';
import ErrorResponse from '@/utils/errorResponse';

class OrderService {
    private async findOrderAndVerifyOwnership(orderId: string, userId: string): Promise<IOrder> {
        const order = await orderRepo.findById(orderId);
        if (!order) {
            throw ErrorResponse.notFound('order not found');
        }
        if (order.user_id !== userId) {
            throw ErrorResponse.forbidden('forbidden');
        }
        return order;
    }

    private async invalidateCaches(productIds: string[]): Promise<void> {
        await Promise.all(productIds.map((id) => productService.invalidateCache(id)));
    }

    async createOrder(
        userId: string,
        idempotencyKey: string,
        dto: CreateOrderDto,
    ): Promise<IOrder> {
        const existing = await orderRepo.findByIdempotencyKey(idempotencyKey);
        if (existing) {
            return existing;
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            let totalAmount = 0;
            const orderItemsData: { product_id: string; quantity: number; unit_price: number }[] =
                [];

            for (const item of dto.items) {
                const updatedProduct = await productRepo.decrementStock(
                    item.product_id,
                    item.quantity,
                    client,
                );
                if (!updatedProduct) {
                    throw ErrorResponse.conflict(
                        `insufficient stock for product ${item.product_id}`,
                    );
                }

                totalAmount += updatedProduct.price * item.quantity;
                orderItemsData.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: updatedProduct.price,
                });
            }

            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

            const order = await orderRepo.createOrder(
                {
                    user_id: userId,
                    idempotency_key: idempotencyKey,
                    status: 'pending',
                    total_amount: totalAmount,
                    expires_at: expiresAt,
                },
                client,
            );

            const createdItems = await Promise.all(
                orderItemsData.map((item) =>
                    orderRepo.createOrderItem(
                        {
                            order_id: order.id,
                            product_id: item.product_id,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                        },
                        client,
                    ),
                ),
            );

            await client.query('COMMIT');

            await this.invalidateCaches(dto.items.map((i) => i.product_id));

            return {
                ...order,
                items: createdItems,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getOrderById(orderId: string, userId: string): Promise<IOrder> {
        return this.findOrderAndVerifyOwnership(orderId, userId);
    }

    async getUserOrders(userId: string, limit: number = 20, offset: number = 0): Promise<IOrder[]> {
        return orderRepo.findByUserId(userId, limit, offset);
    }

    async cancelOrder(orderId: string, userId: string): Promise<IOrder> {
        const order = await this.findOrderAndVerifyOwnership(orderId, userId);

        if (order.status === 'cancelled') {
            throw ErrorResponse.badRequest('order already cancelled');
        }
        if (order.status !== 'pending') {
            throw ErrorResponse.badRequest('only pending orders can be cancelled');
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updated = await orderRepo.updateStatus(orderId, 'cancelled', client);

            const items = order.items || (await orderRepo.findItemsByOrderId(orderId, client));
            await Promise.all(
                items.map((item) =>
                    productRepo.incrementStock(item.product_id, item.quantity, client),
                ),
            );

            await client.query('COMMIT');

            await this.invalidateCaches(items.map((i) => i.product_id));

            return {
                ...updated!,
                items,
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async cancelExpiredOrders(): Promise<number> {
        const expiredOrders = await orderRepo.findExpiredPendingOrders();
        if (expiredOrders.length === 0) {
            return 0;
        }

        let cancelledCount = 0;

        for (const order of expiredOrders) {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                const query = `
                  update orders
                  set status = 'cancelled', updated_at = now()
                  where id = $1 and status = 'pending'
                  returning id;
                `;
                const { rows } = await client.query(query, [order.id]);

                if (rows.length > 0) {
                    const items = await orderRepo.findItemsByOrderId(order.id, client);
                    await Promise.all(
                        items.map((item) =>
                            productRepo.incrementStock(item.product_id, item.quantity, client),
                        ),
                    );
                    await client.query('COMMIT');
                    await this.invalidateCaches(items.map((i) => i.product_id));
                    cancelledCount++;
                } else {
                    await client.query('ROLLBACK');
                }
            } catch (error) {
                await client.query('ROLLBACK');
                console.error(`Failed to cancel expired order ${order.id}:`, error);
            } finally {
                client.release();
            }
        }

        return cancelledCount;
    }
}

export default new OrderService();
