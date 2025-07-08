
/**
 * Employee Authentication Hook
 * Handles both login and signup for employees using Supabase
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useEmployeeAuth = (onClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    department: '',
    role: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('🔐 Employee login attempt:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      if (error) {
        console.error('❌ Employee login error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log('✅ Employee authenticated successfully');
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });

        onClose();
        navigate('/employee-dashboard');
      }
    } catch (error) {
      console.error('❌ Unexpected employee login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('📝 Employee signup attempt:', formData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/employee-dashboard`,
          data: {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            department: formData.department,
            role: formData.role.trim(),
            join_date: new Date().toISOString().split('T')[0],
          }
        }
      });

      if (error) {
        console.error('❌ Employee signup error:', error);
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log('✅ Employee account created successfully');
        toast({
          title: "Account Created Successfully",
          description: "Please check your email to confirm your account, then you can sign in.",
        });
        
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error('❌ Unexpected employee signup error:', error);
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
      phone: '',
      department: '',
      role: ''
    });
  };

  return {
    isLoading,
    formData,
    setFormData,
    handleLogin,
    handleSignup,
    resetForm
  };
};
