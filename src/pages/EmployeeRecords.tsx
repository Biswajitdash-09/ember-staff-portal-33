
/**
 * Employee Records Page
 * Main page component for managing employee records
 * Refactored for better maintainability and separation of concerns
 */

import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeRecordsHandlers } from '@/components/employee/hooks/useEmployeeRecordsHandlers';
import EmployeeRecordsHeader from '@/components/employee/EmployeeRecordsHeader';
import EmployeeRecordsTabManager from '@/components/employee/EmployeeRecordsTabManager';
import EmployeeDetailsModal from '@/components/employee/EmployeeDetailsModal';
import EditEmployeeModal from '@/components/employee/EditEmployeeModal';

const EmployeeRecords = () => {
  const {
    employees,
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    departments,
    statuses,
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployeeData();

  const {
    selectedEmployee,
    editingEmployee,
    activeTab,
    modalEmployee,
    setActiveTab,
    setModalEmployee,
    setEditingEmployee,
    handleViewEmployee,
    handleSelectEmployee,
    handleEditEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
    handleUpdateCredentials,
    handleDocumentUpload
  } = useEmployeeRecordsHandlers(updateEmployee, deleteEmployee);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EmployeeRecordsHeader onAddEmployee={addEmployee} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmployeeRecordsTabManager
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          employees={employees}
          selectedEmployee={selectedEmployee}
          onSelectEmployee={handleSelectEmployee}
          onViewEmployee={handleViewEmployee}
          onEditEmployee={handleEditEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          onUpdateCredentials={handleUpdateCredentials}
          onDocumentUpload={handleDocumentUpload}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departments={departments}
          statuses={statuses}
        />
      </div>

      <EmployeeDetailsModal 
        employee={modalEmployee}
        onClose={() => setModalEmployee(null)}
      />

      <EditEmployeeModal 
        employee={editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onUpdateEmployee={handleUpdateEmployee}
      />
    </div>
  );
};

export default EmployeeRecords;
