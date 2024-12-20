
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Overview } from './pages/Overview';
import { CategoryManagement } from './pages/CategoryManagement';
import { MenuManagement } from './pages/MenuManagement';
import { OrderManagement } from './pages/OrderManagement';
import { Settings } from './pages/Settings';
import { POS } from './pages/POS';
import { Toast } from '../../components/ui/Toast';
import { authService } from '../../services/auth/auth.service';
import toast from 'react-hot-toast';

export function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <>
      <DashboardLayout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
      <Toast />
    </>
  );
}
