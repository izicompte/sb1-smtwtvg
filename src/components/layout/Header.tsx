import React, { useEffect, useState } from 'react';
import { Sun, Moon, Menu, X, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { useSettings } from '../../hooks/useSettings';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';

interface HeaderProps {
  onDashboardOpen?: () => void;
}

export function Header({ onDashboardOpen }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings, isLoading } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Logo isScrolled={isScrolled} />
            {!isLoading && (
              <h1 className={`text-2xl md:text-3xl font-bold transition-colors ${
                isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'
              }`}>
                {settings?.name || 'Restaurant Name'}
              </h1>
            )}
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="#menu" isScrolled={isScrolled}>Menu</NavLink>
            <NavLink href="#about" isScrolled={isScrolled}>About</NavLink>
            <NavLink href="#contact" isScrolled={isScrolled}>Contact</NavLink>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              className="ml-4"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClick}
              className="flex items-center space-x-2"
            >
              <Settings size={20} />
              <span>Dashboard</span>
            </Button>
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onDashboardOpen}
              className="flex items-center"
            >
              <Settings size={20} />
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className={isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'} />
              ) : (
                <Menu className={isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 space-y-4"
            >
              <MobileNavLink href="#menu" onClick={() => setIsMobileMenuOpen(false)}>
                Menu
              </MobileNavLink>
              <MobileNavLink href="#about" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </MobileNavLink>
              <MobileNavLink href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </MobileNavLink>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}

function NavLink({ href, children, isScrolled }: { href: string; children: React.ReactNode; isScrolled: boolean }) {
  return (
    <a
      href={href}
      className={`text-sm font-medium transition-colors hover:text-blue-500 ${
        isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
      }`}
    >
      {children}
    </a>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400"
    >
      {children}
    </a>
  );
}