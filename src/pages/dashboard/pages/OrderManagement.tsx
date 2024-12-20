import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderList } from '../components/OrderList';
import { OrderStats } from '../components/OrderStats';
import { OrderFilters } from '../components/OrderFilters';
import { OrderStatus } from '../../../types';
import { orderService } from '../../../services/orders/order.service';
import { useOrdersRealtime } from '../../../hooks/useOrdersRealtime';
import toast from 'react-hot-toast';

export function OrderManagement() {
  const { orders, isLoading } = useOrdersRealtime();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // Filter orders based on current filters
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const orderDate = new Date(order.createdAt);
        if (dateRange.from && orderDate < dateRange.from) {
          return false;
        }
        if (dateRange.to && orderDate > dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, dateRange]);

  // Calculate stats based on filtered orders
  const stats = useMemo(() => ({
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    preparing: filteredOrders.filter(o => o.status === 'preparing').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length
  }), [filteredOrders]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <OrderStats stats={stats} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <OrderFilters
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OrderList
              orders={filteredOrders}
              onStatusChange={handleStatusChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}