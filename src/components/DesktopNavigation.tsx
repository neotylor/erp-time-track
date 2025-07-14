
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calculator, Info, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const DesktopNavigation: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/calculator', icon: Calculator, label: 'Calculator' },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div className="flex items-center space-x-2">
        <Calculator className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">Timesheet Calculator</span>
      </div>
      
      <nav className="flex items-center space-x-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="ml-2"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </nav>
    </header>
  );
};

export default DesktopNavigation;
