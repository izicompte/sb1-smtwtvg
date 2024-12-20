import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { FirebaseError } from '../../lib/firebase/utils/errorHandling';

class SettingsService {
  private collection = 'settings';
  private document = 'restaurant';

  async getSettings() {
    try {
      const docRef = doc(db, this.collection, this.document);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw new FirebaseError(
        'Failed to fetch settings',
        'read/fetch',
        'settings'
      );
    }
  }

  async updateSettings(settings: any) {
    try {
      const docRef = doc(db, this.collection, this.document);
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw new FirebaseError(
        'Failed to update settings',
        'write/update',
        'settings'
      );
    }
  }
}

export const settingsService = new SettingsService();