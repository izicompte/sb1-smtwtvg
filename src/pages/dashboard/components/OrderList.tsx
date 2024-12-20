import React from 'react';
import { Order, OrderStatus } from '../../../types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderCard } from '../../../components/orders/OrderCard';

interface OrderListProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

export function OrderList({ orders, onStatusChange }: OrderListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AnimatePresence mode="popLayout">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={onStatusChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}