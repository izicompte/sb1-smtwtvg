import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { CartItem } from '../../types';
import { useSettings } from '../../hooks/useSettings';

interface OrderConfirmationProps {
  items: CartItem[];
  total: number;
  customerData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    tableNumber?: string;
    diningOption: 'dine-in' | 'delivery';
  };
  onConfirm: () => void;
  onBack: () => void;
}

export function OrderConfirmation({
  items,
  total,
  customerData,
  onConfirm,
  onBack
}: OrderConfirmationProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          Confirmer votre commande
        </h2>
      </div>

      {/* Customer Details */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium mb-3">Détails du client</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-500">Nom:</span> {customerData.name}</p>
          <p><span className="text-gray-500">Téléphone:</span> {customerData.phone}</p>
          {customerData.email && (
            <p><span className="text-gray-500">Email:</span> {customerData.email}</p>
          )}
          {customerData.diningOption === 'delivery' ? (
            <p><span className="text-gray-500">Adresse de livraison:</span> {customerData.address}</p>
          ) : (
            <p><span className="text-gray-500">Numéro de table:</span> {customerData.tableNumber}</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="border dark:border-gray-700 rounded-lg divide-y dark:divide-gray-700">
        {items.map(item => (
          <div key={item.id} className="p-4 flex justify-between items-center">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <p className="font-medium">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
        <div className="p-4 flex justify-between items-center font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="secondary"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <Button
          onClick={onConfirm}
          className="flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Confirmer la commande
        </Button>
      </div>
    </motion.div>
  );
}