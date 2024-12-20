import { useState, useEffect } from 'react';
import { orderService } from '../services/orders/order.service';
import { Order } from '../types';
import toast from 'react-hot-toast';

export function useOrdersRealtime() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = orderService.subscribeToOrders((updatedOrders) => {
      setOrders(updatedOrders);
      setIsLoading(false);
    }, (error) => {
      console.error('Error in orders subscription:', error);
      toast.error('Failed to get real-time updates');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { orders, isLoading };
}