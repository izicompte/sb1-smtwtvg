import { Order, OrderStatus } from '../../types';

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface OrderStats {
  total: number;
  pending: number;
  preparing: number;
  delivered: number;
}

export interface OrderServiceError extends Error {
  code: string;
}