import { useState, useEffect } from 'react';
import { settingsService } from '../services/settings/settings.service';
import toast from 'react-hot-toast';

export interface RestaurantSettings {
  name: string;
  description: string;
  coverImage: string;
  currency: 'USD' | 'EUR' | 'XOF';
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data as RestaurantSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load restaurant settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: RestaurantSettings) => {
    try {
      await settingsService.updateSettings(newSettings);
      setSettings(newSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      throw error;
    }
  };

  return { settings, isLoading, updateSettings };
}