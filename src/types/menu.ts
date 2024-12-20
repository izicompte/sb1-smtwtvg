import { CartItem } from './cart';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
}

export interface MenuFilters {
  category?: string;
  search?: string;
}