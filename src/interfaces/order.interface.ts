export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface IOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: Date;
}

export interface IOrder {
  id: string;
  user_id: string;
  idempotency_key: string;
  status: OrderStatus;
  total_amount: number;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  items?: IOrderItem[];
}
