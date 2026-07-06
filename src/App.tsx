import { useState, useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import { LanguageProvider } from "@/hooks/useLanguage";
import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import StoresPage from "./pages/StoresPage";
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
import MerchantLogin from "./pages/MerchantLogin";
import AdminPanel from "./pages/AdminPanel";
import SettingsPage from "./pages/SettingsPage";
import MerchantDashboard from "./pages/MerchantDashboard";
import NotFound from "./pages/NotFound";
import NotificationsPage from "./pages/NotificationsPage";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // حالة تسجيل الدخول
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  // التحقق من التخزين المحلي لمعرفة هل المستخدم مسجل دخول أم لا
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      if (authStatus === "true") {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  // مكون داخلي لتنفيذ منطق الحماية (Redirect)
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      // إذا لم يكن مسجلاً، أرسله لصفحة الدخول
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          <BrowserRouter>
            <Routes>
              {/* صفحة تسجيل الدخول لا تحتاج حماية */}
              <Route path="/login" element={<MerchantLogin onLoginSuccess={() => setIsAuthenticated(true)} />} />
              
              {/* باقي الصفحات محمية */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/stores" element={<ProtectedRoute><StoresPage /></ProtectedRoute>} />
              <Route path="/store/:id" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
              <Route path="/product/:id" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><MerchantDashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
