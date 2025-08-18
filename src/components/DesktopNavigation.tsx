
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Info, Settings, Sun, Moon, Wrench, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

const DesktopNavigation: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [toolsOpen, setToolsOpen] = React.useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/about', icon: Info, label: 'About' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const tools = [
    { to: '/calculator', label: 'Timesheet Calculator' },
    { to: '/todo', label: 'Todo List' },
    { to: '/notes', label: 'Notes' },
    { to: '/emi', label: 'EMI Calculator' },
    { to: '/pomodoro', label: 'Pomodoro Timer' },
    { to: '/habits', label: 'Habit Tracker' },
    { to: '/budget', label: 'Budget Planner' },
    { to: '/vault', label: 'Secure Vault' },
    { to: '/timetracker', label: 'Time Tracker' },
    { to: '/password', label: 'Password Generator' },
  ];

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div className="flex items-center space-x-2">
        <Wrench className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">Tools Hub Pro</span>
      </div>
      
      <nav className="flex items-center space-x-1">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )
          }
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </NavLink>

        {/* Tools - hover shows submenu, click navigates to /tools */}
        <div
          className="relative"
          onMouseEnter={() => setToolsOpen(true)}
          onMouseLeave={() => setToolsOpen(false)}
        >
          <NavLink
            to="/tools"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )
            }
          >
            <Wrench className="h-4 w-4" />
            <span>Tools</span>
          </NavLink>

          {toolsOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 w-72 rounded-md border bg-popover p-2 shadow-md animate-fade-in">
              <div className="grid grid-cols-1 gap-1">
                {tools.map((t) => (
                  <NavLink
                    key={t.to}
                    to={t.to}
                    className={({ isActive }) =>
                      cn(
                        "block px-3 py-2 rounded-md text-sm",
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )
                    }
                  >
                    {t.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* About and Settings */}
        {navItems.filter(i => i.to !== '/').map(({ to, icon: Icon, label }) => (
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

        {/* Login / Account */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )
          }
        >
          <User className="h-4 w-4" />
          <span>{user ? 'Account' : 'Login'}</span>
        </NavLink>

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
