import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingModern, LandingMinimal, LandingGrid } from './components/landing';
import { Cart } from './components/cart/Cart';
import { Toast } from './components/ui/Toast';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { Dashboard } from './pages/dashboard/Dashboard';
import { OrderTracking } from './pages/OrderTracking';
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useSettings } from './hooks/useSettings';

export default function App() {
  const { settings } = useSettings();

  const getLandingComponent = () => {
    switch (settings?.activeLanding) {
      case 'minimal':
        return <LandingMinimal />;
      case 'grid':
        return <LandingGrid />;
      default:
        return <LandingModern />;
    }
  };

  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={getLandingComponent()} />
              <Route path="/order/:orderId" element={<OrderTracking />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toast />
          </div>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}