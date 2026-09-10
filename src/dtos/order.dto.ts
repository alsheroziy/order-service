import { IOrderItem, OrderStatus } from '@/interfaces/order.interface';

export interface OrderItemInputDto {
  product_id: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItemInputDto[];
}

export interface OrderResponseDto {
  id: string;
  user_id: string;
  idempotency_key: string;
  status: OrderStatus;
  total_amount: number;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
  items: IOrderItem[];
}
