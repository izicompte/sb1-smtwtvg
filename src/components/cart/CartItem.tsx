import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Plus, Minus, X } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { t } = useTranslation();
  const { updateQuantity, removeFromCart } = useCart();
  const { settings } = useSettings();

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
    <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
      <div className="flex-1">
        <h4 className="font-medium dark:text-white">{item.name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {formatPrice(item.price)} × {item.quantity}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Minus size={16} />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus size={16} />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => removeFromCart(item.id)}
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}