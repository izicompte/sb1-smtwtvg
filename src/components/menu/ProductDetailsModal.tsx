import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '../../types';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { useTranslation } from '../../i18n/useTranslation';

interface ProductDetailsModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function ProductDetailsModal({ item, onClose }: ProductDetailsModalProps) {
  const { t } = useTranslation();
  const { addToCart, cart } = useCart();
  const { settings } = useSettings();
  const itemInCart = item ? cart.find(cartItem => cartItem.id === item.id) : null;

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

  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
        >
          <div className="relative h-64 md:h-96">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(item.price)}
              </span>
            </div>

            <Button
              onClick={() => {
                addToCart(item);
                onClose();
              }}
              className="w-full"
            >
              {itemInCart ? t('menu.addMore') : t('menu.addToCart')}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}