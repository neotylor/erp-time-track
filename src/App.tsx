
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import About from "./pages/About";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LandingPage from "./components/LandingPage";
import MobileNavigation from "./components/MobileNavigation";
import DesktopNavigation from "./components/DesktopNavigation";
import MobileHeader from "./components/MobileHeader";

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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <DesktopNavigation />
              <MobileHeader />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/calculator" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              <MobileNavigation />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
