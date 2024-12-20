import { FirestoreService } from '../base/firestore.service';
import { MenuItem } from '../../types';
import type { MenuFilters } from './types';
import { where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { FirebaseError } from '../../lib/firebase/utils/errorHandling';

class MenuService extends FirestoreService<MenuItem> {
  constructor() {
    super('menu_items');
  }

  async getMenuItems(filters?: MenuFilters): Promise<MenuItem[]> {
    try {
      let q = collection(db, this.collectionName);
      const constraints = [];

      if (filters?.category && filters.category !== 'all') {
        constraints.push(where('category', '==', filters.category));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MenuItem));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw new FirebaseError(
        'Failed to fetch menu items',
        'read/fetch-all',
        'menu_items'
      );
    }
  }

  async create(item: Omit<MenuItem, 'id'>): Promise<string> {
    try {
      return await super.create(item);
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw new FirebaseError(
        'Failed to create menu item',
        'create',
        'menu_items'
      );
    }
  }

  async update(id: string, item: Partial<MenuItem>): Promise<void> {
    try {
      await super.update(id, item);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new FirebaseError(
        'Failed to update menu item',
        'update',
        'menu_items'
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await super.delete(id);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw new FirebaseError(
        'Failed to delete menu item',
        'delete',
        'menu_items'
      );
    }
  }
}

export const menuService = new MenuService();