
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calculator, Info, Settings, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavigation: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/todo', icon: CheckSquare, label: 'To-Do' },
    { to: '/calculator', icon: Calculator, label: 'Calculator' },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-50 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                "text-muted-foreground text-xs font-medium min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10"
                  : "hover:text-foreground hover:bg-accent"
              )
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
