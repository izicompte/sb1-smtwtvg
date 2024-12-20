import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  onSnapshot,
  getDoc,
  QuerySnapshot,
  FirebaseError
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { Order, OrderStatus } from '../../types';
import type { OrderFilters } from './types';

class OrderService {
  private collection = 'orders';

  subscribeToOrders(
    onUpdate: (orders: Order[]) => void,
    onError: (error: Error) => void
  ) {
    try {
      const q = query(
        collection(db, this.collection),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(
        q,
        (snapshot: QuerySnapshot) => {
          const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          onUpdate(orders);
        },
        (error: FirebaseError) => {
          console.error('Firestore subscription error:', error);
          onError(error);
        }
      );
    } catch (error) {
      console.error('Error setting up orders subscription:', error);
      throw error;
    }
  }

  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    try {
      let q = collection(db, this.collection);
      const constraints = [];

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters?.dateFrom) {
        constraints.push(where('createdAt', '>=', Timestamp.fromDate(filters.dateFrom)));
      }

      if (filters?.dateTo) {
        constraints.push(where('createdAt', '<=', Timestamp.fromDate(filters.dateTo)));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, this.collection, orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Order;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  subscribeToOrder(orderId: string, callback: (order: Order) => void) {
    const docRef = doc(db, this.collection, orderId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as Order);
      }
    });
  }

  async createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
    try {
      const order = {
        items: orderData.items.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          categoryId: item.categoryId || null
        })),
        status: 'pending' as OrderStatus,
        total: Number(orderData.total),
        customerName: String(orderData.customerName).trim(),
        customerEmail: orderData.customerEmail ? String(orderData.customerEmail).trim() : null,
        customerPhone: String(orderData.customerPhone).trim(),
        customerAddress: orderData.customerAddress ? String(orderData.customerAddress).trim() : null,
        tableNumber: orderData.tableNumber ? String(orderData.tableNumber).trim() : null,
        diningOption: orderData.diningOption,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      if (!order.customerName || !order.customerPhone) {
        throw new Error('Missing required customer information');
      }

      if (order.diningOption === 'delivery' && !order.customerAddress) {
        throw new Error('Delivery address is required for delivery orders');
      }

      if (order.diningOption === 'dine-in' && !order.tableNumber) {
        throw new Error('Table number is required for dine-in orders');
      }

      if (!order.items.length) {
        throw new Error('Order must contain at least one item');
      }

      const docRef = await addDoc(collection(db, this.collection), order);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    try {
      const docRef = doc(db, this.collection, orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();