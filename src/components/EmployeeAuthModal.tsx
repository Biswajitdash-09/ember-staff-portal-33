
/**
 * Employee Authentication Modal
 * Now includes both login and signup functionality for employees
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeLoginForm from './employee-auth/EmployeeLoginForm';
import EmployeeSignupForm from './employee-auth/EmployeeSignupForm';
import { useEmployeeAuth } from './employee-auth/useEmployeeAuth';

interface EmployeeAuthModalProps {
  open: boolean;
  onClose: () => void;
}

const EmployeeAuthModal = ({ open, onClose }: EmployeeAuthModalProps) => {
  const [activeTab, setActiveTab] = useState('login');
  
  const {
    isLoading,
    formData,
    setFormData,
    handleLogin,
    handleSignup,
    resetForm
  } = useEmployeeAuth(onClose);

  // Reset form when modal closes
  const handleClose = () => {
    resetForm();
    setActiveTab('login');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Employee Portal
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <EmployeeLoginForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleLogin}
              isLoading={isLoading}
            />
            
            <div className="text-center text-sm text-gray-600">
              <p>Test Employee: employee@test.com / password123</p>
              <p className="text-xs mt-1">Create employee account first, then sign in</p>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <EmployeeSignupForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSignup}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeAuthModal;
