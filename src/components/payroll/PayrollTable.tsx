
/**
 * Payroll Table Component
 * Displays detailed payroll information for employees
 * Includes view functionality for individual employee payroll details
 */

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, DollarSign } from 'lucide-react';

// Interface defining the structure of payroll employee data
interface PayrollEmployee {
  id: string;
  name: string;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  status: 'Processed' | 'Pending';
}

interface PayrollTableProps {
  payrollData: PayrollEmployee[];
}

/**
 * PayrollTable component renders a table of employee payroll data
 * with individual view functionality for detailed payroll information
 */
const PayrollTable = ({ payrollData }: PayrollTableProps) => {
  // State to manage which employee's details are being viewed
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollEmployee | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  /**
   * Handles opening the detailed view for a specific employee
   * @param employee - The employee whose details should be displayed
   */
  const handleViewEmployee = (employee: PayrollEmployee) => {
    setSelectedEmployee(employee);
    setIsViewOpen(true);
  };

  /**
   * Formats currency values for consistent display
   * @param amount - The monetary amount to format
   * @returns Formatted currency string
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Returns appropriate styling class for payroll status badges
   * @param status - The current payroll status
   * @returns CSS class string for badge styling
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Main payroll data table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Bonuses</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollData.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{formatCurrency(employee.baseSalary)}</TableCell>
                <TableCell>{formatCurrency(employee.bonuses)}</TableCell>
                <TableCell>{formatCurrency(employee.deductions)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(employee.netPay)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewEmployee(employee)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Empty state when no payroll data is available */}
        {payrollData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No payroll data available for this period.
          </div>
        )}
      </div>

      {/* Detailed view modal for individual employee payroll */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payroll Details - {selectedEmployee?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed breakdown of payroll components for {selectedEmployee?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Employee basic information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Employee ID</label>
                  <p className="text-lg font-semibold">{selectedEmployee.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Employee Name</label>
                  <p className="text-lg font-semibold">{selectedEmployee.name}</p>
                </div>
              </div>

              {/* Detailed payroll breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Payroll Breakdown</h4>
                
                {/* Earnings section */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Earnings</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Salary</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bonuses & Incentives</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee.bonuses)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Gross Salary</span>
                        <span>{formatCurrency(selectedEmployee.baseSalary + selectedEmployee.bonuses)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deductions section */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-800 mb-2">Deductions</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tax & Other Deductions</span>
                      <span className="font-medium">{formatCurrency(selectedEmployee.deductions)}</span>
                    </div>
                  </div>
                </div>

                {/* Net pay calculation */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Net Pay</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedEmployee.netPay)}
                    </span>
                  </div>
                </div>

                {/* Processing status */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Processing Status:</span>
                  <Badge className={getStatusColor(selectedEmployee.status)}>
                    {selectedEmployee.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayrollTable;
