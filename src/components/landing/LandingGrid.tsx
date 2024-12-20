import React from 'react';
import { Header } from '../layout/Header';
import { GridMenuSection } from '../menu/grid/GridMenuSection';
import { Container } from '../ui/Container';
import { Cart } from '../cart/Cart';
import { useSettings } from '../../hooks/useSettings';
import { Clock, MapPin, Phone } from 'lucide-react';

export function LandingGrid() {
  const { settings } = useSettings();

  const coverImage = settings?.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';

  return (
    <>
      <Header />
      <div 
        className="relative bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-transparent" />
        
        <Container className="relative z-10 py-20 text-white">
          {/* Hero Content */}
          <div className="flex flex-col items-center text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              {settings?.name || 'Fine Dining Experience'}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl text-gray-200">
              {settings?.description || 'Experience culinary excellence with our carefully crafted menu of fresh ingredients and innovative recipes.'}
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard
              icon={Clock}
              title="Hours"
              description={`${settings?.openingHours?.monday?.open || '11:00'} - ${settings?.openingHours?.monday?.close || '22:00'}`}
            />
            <InfoCard
              icon={MapPin}
              title={settings?.address || 'Our Location'}
              description={settings?.address || '123 Gourmet Street'}
            />
            <InfoCard
              icon={Phone}
              title={settings?.phone || 'Contact Us'}
              description={settings?.phone ? `Call us at ${settings?.phone}` : 'Call us to book'}
            />
          </div>
        </Container>
      </div>

      <main className="bg-white dark:bg-gray-900 transition-colors">
        <Container>
          <section id="menu" className="py-16">
            <GridMenuSection />
          </section>
        </Container>
      </main>

      <Cart />
    </>
  );
}

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <div className="bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-gray-200 dark:border-white/20 shadow-sm transition-colors text-gray-900 dark:text-gray-100">
      <div className="flex items-center space-x-3 mb-3">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
