import React from 'react';
import { Header } from '../layout/Header';
import { MinimalMenuSection } from '../menu/minimal/MinimalMenuSection';
import { Container } from '../ui/Container';
import { Cart } from '../cart/Cart';
import { useSettings } from '../../hooks/useSettings';

export function LandingMinimal() {
  const { settings } = useSettings();

  const restaurantName = settings?.name || 'Culinary Delights';
  const restaurantDescription = settings?.description || 'A modern dining experience that blends simplicity with exquisite tastes.';

  return (
    <>
      <Header />
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <Container>
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">
              {restaurantName}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {restaurantDescription}
            </p>
          </div>
        </Container>
      </div>
      <main className="bg-white dark:bg-gray-900 transition-colors">
        <Container>
          <section id="menu" className="py-16">
            <MinimalMenuSection />
          </section>
        </Container>
      </main>
      <Cart />
    </>
  );
}
