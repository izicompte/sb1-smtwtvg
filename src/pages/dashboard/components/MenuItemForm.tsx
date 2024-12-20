import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { MenuItem } from '../../../types';
import { useCategories } from '../../../hooks/useCategories';
import { useSettings } from '../../../hooks/useSettings';

interface MenuItemFormProps {
  item?: MenuItem | null;
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}

export function MenuItemForm({ item, onSave, onCancel }: MenuItemFormProps) {
  const { categories, isLoading: loadingCategories } = useCategories();
  const { settings } = useSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newItem: MenuItem = {
      id: item?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      categoryId: formData.get('categoryId') as string,
      image: formData.get('image') as string,
    };
    onSave(newItem);
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {item ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              name="name"
              defaultValue={item?.name}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={item?.description}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price ({settings?.currency || 'USD'})
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                defaultValue={item?.price}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                defaultValue={item?.categoryId}
                className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
                required
                disabled={loadingCategories}
              >
                {loadingCategories ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <input
              name="image"
              defaultValue={item?.image}
              className="w-full rounded-lg border dark:border-gray-600 p-2 dark:bg-gray-700"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {item ? 'Update' : 'Add'} Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}