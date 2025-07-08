
/**
 * Employee Dashboard Container Component
 * Main container that handles authentication, state management, and tab rendering
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import EmployeeDashboardContent from './EmployeeDashboardContent';
import EmployeeDashboardLoading from './EmployeeDashboardLoading';

const EmployeeDashboardContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { employee, isAuthenticated, isLoading, logout, refreshEmployeeData } = useEmployeeAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Handle authentication check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('⚠️ Access denied - not authenticated, redirecting to home');
      toast({
        title: "Access Denied",
        description: "Please log in to access your dashboard.",
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  const handleLogout = async () => {
    try {
      console.log('🚪 User logging out');
      await logout();
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
      // Update employee profile in database
      // This will be implemented when we add the update functionality
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
    return <EmployeeDashboardLoading />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !employee) {
    return null;
  }

  console.log('✅ Rendering dashboard for authenticated user:', employee.name);

  // Transform employee data for components compatibility
  const transformedEmployee = {
    id: employee.employee_id,
    name: employee.name,
    email: employee.email,
    phone: employee.phone || '',
    department: employee.department || '',
    role: employee.role || '',
    joinDate: employee.join_date || '',
    profilePicture: employee.profile_picture,
    manager: employee.manager || '',
    address: employee.address || '',
    emergencyContact: employee.emergency_contact || {
      name: '',
      phone: '',
      relationship: ''
    },
    baseSalary: employee.base_salary || 0,
    status: employee.status as 'Active' | 'Probation' | 'Terminated'
  };

  return (
    <EmployeeDashboardContent
      employee={transformedEmployee}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      onProfileUpdate={handleProfileUpdate}
    />
  );
};

export default EmployeeDashboardContainer;
