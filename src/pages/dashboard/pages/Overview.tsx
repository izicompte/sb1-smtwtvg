import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../i18n/useTranslation';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { DateRangePicker } from '../components/DateRangePicker';
import { AnalyticsChart } from '../components/AnalyticsChart';
import { AnalyticCard } from '../components/AnalyticCard';
import { CustomerList } from '../components/CustomerList';
import { RecentOrders } from '../components/RecentOrders';
import { RevenueChart } from '../components/RevenueChart';
import { orderService } from '../../../services/orders/order.service';
import { Order } from '../../../types';
import toast from 'react-hot-toast';

export function Overview() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState({ 
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
    to: new Date() 
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const fetchedOrders = await orderService.getOrders({
        dateFrom: dateRange.from,
        dateTo: dateRange.to
      });
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const analytics = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    uniqueCustomers: new Set(orders.map(order => order.customerEmail)).size,
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length 
      : 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('dashboard.overview')}
        </h2>
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onUpdate={setDateRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticCard
          title={t('dashboard.stats.totalRevenue')}
          value={`$${analytics.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <AnalyticCard
          title={t('dashboard.stats.totalOrders')}
          value={analytics.totalOrders.toString()}
          icon={TrendingUp}
          color="blue"
        />
        <AnalyticCard
          title={t('dashboard.stats.uniqueCustomers')}
          value={analytics.uniqueCustomers.toString()}
          icon={Users}
          color="purple"
        />
        <AnalyticCard
          title={t('dashboard.stats.averageOrder')}
          value={`$${analytics.averageOrderValue.toFixed(2)}`}
          icon={Calendar}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">{t('analytics.revenue')}</h3>
          <RevenueChart orders={orders} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">{t('orders.status.title')}</h3>
          <AnalyticsChart data={orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">{t('orders.recent')}</h3>
          <RecentOrders orders={orders.slice(0, 5)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">{t('customers.top')}</h3>
          <CustomerList orders={orders} />
        </motion.div>
      </div>
    </div>
  );
}