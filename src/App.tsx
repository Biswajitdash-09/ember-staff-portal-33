
/**
 * Main Application Component
 * Sets up routing, theme provider, and global UI components
 * Configures React Query for data fetching and state management
 * Now includes Employee Authentication Context
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { EmployeeAuthProvider } from "@/contexts/EmployeeAuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import QuickActionsPage from "./pages/QuickActionsPage";
import EmployeeRecords from "./pages/EmployeeRecords";
import HRManagement from "./pages/HRManagement";
import PayrollSystem from "./pages/PayrollSystem";
import LeaveManagement from "./pages/LeaveManagement";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import TimeTracking from "./pages/TimeTracking";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import SystemSettings from "./pages/SystemSettings";
import NotFound from "./pages/NotFound";

// Configure React Query client for data fetching
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Theme management (dark/light mode) */}
    <ThemeProvider defaultTheme="system" storageKey="lovable-ui-theme">
      {/* Employee authentication context for employee portal */}
      <EmployeeAuthProvider>
        {/* Tooltip accessibility provider */}
        <TooltipProvider>
          {/* Toast notification systems */}
          <Toaster />
          <Sonner />
          
          {/* Application routing setup */}
          <BrowserRouter>
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<Index />} />
              
              {/* Admin dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Employee dashboard - now with real authentication */}
              <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
              
              {/* Quick actions interface */}
              <Route path="/quick-actions" element={<QuickActionsPage />} />
              
              {/* HR Management modules */}
              <Route path="/employees" element={<EmployeeRecords />} />
              <Route path="/hr" element={<HRManagement />} />
              <Route path="/payroll" element={<PayrollSystem />} />
              <Route path="/leave" element={<LeaveManagement />} />
              <Route path="/performance" element={<PerformanceAnalytics />} />
              <Route path="/time-tracking" element={<TimeTracking />} />
              <Route path="/reports" element={<ReportsAnalytics />} />
              <Route path="/settings" element={<SystemSettings />} />
              
              {/* 404 fallback route - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </EmployeeAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
