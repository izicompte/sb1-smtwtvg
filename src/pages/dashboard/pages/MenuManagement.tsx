import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '../../../i18n/useTranslation';
import { Button } from '../../../components/ui/Button';
import { MenuItemForm } from '../components/MenuItemForm';
import { MenuItemList } from '../../../components/menu/MenuItemList';
import { MenuItem } from '../../../types';
import { menuService } from '../../../services/menu/menu.service';
import { MenuSearchBar } from '../../../components/menu/dashboard/MenuSearchBar';
import { MenuCategoryFilter } from '../../../components/menu/dashboard/MenuCategoryFilter';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import toast from 'react-hot-toast';

export function MenuManagement() {
  const { t } = useTranslation();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemId?: string;
  }>({ isOpen: false });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const menuItems = await menuService.getMenuItems();
      setItems(menuItems);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: Omit<MenuItem, 'id'>) => {
    try {
      if (editingItem) {
        await menuService.update(editingItem.id, item);
        setItems(prevItems => 
          prevItems.map(i => i.id === editingItem.id ? { ...item, id: editingItem.id } : i)
        );
        toast.success(t('menu.itemUpdated'));
      } else {
        const id = await menuService.create(item);
        setItems(prevItems => [...prevItems, { ...item, id }]);
        toast.success(t('menu.itemAdded'));
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(t('common.error'));
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmation({ isOpen: true, itemId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.itemId) return;
    
    try {
      await menuService.delete(deleteConfirmation.itemId);
      setItems(prevItems => prevItems.filter(item => item.id !== deleteConfirmation.itemId));
      toast.success(t('menu.itemDeleted'));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error(t('common.error'));
    } finally {
      setDeleteConfirmation({ isOpen: false });
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex-1 w-full md:w-auto">
          <MenuSearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <MenuCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            {t('menu.addItem')}
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg h-72 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <MenuItemList
          items={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AnimatePresence>
        {isFormOpen && (
          <MenuItemForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
          />
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        onConfirm={confirmDelete}
        title={t('menu.deleteConfirmTitle')}
        message={t('menu.deleteConfirmMessage')}
      />
    </div>
  );
}