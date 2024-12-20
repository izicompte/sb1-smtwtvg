export type LandingTemplate = 'modern' | 'minimal' | 'grid';

export interface RestaurantSettings {
  name: string;
  description: string;
  logo: string;
  logoWidth?: number;
  logoHeight?: number;
  coverImage: string;
  currency: 'USD' | 'EUR' | 'XOF';
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  address: string;
  phone: string;
  activeLanding: LandingTemplate;
}