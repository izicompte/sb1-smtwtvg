import React from 'react';
import { Button } from '../../ui/Button';
import { useTranslation } from '../../../i18n/useTranslation';
import { useCategories } from '../../../hooks/useCategories';

interface MenuCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function MenuCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: MenuCategoryFilterProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
      <Button
        variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
        onClick={() => onCategoryChange('all')}
        size="sm"
      >
        {t('menu.allItems')}
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'primary' : 'secondary'}
          onClick={() => onCategoryChange(category.id)}
          size="sm"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}