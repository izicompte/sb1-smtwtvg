import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export function Hero() {
  const { settings } = useSettings();

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 h-full">
        <img 
          src={settings?.coverImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80"}
          alt="Restaurant ambiance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </div>
      
      {/* Hero Content */}
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-8"
        >
          {/* Restaurant Name & Description */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white"
            >
              {settings?.name || 'Fine Dining Experience'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-200 leading-relaxed"
            >
              {settings?.description || 'Experience culinary excellence with our carefully crafted menu featuring fresh ingredients and innovative recipes.'}
            </motion.p>
          </div>

          {/* Info Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <InfoCard 
              icon={Clock}
              title="Opening Hours"
              description={`${settings?.openingHours?.monday?.open || '11:00'} - ${settings?.openingHours?.monday?.close || '22:00'}`}
            />
            <InfoCard 
              icon={MapPin}
              title="Location"
              description={settings?.address || '123 Gourmet Street'}
            />
            <InfoCard 
              icon={Phone}
              title="Contact"
              description={settings?.phone || 'Call us to book'}
            />
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={scrollToMenu}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              View Menu
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description }: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white/90 dark:bg-white/10 dark:backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-gray-100 transition-colors"
    >
      <Icon className="w-8 h-8 mb-4 text-blue-500 dark:text-blue-400" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}
