import React, { useState } from 'react';
import { useTranslation } from '../../../i18n/useTranslation';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Settings, List, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface DashboardSidebarProps {
  currentPage: string;
}

export function DashboardSidebar({ currentPage }: DashboardSidebarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: '', icon: LayoutDashboard, label: t('dashboard.overview') },
    { id: 'pos', icon: Store, label: t('dashboard.pos') },
    { id: 'categories', icon: List, label: t('dashboard.categories') },
    { id: 'menu', icon: UtensilsCrossed, label: t('dashboard.menu') },
    { id: 'orders', icon: ShoppingBag, label: t('dashboard.orders') },
    { id: 'settings', icon: Settings, label: t('dashboard.settings') }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      className="relative bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full"
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/dashboard/${item.id}`)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
              currentPage === item.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {currentPage === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <item.icon className="w-5 h-5 relative z-10" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative z-10 whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </nav>
    </motion.aside>
  );
}