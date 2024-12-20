import React from 'react';
import { motion } from 'framer-motion';
import { Order } from '../../types';
import { OrderTimeline } from './OrderTimeline';
import { Button } from '../ui/Button';
import { formatFirestoreTimestamp } from '../../utils/date';
import { Utensils, Truck } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: string) => void;
}

export const OrderCard = React.forwardRef<HTMLDivElement, OrderCardProps>(
  ({ order, onStatusChange }, ref) => {
    const getNextStatus = () => {
      const flow = {
        pending: 'preparing',
        preparing: 'ready',
        ready: 'delivered',
        delivered: null,
        cancelled: null
      };
      return flow[order.status];
    };

    const statusStyles = {
      pending: 'bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-100',
      preparing: 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100',
      ready: 'bg-orange-100 dark:bg-orange-900/50 text-orange-900 dark:text-orange-100',
      delivered: 'bg-green-100 dark:bg-green-900/50 text-green-900 dark:text-green-100',
      cancelled: 'bg-gray-100 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100'
    };

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`rounded-lg shadow-sm p-6 ${statusStyles[order.status]}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Order #{order.id.slice(0, 8)}
              {order.diningOption === 'dine-in' ? (
                <span className="flex items-center text-sm px-2 py-1 bg-black/10 rounded-full">
                  <Utensils className="w-4 h-4 mr-1" />
                  Dine-in (Table {order.tableNumber})
                </span>
              ) : (
                <span className="flex items-center text-sm px-2 py-1 bg-black/10 rounded-full">
                  <Truck className="w-4 h-4 mr-1" />
                  Delivery
                </span>
              )}
            </h3>
            <p className="text-sm opacity-75">
              {formatFirestoreTimestamp(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              ${order.total.toFixed(2)}
            </p>
            <p className="text-sm opacity-75">
              {order.items.length} items
            </p>
          </div>
        </div>

        <OrderTimeline
          status={order.status}
          createdAt={order.createdAt}
          updatedAt={order.updatedAt}
        />

        <div className="mt-6">
          <h4 className="font-medium mb-2">
            Customer Details
          </h4>
          <div className="text-sm opacity-75 space-y-1">
            <p>{order.customerName}</p>
            <p>{order.customerPhone}</p>
            <p>{order.customerEmail}</p>
            {order.diningOption === 'delivery' && (
              <p className="font-medium">Delivery Address: {order.customerAddress}</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-current/10 pt-4">
          <h4 className="font-medium mb-2">
            Order Items
          </h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {getNextStatus() && (
          <div className="mt-6">
            <Button
              onClick={() => onStatusChange(order.id, getNextStatus()!)}
              className="w-full bg-black hover:bg-gray-900 text-white dark:bg-black dark:hover:bg-gray-900 dark:text-white"
            >
              Mark as {getNextStatus()}
            </Button>
          </div>
        )}
      </motion.div>
    );
  }
);

OrderCard.displayName = 'OrderCard';