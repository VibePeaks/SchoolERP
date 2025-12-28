import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import ParentLogin from "./pages/ParentLogin";
import HostelManagement from "./pages/HostelManagement";
import StudentDashboard from "./pages/StudentDashboard";
import ParentPortalManagement from "./components/ParentPortal/ParentPortalManagement";
import PrivateRoute from "@/components/PrivateRoute";
import SubscriptionProtectedRoute from "@/components/SubscriptionProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { GamificationProvider } from "@/contexts/GamificationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <GamificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/parent/login" element={<ParentLogin />} />
              <Route path="/parent-portal" element={<ParentPortalManagement />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Index />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hostel"
                element={
                  <SubscriptionProtectedRoute requiredPlan="enterprise" moduleName="Hostel Management System">
                    <HostelManagement />
                  </SubscriptionProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GamificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
