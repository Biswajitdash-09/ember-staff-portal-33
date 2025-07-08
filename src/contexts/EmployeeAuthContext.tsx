
/**
 * Employee Authentication Context
 * Provides employee authentication state throughout the app using Supabase
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Employee {
  id: string;
  auth_user_id: string;
  employee_id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
  join_date?: string;
  profile_picture?: string;
  manager?: string;
  address?: string;
  emergency_contact?: any;
  base_salary?: number;
  status: string;
}

interface EmployeeAuthContextType {
  user: User | null;
  session: Session | null;
  employee: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshEmployeeData: () => Promise<void>;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

interface EmployeeAuthProviderProps {
  children: ReactNode;
}

export const EmployeeAuthProvider = ({ children }: EmployeeAuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployeeData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching employee data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return null;
    }
  };

  const refreshEmployeeData = async () => {
    if (user) {
      const employeeData = await fetchEmployeeData(user.id);
      setEmployee(employeeData);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is an employee
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (roleData?.role === 'employee') {
            const employeeData = await fetchEmployeeData(session.user.id);
            setEmployee(employeeData);
          } else {
            setEmployee(null);
          }
        } else {
          setEmployee(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Initialize employee data for existing session
        setTimeout(async () => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (roleData?.role === 'employee') {
            const employeeData = await fetchEmployeeData(session.user.id);
            setEmployee(employeeData);
          }
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setEmployee(null);
  };

  const value = {
    user,
    session,
    employee,
    isAuthenticated: !!user && !!employee,
    isLoading,
    logout,
    refreshEmployeeData
  };

  return (
    <EmployeeAuthContext.Provider value={value}>
      {children}
    </EmployeeAuthContext.Provider>
  );
};

export const useEmployeeAuth = () => {
  const context = useContext(EmployeeAuthContext);
  if (context === undefined) {
    throw new Error('useEmployeeAuth must be used within an EmployeeAuthProvider');
  }
  return context;
};
