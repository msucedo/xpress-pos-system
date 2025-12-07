/**
 * Utilidades para manejo de empleados y asignación de órdenes
 * Extraído de OrderForm.jsx para reutilización
 */

/**
 * Calcula número de órdenes activas por empleado (recibidos + proceso)
 * @param {string} employeeId - ID del empleado
 * @param {Object} allOrders - Objeto con todas las órdenes agrupadas por status
 * @returns {number} - Cantidad de órdenes activas
 */
export function getEmployeeOrderCount(employeeId, allOrders) {
  const recibidos = allOrders.recibidos || [];
  const proceso = allOrders.proceso || [];

  const activeOrders = [...recibidos, ...proceso];
  return activeOrders.filter(order => order.authorId === employeeId).length;
}

/**
 * Obtiene empleados con su conteo de órdenes, ordenados por menos órdenes
 * @param {Array} employees - Lista de empleados
 * @param {Object} allOrders - Objeto con todas las órdenes agrupadas por status
 * @returns {Array} - Empleados con campo orderCount, ordenados ascendentemente
 */
export function getEmployeesWithOrderCount(employees, allOrders) {
  return employees
    .map(emp => ({
      ...emp,
      orderCount: getEmployeeOrderCount(emp.id, allOrders)
    }))
    .sort((a, b) => a.orderCount - b.orderCount);
}

/**
 * Auto-selecciona el empleado con menos órdenes activas
 * @param {Array} employees - Lista de empleados
 * @param {Object} allOrders - Objeto con todas las órdenes agrupadas por status
 * @returns {Object|null} - Empleado con menos órdenes o null si no hay empleados
 */
export function autoSelectEmployeeWithLeastOrders(employees, allOrders) {
  if (!employees || employees.length === 0) return null;

  const employeesWithCount = getEmployeesWithOrderCount(employees, allOrders);
  return employeesWithCount.length > 0 ? employeesWithCount[0] : null;
}
