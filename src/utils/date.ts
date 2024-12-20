import { Timestamp } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

export function formatFirestoreTimestamp(timestamp: Timestamp | string | null): string {
  if (!timestamp) return 'Date unavailable';
  
  try {
    const date = timestamp instanceof Timestamp 
      ? timestamp.toDate()
      : new Date(timestamp);
      
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Invalid date format:', timestamp);
    return 'Date unavailable';
  }
}

export function timestampToISO(timestamp: Timestamp | null): string {
  if (!timestamp) return new Date().toISOString();
  return timestamp.toDate().toISOString();
}

export function isoToTimestamp(isoString: string): Timestamp {
  return Timestamp.fromDate(new Date(isoString));
}