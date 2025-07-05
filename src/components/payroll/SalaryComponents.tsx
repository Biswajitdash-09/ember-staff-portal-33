
/**
 * Salary Components Configuration Component
 * Manages salary structure including earnings, deductions, and benefits
 * Provides inline editing capabilities for salary components
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Interface for salary component structure
interface SalaryComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction' | 'benefit';
  value: string;
  editable: boolean;
}

interface SalaryComponentsProps {
  salaryComponents: SalaryComponent[];
  setSalaryComponents: React.Dispatch<React.SetStateAction<SalaryComponent[]>>;
}

const SalaryComponents = ({ salaryComponents, setSalaryComponents }: SalaryComponentsProps) => {
  const { toast } = useToast();
  
  // Track which component is being edited
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  /**
   * Initiate editing mode for a salary component
   * Sets up the editing state and pre-fills current value
   */
  const handleEditComponent = (component: SalaryComponent) => {
    setEditingComponent(component.id);
    setEditValue(component.value);
  };

  /**
   * Save edited component value
   * Updates the component in the state and exits edit mode
   */
  const handleSaveComponent = (componentId: string) => {
    setSalaryComponents(prev => prev.map(comp => 
      comp.id === componentId ? { ...comp, value: editValue } : comp
    ));
    setEditingComponent(null);
    setEditValue('');
    
    // Show success notification
    toast({
      title: "Component Updated",
      description: "Salary component has been updated successfully.",
    });
  };

  /**
   * Cancel editing mode
   * Resets editing state without saving changes
   */
  const handleCancelEdit = () => {
    setEditingComponent(null);
    setEditValue('');
  };

  /**
   * Render a section of salary components by type
   * Groups components by earnings, deductions, or benefits
   */
  const renderComponentSection = (type: 'earning' | 'deduction' | 'benefit', title: string, bgColor: string, textColor: string) => (
    <div className="space-y-4">
      {/* Section title */}
      <h4 className={`font-semibold ${textColor}`}>{title}</h4>
      
      {/* Component list */}
      <div className="space-y-2">
        {salaryComponents.filter(comp => comp.type === type).map((component) => (
          <div key={component.id} className={`flex justify-between items-center p-2 ${bgColor} rounded`}>
            {/* Component name */}
            <span>{component.name}</span>
            
            {/* Value and edit controls */}
            <div className="flex items-center space-x-2">
              {editingComponent === component.id ? (
                // Edit mode - show input and save/cancel buttons
                <>
                  <Input 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-20 h-6 text-xs"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleSaveComponent(component.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleCancelEdit}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                // View mode - show value and edit button
                <>
                  <span>{component.value}</span>
                  {component.editable && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditComponent(component)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Components Configuration</CardTitle>
        <CardDescription>Manage base salary, bonuses, and deductions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Three-column layout for component types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Earnings section */}
          {renderComponentSection('earning', 'Earnings', 'bg-green-50', 'text-green-700')}
          
          {/* Deductions section */}
          {renderComponentSection('deduction', 'Deductions', 'bg-red-50', 'text-red-700')}
          
          {/* Benefits section */}
          {renderComponentSection('benefit', 'Benefits', 'bg-blue-50', 'text-blue-700')}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryComponents;
