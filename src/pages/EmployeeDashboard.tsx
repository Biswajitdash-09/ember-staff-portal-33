
/**
 * Employee Dashboard Page
 * Main dashboard for employees after login
 * Features: Profile view, leave application, salary details, attendance, performance, documents, support, feedback, notifications
 * Now uses real employee data from authentication with comprehensive feature set
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, DollarSign, Clock, Target, FileText, HeadphonesIcon, MessageSquare, Bell } from 'lucide-react';
import EmployeeProfileView from '@/components/employee-dashboard/EmployeeProfileView';
import EmployeeLeaveApplication from '@/components/employee-dashboard/EmployeeLeaveApplication';
import EmployeeSalaryDetails from '@/components/employee-dashboard/EmployeeSalaryDetails';
import EmployeeDashboardHeader from '@/components/employee-dashboard/components/EmployeeDashboardHeader';
import EmployeeDashboardWelcome from '@/components/employee-dashboard/components/EmployeeDashboardWelcome';
import EmployeeDashboardStats from '@/components/employee-dashboard/components/EmployeeDashboardStats';
import EditEmployeeProfile from '@/components/employee-dashboard/components/EditEmployeeProfile';
import AttendanceTracking from '@/components/employee-dashboard/components/AttendanceTracking';
import EnhancedLeaveHistory from '@/components/employee-dashboard/components/EnhancedLeaveHistory';
import PerformanceOverview from '@/components/employee-dashboard/components/PerformanceOverview';
import DocumentsSection from '@/components/employee-dashboard/components/DocumentsSection';
import NotificationsSystem from '@/components/employee-dashboard/components/NotificationsSystem';
import SupportTicketing from '@/components/employee-dashboard/components/SupportTicketing';
import FeedbackSystem from '@/components/employee-dashboard/components/FeedbackSystem';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { updateEmployeeProfile } from '@/services/employeeProfileService';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { employee, isAuthenticated, isLoading, logout, refreshEmployeeData } = useEmployeeAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [redirectHandled, setRedirectHandled] = useState(false);

  // Handle authentication check with proper delay to avoid race conditions
  useEffect(() => {
    const checkAuth = async () => {
      // Wait a bit for authentication to stabilize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isLoading && !isAuthenticated && !redirectHandled) {
        console.log('⚠️ Access denied - not authenticated, redirecting to home');
        setRedirectHandled(true);
        toast({
          title: "Access Denied",
          description: "Please log in to access your dashboard.",
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
    };

    if (!isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, navigate, toast, redirectHandled]);

  const handleLogout = async () => {
    try {
      console.log('🚪 User logging out');
      logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async (updates: any) => {
    if (!employee) return;
    
    try {
      await updateEmployeeProfile(employee.id, updates);
      await refreshEmployeeData();
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('❌ Profile update error:', error);
      toast({
        title: "Update Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log(`📱 Tab changed to: ${value}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Loading your dashboard...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please wait while we prepare your workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !employee) {
    return null;
  }

  console.log('✅ Rendering dashboard for authenticated user:', employee.name);

  // Transform employee data for the salary component
  const salaryData = {
    basic: employee.baseSalary || 0,
    allowances: Math.round((employee.baseSalary || 0) * 0.2), // 20% allowances
    deductions: Math.round((employee.baseSalary || 0) * 0.1), // 10% deductions
    netSalary: Math.round((employee.baseSalary || 0) * 1.1) // Net after allowances and deductions
  };

  // Enhanced leave balance
  const leaveBalance = {
    annual: 20,
    sick: 10,
    personal: 5
  };

  const employeeWithSalaryAndLeave = {
    ...employee,
    salary: salaryData,
    leaveBalance: leaveBalance
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EmployeeDashboardHeader employee={employee} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmployeeDashboardWelcome employee={employee} />
        <EmployeeDashboardStats leaveBalance={leaveBalance} baseSalary={employee.baseSalary || 0} />

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 h-auto p-1">
            <TabsTrigger value="profile" className="flex flex-col items-center space-y-1 p-2">
              <User className="w-4 h-4" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex flex-col items-center space-y-1 p-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex flex-col items-center space-y-1 p-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Leave</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex flex-col items-center space-y-1 p-2">
              <Target className="w-4 h-4" />
              <span className="text-xs">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex flex-col items-center space-y-1 p-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs">Salary</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex flex-col items-center space-y-1 p-2">
              <FileText className="w-4 h-4" />
              <span className="text-xs">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center space-y-1 p-2">
              <Bell className="w-4 h-4" />
              <span className="text-xs">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex flex-col items-center space-y-1 p-2">
              <HeadphonesIcon className="w-4 h-4" />
              <span className="text-xs">Support</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex flex-col items-center space-y-1 p-2">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">Feedback</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <EditEmployeeProfile 
              employee={employeeWithSalaryAndLeave} 
              onUpdate={handleProfileUpdate}
            />
            <EmployeeProfileView employee={employeeWithSalaryAndLeave} />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <AttendanceTracking employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="leave" className="space-y-6">
            <EmployeeLeaveApplication employee={employeeWithSalaryAndLeave} />
            <EnhancedLeaveHistory employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceOverview />
          </TabsContent>

          <TabsContent value="salary" className="space-y-6">
            <EmployeeSalaryDetails employee={employeeWithSalaryAndLeave} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentsSection />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationsSystem />
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <SupportTicketing />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <FeedbackSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
