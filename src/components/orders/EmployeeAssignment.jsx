import { getEmployeesWithOrderCount } from '../../utils/employees/employeeHelpers';

/**
 * Componente para asignar empleado a la orden
 * Extraído de OrderForm.jsx para reutilización
 */
export function EmployeeAssignment({
  employees,
  selectedEmployee,
  onSelectEmployee,
  allOrders
}) {
  if (employees.length === 0) return null;

  const employeesWithCount = getEmployeesWithOrderCount(employees, allOrders);

  return (
    <div className="employee-assignment-section">
      <div className="employee-assignment-header">
        <span className="assignment-label">Asignar a:</span>
        <span className="assignment-hint">(Opcional)</span>
      </div>
      <div className="employee-selection-grid">
        {employeesWithCount.map((emp) => (
          <button
            key={emp.id}
            type="button"
            className={`employee-card ${selectedEmployee?.id === emp.id ? 'selected' : ''}`}
            onClick={() => onSelectEmployee(selectedEmployee?.id === emp.id ? null : emp)}
            title={`${emp.name} - ${emp.orderCount} órdenes activas`}
          >
            <span className="employee-emoji">{emp.emoji || '👤'}</span>
            <span className="employee-order-count">{emp.orderCount}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
