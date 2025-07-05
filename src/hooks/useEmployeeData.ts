
/**
 * Main employee data management hook
 * 
 * This hook combines core employee operations with filtering capabilities
 * to provide a unified interface for employee data management throughout the application.
 * 
 * Features provided:
 * - Complete CRUD operations for employee records
 * - Real-time filtering and search functionality
 * - Centralized state management for employee data
 * - Integration with data persistence layer
 * 
 * @hook
 * @returns {Object} Complete employee data management interface
 */

import { useEmployeeCore } from './employee/useEmployeeCore';
import { useEmployeeFilters } from './employee/useEmployeeFilters';

// Re-export Employee type for convenience and consistency
export type { Employee } from '@/types/employee';

/**
 * Main employee data management hook
 * 
 * Combines multiple specialized hooks to provide a comprehensive
 * employee data management solution with filtering capabilities.
 * 
 * @example
 * ```tsx
 * const {
 *   employees,
 *   addEmployee,
 *   updateEmployee,
 *   deleteEmployee,
 *   searchTerm,
 *   setSearchTerm
 * } = useEmployeeData();
 * ```
 * 
 * @returns {Object} Employee data management interface
 */
export const useEmployeeData = () => {
  /**
   * Get core employee CRUD operations from specialized hook
   * Handles: Create, Read, Update, Delete operations
   * Manages: Main employee state and persistence
   */
  const {
    employees: allEmployees,    // Complete unfiltered employee list
    addEmployee,               // Function to add new employee
    updateEmployee,            // Function to update existing employee
    deleteEmployee             // Function to remove employee
  } = useEmployeeCore();

  /**
   * Get filtering and search functionality from specialized hook
   * Handles: Search, filter, and data presentation logic
   * Manages: UI state for search and filter controls
   */
  const {
    searchTerm,               // Current search query string
    setSearchTerm,           // Function to update search query
    departmentFilter,        // Current department filter value
    setDepartmentFilter,     // Function to update department filter
    statusFilter,            // Current status filter value
    setStatusFilter,         // Function to update status filter
    filteredEmployees,       // Employees after applying filters
    departments,             // Available department options
    statuses                 // Available status options
  } = useEmployeeFilters(allEmployees);

  /**
   * Return combined employee data management interface
   * Provides both raw data and filtered results for different use cases
   */
  return {
    // Filtered data (primary interface for UI components)
    employees: filteredEmployees,     // Main employee list for display
    
    // Raw data (for statistics and admin functions)
    allEmployees,                     // Complete unfiltered dataset
    
    // Search and filter state management
    searchTerm,                       // Current search query
    setSearchTerm,                    // Update search query
    departmentFilter,                 // Current department filter
    setDepartmentFilter,              // Update department filter
    statusFilter,                     // Current status filter  
    setStatusFilter,                  // Update status filter
    
    // Filter options (for dropdown/select components)
    departments,                      // Available departments list
    statuses,                        // Available status options
    
    // CRUD operations (for data manipulation)
    addEmployee,                     // Create new employee record
    updateEmployee,                  // Modify existing employee
    deleteEmployee                   // Remove employee record
  };
};
