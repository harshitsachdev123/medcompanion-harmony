
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import Reminders from "./pages/Reminders";
import CaregiverSettings from "./pages/CaregiverSettings";
import Login from "./pages/Login";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import ChatbotCircle from "./components/chatbot/ChatbotCircle";
import { useStore } from "./lib/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loadInitialData } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await loadInitialData();
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    load();
  }, [loadInitialData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-med-blue-600 text-xl">Loading MedCompanion...</div>
      </div>
    );
  }

  // Check if we're using mock Supabase credentials
  const isMockMode = 
    !import.meta.env.VITE_SUPABASE_URL || 
    import.meta.env.VITE_SUPABASE_URL.includes('your-project') ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-anon-key');

  return (
    <AnimatePresence mode="wait">
      {isMockMode && (
        <Alert className="mb-4 border-amber-500 bg-amber-50">
          <AlertTitle className="text-amber-800">Supabase Configuration Missing</AlertTitle>
          <AlertDescription className="text-amber-700">
            You're running in local demo mode with sample data. To enable full functionality, 
            connect to a Supabase database and set the environment variables.
          </AlertDescription>
        </Alert>
      )}
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/medications" element={<Medications />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/caregiver" element={<CaregiverSettings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
        <ChatbotCircle />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
