
import React from 'react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { useCategories } from '../../hooks/useCategories';

interface MenuFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MenuFilters({ activeCategory, onCategoryChange }: MenuFiltersProps) {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center mb-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative mb-12">
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant={activeCategory === 'all' ? 'primary' : 'secondary'}
          onClick={() => onCategoryChange('all')}
          className="relative px-6 py-2"
        >
          {activeCategory === 'all' && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">All Items</span>
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'primary' : 'secondary'}
            onClick={() => onCategoryChange(category.id)}
            className="relative px-6 py-2"
          >
            {activeCategory === category.id && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}