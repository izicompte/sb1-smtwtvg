import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Order } from '../types';
import { orderService } from '../services/orders/order.service';
import { OrderTimeline } from '../components/orders/OrderTimeline';
import { Button } from '../components/ui/Button';
import { useSettings } from '../hooks/useSettings';
import { formatFirestoreTimestamp } from '../utils/date';
import { ArrowLeft, MapPin, Phone, Utensils, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    loadOrder();
    // Set up real-time listener
    const unsubscribe = orderService.subscribeToOrder(orderId!, (updatedOrder) => {
      setOrder(updatedOrder);
    });

    return () => unsubscribe();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const orderData = await orderService.getOrderById(orderId!);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    switch (settings?.currency) {
      case 'EUR':
        return `€${price.toFixed(2)}`;
      case 'XOF':
        return `${price.toFixed(0)} FCFA`;
      default:
        return `$${price.toFixed(2)}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Order #{order.id.slice(0, 8)}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Placed {formatFirestoreTimestamp(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(order.total)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.items.length} items
                </p>
              </div>
            </div>

            {/* Order Type Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
              {order.diningOption === 'dine-in' ? (
                <>
                  <Utensils className="w-4 h-4 mr-2" />
                  Dine-in (Table {order.tableNumber})
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  Delivery
                </>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="p-6 border-b dark:border-gray-700">
            <OrderTimeline
              status={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />
          </div>

          {/* Order Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    {order.customerPhone}
                  </p>
                  {order.diningOption === 'delivery' && (
                    <p className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {order.customerAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}