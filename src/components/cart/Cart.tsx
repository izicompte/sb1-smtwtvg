import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { ShoppingCart, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { Button } from '../ui/Button';
import { CheckoutForm } from '../checkout/CheckoutForm';
import { motion, AnimatePresence } from 'framer-motion';

export function Cart() {
  const { t } = useTranslation();
  const { cart, total } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (cart.length === 0) {
    return null;
  }

  const handleCheckoutSuccess = () => {
    setIsCheckingOut(false);
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {cart.length}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-800 shadow-xl z-50"
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <ShoppingCart className="mr-2" /> {t('cart.title')}
                    </h3>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {isCheckingOut ? (
                    <CheckoutForm
                      onSuccess={handleCheckoutSuccess}
                      onCancel={() => setIsCheckingOut(false)}
                    />
                  ) : (
                    <AnimatePresence>
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <CartItem item={item} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
                
                {!isCheckingOut && (
                  <div className="p-4 border-t dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold dark:text-white">{t('cart.total')}</span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    <Button onClick={() => setIsCheckingOut(true)} className="w-full">
                      {t('cart.checkout')}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}