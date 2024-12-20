import { CartItem } from './cart';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  customerAddress?: string | null;
  tableNumber?: string | null;
  diningOption: 'dine-in' | 'delivery';
  createdAt: any;
  updatedAt: any;
}