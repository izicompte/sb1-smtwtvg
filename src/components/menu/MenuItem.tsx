import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { MenuItem as MenuItemType } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { MenuItemImage } from './MenuItemImage';
import { useTranslation } from '../../i18n/useTranslation';

interface MenuItemProps {
  item: MenuItemType;
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(({ item }, ref) => {
  const { t } = useTranslation();
  const { addToCart, cart } = useCart();
  const { settings } = useSettings();
  const itemInCart = cart.find((cartItem) => cartItem.id === item.id);

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
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <MenuItemImage item={item} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {itemInCart && (
          <Badge variant="success" className="absolute top-3 right-3 z-10">
            {t('menu.inCart')} ({itemInCart.quantity})
          </Badge>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.name}
          </h3>
          <span className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatPrice(item.price)}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm line-clamp-2">
          {item.description}
        </p>
        
        <Button 
          onClick={() => addToCart(item)} 
          className="w-full transform transition-all duration-300 group-hover:scale-105"
        >
          {itemInCart ? (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t('menu.addMore')}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              {t('menu.addToCart')}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
});

MenuItem.displayName = 'MenuItem';