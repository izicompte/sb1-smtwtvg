import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MenuItem } from '../../../types';
import { useCart } from '../../../context/CartContext';
import { useSettings } from '../../../hooks/useSettings';
import { MenuItemImage } from '../MenuItemImage';

interface MinimalMenuItemProps {
  item: MenuItem;
}

export function MinimalMenuItem({ item }: MinimalMenuItemProps) {
  const { addToCart, cart } = useCart();
  const { settings } = useSettings();
  const itemInCart = cart.find(cartItem => cartItem.id === item.id);

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
    >
      <MenuItemImage
        item={item}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-lg font-medium mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={() => addToCart(item)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />
            {itemInCart ? 'Add More' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}