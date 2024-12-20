import React from 'react';
import { CartItem as CartItemType } from '../../types';

interface CartSummaryProps {
  items: CartItemType[];
  total: number;
}

export function CartSummary({ items, total }: CartSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between mb-2">
          <span>{item.name} × {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="border-t mt-4 pt-4">
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}