import React from 'react';
import { Utensils } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  isScrolled?: boolean;
}

export function Logo({ className = '', isScrolled = false }: LogoProps) {
  const { settings } = useSettings();
  
  if (settings?.logo) {
    return (
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        src={settings.logo}
        alt={settings?.name || 'Restaurant Logo'}
        style={{ 
          width: settings.logoWidth ? `${settings.logoWidth}px` : '32px',
          height: settings.logoHeight ? `${settings.logoHeight}px` : '32px'
        }}
        className={`object-contain ${className}`}
      />
    );
  }

  return (
    <Utensils 
      className={`w-8 h-8 ${
        isScrolled ? 'text-blue-600 dark:text-blue-400' : 'text-white'
      } ${className}`}
    />
  );
}