import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Category } from '../../../types';
import { Button } from '../../../components/ui/Button';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(category)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(category.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}