import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenu } from '../../../hooks/useMenu';
import { useCategories } from '../../../hooks/useCategories';
import { MenuItem, CartItem } from '../../../types';
import { orderService } from '../../../services/orders/order.service';
import { useSettings } from '../../../hooks/useSettings';
import { Button } from '../../../components/ui/Button';
import { Search, Plus, Minus, Trash2, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

export function POS() {
  const { items, isLoading } = useMenu();
  const { categories } = useCategories();
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const addToCart = (item: MenuItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(currentCart => {
      return currentCart.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== itemId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!tableNumber) {
      toast.error('Please enter a table number');
      return;
    }

    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      await orderService.createOrder({
        items: cart,
        status: 'pending',
        total,
        customerName: `Table ${tableNumber}`,
        customerEmail: 'dine-in@restaurant.com',
        customerPhone: '000',
        diningOption: 'dine-in',
        tableNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      toast.success('Order created successfully');
      setCart([]);
      setTableNumber('');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6">
      {/* Menu Section */}
      <div className="flex-1 flex flex-col">
        {/* Search and Categories */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory('all')}
            >
              All Items
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(item)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg text-left shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(item.price)}
                  </p>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Receipt className="w-5 h-5 mr-2" />
          Current Order
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Table Number</label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full rounded-lg border dark:border-gray-700 p-2"
            placeholder="Enter table number"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {cart.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between py-2 border-b dark:border-gray-700"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(total)}
            </span>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full"
            disabled={cart.length === 0 || !tableNumber}
          >
            Create Order
          </Button>
        </div>
      </div>
    </div>
  );
}