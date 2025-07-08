
/**
 * Employee Signup Form Component
 * Handles employee registration with additional profile information
 */

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building } from 'lucide-react';

interface EmployeeSignupFormProps {
  formData: {
    email: string;
    password: string;
    name: string;
    phone: string;
    department: string;
    role: string;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const EmployeeSignupForm = ({ formData, setFormData, onSubmit, isLoading }: EmployeeSignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const departments = [
    'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 
    'Operations', 'Customer Support', 'Design', 'Product', 'Legal'
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="signup-name" 
              type="text" 
              placeholder="Enter your full name" 
              className="pl-10"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Work Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="signup-email" 
              type="email" 
              placeholder="your.name@company.com" 
              className="pl-10"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="signup-password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Create a strong password" 
              className="pl-10 pr-10"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
              disabled={isLoading}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="signup-phone" 
              type="tel" 
              placeholder="Your phone number" 
              className="pl-10"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-department">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({...formData, department: value})}
            disabled={isLoading}
          >
            <SelectTrigger>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-400 mr-2" />
                <SelectValue placeholder="Select your department" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-role">Job Role</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="signup-role" 
              type="text" 
              placeholder="Your job title" 
              className="pl-10"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Create Employee Account</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default EmployeeSignupForm;
