import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../hooks/useSettings';
import { orderService } from '../../services/orders/order.service';
import toast from 'react-hot-toast';
import { Utensils, Truck } from 'lucide-react';
import { OrderConfirmation } from './OrderConfirmation';

interface CheckoutFormData {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  tableNumber?: string;
}

interface CheckoutFormProps {
  onCancel: () => void;
}

type DiningOption = 'dine-in' | 'delivery';
type CheckoutStep = 'form' | 'confirmation';

export function CheckoutForm({ onCancel }: CheckoutFormProps) {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { settings } = useSettings();
  const [diningOption, setDiningOption] = useState<DiningOption>('dine-in');
  const [step, setStep] = useState<CheckoutStep>('form');
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>();

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

  const onSubmit = async (data: CheckoutFormData) => {
    if (step === 'form') {
      setStep('confirmation');
      return;
    }

    try {
      const orderId = await orderService.createOrder({
        items: cart,
        status: 'pending',
        total,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerAddress: diningOption === 'delivery' ? data.address : undefined,
        tableNumber: diningOption === 'dine-in' ? data.tableNumber : undefined,
        diningOption,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success(
        diningOption === 'dine-in' 
          ? 'Commande passée avec succès! Veuillez patienter à votre table.'
          : 'Commande passée avec succès! Nous vous livrerons sous peu.'
      );

      clearCart();
      navigate(`/order/${orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Échec de la commande. Veuillez réessayer.');
      setStep('form');
    }
  };

  const formData = watch();

  return (
    <AnimatePresence mode="wait">
      {step === 'form' ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-6"
        >
          {/* Dining Option Selection */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDiningOption('dine-in')}
              className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors ${
                diningOption === 'dine-in'
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
              }`}
              type="button"
            >
              <Utensils className={`w-8 h-8 ${
                diningOption === 'dine-in' ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <span className="font-medium">Sur place</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDiningOption('delivery')}
              className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors ${
                diningOption === 'delivery'
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'
              }`}
              type="button"
            >
              <Truck className={`w-8 h-8 ${
                diningOption === 'delivery' ? 'text-blue-600' : 'text-gray-500'
              }`} />
              <span className="font-medium">Livraison</span>
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-medium mb-4">Résumé de la commande</h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nom complet
              </label>
              <input
                type="text"
                {...register('name', { required: 'Le nom est requis' })}
                className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email (Optionnel)
              </label>
              <input
                type="email"
                {...register('email', { 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide',
                  }
                })}
                className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                {...register('phone', { 
                  required: 'Le numéro de téléphone est requis',
                  pattern: {
                    value: /^\+?[\d\s-]+$/,
                    message: 'Numéro de téléphone invalide'
                  }
                })}
                className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <AnimatePresence mode="wait">
              {diningOption === 'dine-in' ? (
                <motion.div
                  key="table-number"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium mb-1">
                    Numéro de table
                  </label>
                  <input
                    type="text"
                    {...register('tableNumber', { required: 'Le numéro de table est requis' })}
                    className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2"
                    placeholder="Entrez votre numéro de table"
                  />
                  {errors.tableNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.tableNumber.message}</p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="delivery-address"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium mb-1">
                    Adresse de livraison
                  </label>
                  <textarea
                    {...register('address', { required: "L'adresse de livraison est requise" })}
                    rows={3}
                    className="w-full rounded-lg border dark:border-gray-600 dark:bg-gray-700 p-2"
                    placeholder="Entrez votre adresse de livraison"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="secondary" onClick={onCancel}>
                Retour au panier
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Vérifier la commande
              </Button>
            </div>
          </form>
        </motion.div>
      ) : (
        <OrderConfirmation
          key="confirmation"
          items={cart}
          total={total}
          customerData={{
            ...formData,
            diningOption
          }}
          onConfirm={() => handleSubmit(onSubmit)()}
          onBack={() => setStep('form')}
        />
      )}
    </AnimatePresence>
  );
}