import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LandingPage from "./components/LandingPage";
import MobileNavigation from "./components/MobileNavigation";
import DesktopNavigation from "./components/DesktopNavigation";
import MobileHeader from "./components/MobileHeader";
import ProductivityHub from "./components/ProductivityHub";
import AllToolsPage from "./pages/AllToolsPage";
import TodoPage from "./pages/TodoPage";
import NotesPage from "./pages/NotesPage";
import EMIPage from "./pages/EMIPage";
import PomodoroPage from "./pages/PomodoroPage";
import HabitTrackerPage from "./pages/HabitTrackerPage";
import BudgetPage from "./pages/BudgetPage";
import VaultPage from "./pages/VaultPage";
import TimeTrackerPage from "./pages/TimeTrackerPage";
import PasswordGeneratorPage from "./pages/PasswordGeneratorPage";
import CalculatorPage from "./pages/CalculatorPage";

const queryClient = new QueryClient();

const App = () => {
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <DesktopNavigation />
                <MobileHeader />
                
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<ProductivityHub />} />
                    <Route path="/tools" element={<AllToolsPage />} />
                    <Route path="/todo" element={<TodoPage />} />
                    <Route path="/notes" element={<NotesPage />} />
                    <Route path="/calculator" element={<CalculatorPage />} />
                    <Route path="/password" element={<PasswordGeneratorPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/emi" element={<EMIPage />} />
                    <Route path="/pomodoro" element={<PomodoroPage />} />
                    <Route path="/habits" element={<HabitTrackerPage />} />
                    <Route path="/budget" element={<BudgetPage />} />
                    <Route path="/vault" element={<VaultPage />} />
                    <Route path="/timetracker" element={<TimeTrackerPage />} />
                    <Route path="/goals" element={<div className="p-8 text-center"><h1 className="text-2xl">Goal Tracker - Coming Soon!</h1></div>} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                
                <MobileNavigation />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
