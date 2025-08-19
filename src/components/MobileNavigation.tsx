
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Info, Settings, Wrench, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
  const [toolsOpen, setToolsOpen] = React.useState(false);
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
    { to: '/base64', label: 'Base64 Encoder/Decoder' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-50 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
              "text-muted-foreground text-xs font-medium min-w-0 flex-1",
              isActive ? "text-primary bg-primary/10" : "hover:text-foreground hover:bg-accent"
            )
          }
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">Home</span>
        </NavLink>

        {/* Tools - opens sheet */}
        <button
          type="button"
          onClick={() => setToolsOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
            "text-muted-foreground text-xs font-medium min-w-0 flex-1 hover:text-foreground hover:bg-accent"
          )}
          aria-label="Open tools menu"
        >
          <Wrench className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">Tools</span>
        </button>

        {/* About */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
              "text-muted-foreground text-xs font-medium min-w-0 flex-1",
              isActive ? "text-primary bg-primary/10" : "hover:text-foreground hover:bg-accent"
            )
          }
        >
          <Info className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">About</span>
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
              "text-muted-foreground text-xs font-medium min-w-0 flex-1",
              isActive ? "text-primary bg-primary/10" : "hover:text-foreground hover:bg-accent"
            )
          }
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">Settings</span>
        </NavLink>

        {/* Login / Account */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
              "text-muted-foreground text-xs font-medium min-w-0 flex-1",
              isActive ? "text-primary bg-primary/10" : "hover:text-foreground hover:bg-accent"
            )
          }
        >
          <User className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{user ? 'Account' : 'Login'}</span>
        </NavLink>
      </div>

      {/* Tools sheet */}
      <Sheet open={toolsOpen} onOpenChange={setToolsOpen}>
        <SheetContent side="left" className="w-80 sm:w-96 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>All Tools</SheetTitle>
          </SheetHeader>
          <div className="p-2">
            <div className="grid grid-cols-1">
              {tools.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  onClick={() => setToolsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block px-4 py-3 text-sm",
                      isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )
                  }
                >
                  {t.label}
                </NavLink>
              ))}
              <NavLink
                to="/tools"
                onClick={() => setToolsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "mt-2 block px-4 py-3 text-sm font-medium rounded-md",
                    isActive ? "text-primary bg-primary/10" : "hover:text-foreground hover:bg-accent"
                  )
                }
              >
                View all tools
              </NavLink>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNavigation;
