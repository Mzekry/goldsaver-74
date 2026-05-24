
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/Auth";
import Market from "./pages/Market";
import Wallet from "./pages/Wallet";
import Settings from "./pages/Settings";
import AddRecord from "./pages/AddRecord";
import Splash from "./pages/Splash";
import { AuthProvider } from "./contexts/AuthContext";
import { GoldProvider } from "./contexts/GoldContext";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Demo mode: bypass auth — remove this comment and restore the guard when Supabase is ready
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/splash" element={<Splash />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <GoldProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/market" element={<Market />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/add-record" element={<AddRecord />} />
                <Route path="/add-record/:id" element={<AddRecord />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </GoldProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
