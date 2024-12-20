import React from 'react';
import { useTranslation } from '../../../i18n/useTranslation';
import { ArrowLeft, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border:gray-200 dark:border-gray-700">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.goBack')}
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('dashboard.title')}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon size={20} title={t('common.darkMode')} />
            ) : (
              <Sun size={20} title={t('common.lightMode')} />
            )}
          </Button>
          <Button variant="secondary" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t('common.logout')}
          </Button>
        </div>
      </div>
    </header>
  );
}