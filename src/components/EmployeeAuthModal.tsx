
/**
 * Employee Authentication Modal
 * Separate login interface for employees with real credential validation
 */

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateEmployeeData } from '@/utils/employeeDataGenerator';
import { useEmployeeAuth } from './employee-auth/useEmployeeAuth';
import EmployeeLoginForm from './employee-auth/EmployeeLoginForm';
import SampleCredentials from './employee-auth/SampleCredentials';

interface EmployeeAuthModalProps {
  open: boolean;
  onClose: () => void;
}

const EmployeeAuthModal = ({ open, onClose }: EmployeeAuthModalProps) => {
  const [sampleCredentials, setSampleCredentials] = useState<Array<{email: string, password: string}>>([]);
  
  const {
    isLoading,
    formData,
    setFormData,
    handleLogin,
    fillCredentials,
    resetForm
  } = useEmployeeAuth(onClose);

  // Load sample credentials when modal opens
  useEffect(() => {
    if (open) {
      const employees = generateEmployeeData();
      const activeEmployees = employees.filter(emp => 
        emp.status === 'Active' && emp.loginCredentials?.isActive
      ).slice(0, 5); // Show first 5 active employees
      
      const credentials = activeEmployees.map(emp => ({
        email: emp.loginCredentials!.loginEmail,
        password: emp.loginCredentials!.password
      }));
      
      setSampleCredentials(credentials);
    }
  }, [open]);

  // Reset form when modal closes
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Employee Portal Login
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EmployeeLoginForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleLogin}
            isLoading={isLoading}
          />

          <SampleCredentials
            credentials={sampleCredentials}
            onFillCredentials={fillCredentials}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeAuthModal;
