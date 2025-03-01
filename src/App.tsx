
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import Reminders from "./pages/Reminders";
import CaregiverSettings from "./pages/CaregiverSettings";
import Login from "./pages/Login";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";
import ChatbotCircle from "./components/chatbot/ChatbotCircle";
import { useStore } from "./lib/store";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loadInitialData } = useStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <AnimatePresence mode="wait">
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
