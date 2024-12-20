import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { MenuItem } from '../../types';
import { MenuItemCard } from './MenuItemCard';

interface MenuItemListProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export function MenuItemList({ items, onEdit, onDelete }: MenuItemListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}