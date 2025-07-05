
/**
 * Core employee data management hook
 * Handles CRUD operations for employee records
 * Manages the main employee state and provides methods to modify it
 */

import { useState, useMemo } from 'react';
import { Employee } from '@/types/employee';
import { generateEmployeeData } from '@/utils/employeeDataGenerator';

// Initialize with sample employee data
const initialEmployees: Employee[] = generateEmployeeData();

export const useEmployeeCore = () => {
  // Main employee state management
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  /**
   * Add a new employee to the system
   * Generates a unique ID and adds to employee list
   */
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    setEmployees(prev => [...prev, { ...employee, id: newId }]);
  };

  /**
   * Update an existing employee's information
   * Finds employee by ID and applies partial updates
   */
  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, ...updates } : emp
    ));
  };

  /**
   * Remove an employee from the system
   * Filters out the employee with the specified ID
   */
  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  // Return employee data and management functions
  return {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
