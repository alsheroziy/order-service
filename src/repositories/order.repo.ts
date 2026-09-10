import { pool } from '@/config/db.config';
import { CreateOrderDbDto, CreateOrderItemDbDto } from '@/dtos/order.dto';
import { IOrder, IOrderItem, OrderStatus } from '@/interfaces/order.interface';
import { Pool, PoolClient } from 'pg';

class OrderRepository {
  async createOrder(data: CreateOrderDbDto, client: Pool | PoolClient = pool): Promise<IOrder> {
    const query = `
      insert into orders (user_id, idempotency_key, status, total_amount, expires_at)
      values ($1, $2, $3, $4, $5)
      returning id, user_id, idempotency_key, status, total_amount, expires_at, created_at, updated_at;
    `;
    const { rows } = await client.query(query, [
      data.user_id,
      data.idempotency_key,
      data.status,
      data.total_amount,
      data.expires_at,
    ]);
    return rows[0];
  }

  async createOrderItem(data: CreateOrderItemDbDto, client: Pool | PoolClient = pool): Promise<IOrderItem> {
    const query = `
      insert into order_items (order_id, product_id, quantity, unit_price)
      values ($1, $2, $3, $4)
      returning id, order_id, product_id, quantity, unit_price, created_at;
    `;
    const { rows } = await client.query(query, [
      data.order_id,
      data.product_id,
      data.quantity,
      data.unit_price,
    ]);
    return rows[0];
  }

  async findById(id: string, client: Pool | PoolClient = pool): Promise<IOrder | null> {
    const query = `
      select id, user_id, idempotency_key, status, total_amount, expires_at, created_at, updated_at
      from orders
      where id = $1
      limit 1;
    `;
    const { rows } = await client.query(query, [id]);
    if (!rows[0]) return null;

    const items = await this.findItemsByOrderId(id, client);
    return {
      ...rows[0],
      items,
    };
  }

  async findByIdempotencyKey(key: string, client: Pool | PoolClient = pool): Promise<IOrder | null> {
    const query = `
      select id, user_id, idempotency_key, status, total_amount, expires_at, created_at, updated_at
      from orders
      where idempotency_key = $1
      limit 1;
    `;
    const { rows } = await client.query(query, [key]);
    if (!rows[0]) return null;

    const items = await this.findItemsByOrderId(rows[0].id, client);
    return {
      ...rows[0],
      items,
    };
  }

  async findItemsByOrderId(orderId: string, client: Pool | PoolClient = pool): Promise<IOrderItem[]> {
    const query = `
      select id, order_id, product_id, quantity, unit_price, created_at
      from order_items
      where order_id = $1;
    `;
    const { rows } = await client.query(query, [orderId]);
    return rows;
  }

  async findByUserId(userId: string, limit: number = 20, offset: number = 0, client: Pool | PoolClient = pool): Promise<IOrder[]> {
    const query = `
      select id, user_id, idempotency_key, status, total_amount, expires_at, created_at, updated_at
      from orders
      where user_id = $1
      order by created_at desc
      limit $2 offset $3;
    `;
    const { rows } = await client.query(query, [userId, limit, offset]);
    return rows;
  }

  async updateStatus(id: string, status: OrderStatus, client: Pool | PoolClient = pool): Promise<IOrder | null> {
    const query = `
      update orders
      set status = $2, updated_at = now()
      where id = $1
      returning id, user_id, idempotency_key, status, total_amount, expires_at, created_at, updated_at;
    `;
    const { rows } = await client.query(query, [id, status]);
    return rows[0] || null;
  }

  async findExpiredPendingOrders(client: Pool | PoolClient = pool): Promise<IOrder[]> {
    const query = `
      select id, user_id, idempotency_key, status, total_amount, expires_at, created_at, updated_at
      from orders
      where status = 'pending' and expires_at <= now();
    `;
    const { rows } = await client.query(query);
    return rows;
  }
}

export default new OrderRepository();
