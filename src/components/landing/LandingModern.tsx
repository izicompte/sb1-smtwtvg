import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { Header } from '../layout/Header';
import { Hero } from '../layout/Hero';
import { MenuSection } from '../menu/MenuSection';
import { Container } from '../ui/Container';
import { Cart } from '../cart/Cart';

export function LandingModern() {
  const { t } = useTranslation();
  
  return (
    <>
      <Header />
      <Hero />
      <main className="pt-20">
        <Container>
          <section id="menu" className="py-16">
            <h2 className="text-3xl font-bold mb-8">{t('menu.title')}</h2>
            <MenuSection />
          </section>
        </Container>
      </main>
      <Cart />
    </>
  );
}