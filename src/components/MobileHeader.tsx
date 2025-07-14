
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calculator, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/calculator':
        return 'Calculator';
      case '/about':
        return 'About';
      case '/settings':
        return 'Settings';
      default:
        return 'Timesheet Calculator';
    }
  };

  const showBackButton = location.pathname !== '/';

  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background">
      <div className="flex items-center space-x-2">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Calculator className="h-5 w-5 text-primary mr-2" />
        )}
        <span className="text-lg font-semibold">{getPageTitle()}</span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
};

export default MobileHeader;
