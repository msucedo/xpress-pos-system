import { useState, useEffect } from 'react';
import { autoSelectEmployeeWithLeastOrders } from '../utils/employees/employeeHelpers';

/**
 * Hook para manejar asignación automática de empleados a órdenes
 *
 * @param {Array} employees - Lista de empleados disponibles
 * @param {Object} allOrders - Todas las órdenes agrupadas por status
 * @returns {Object} - { selectedEmployee, setSelectedEmployee }
 */
export function useEmployeeAssignment(employees, allOrders) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Auto-seleccionar empleado con menos órdenes cuando hay empleados disponibles
  useEffect(() => {
    if (employees.length > 0 && selectedEmployee === null) {
      const employee = autoSelectEmployeeWithLeastOrders(employees, allOrders);
      if (employee) {
        setSelectedEmployee(employee);
      }
    }
  }, [employees, allOrders, selectedEmployee]);

  return {
    selectedEmployee,
    setSelectedEmployee
  };
}
