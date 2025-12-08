/**
 * Helpers para manejo de gastos y categorías
 */

// Categorías disponibles para gastos
export const EXPENSE_CATEGORIES = {
  GENERAL: 'general',
  SUPPLIES: 'supplies',
  SALARY: 'salary',
  SERVICES: 'services',
  EQUIPMENT: 'equipment',
  MAINTENANCE: 'maintenance',
  OTHER: 'other'
};

/**
 * Obtiene el ícono correspondiente a una categoría de gasto
 *
 * @param {string} category - Categoría del gasto
 * @returns {string} Emoji del ícono
 */
export function getCategoryIcon(category) {
  const icons = {
    general: '📋',
    supplies: '🧴',
    salary: '💵',
    services: '💡',
    equipment: '🛠️',
    maintenance: '🔧',
    other: '📦'
  };
  return icons[category] || '📋';
}

/**
 * Obtiene la etiqueta legible de una categoría de gasto
 *
 * @param {string} category - Categoría del gasto
 * @returns {string} Etiqueta en español
 */
export function getCategoryLabel(category) {
  const labels = {
    general: 'General',
    supplies: 'Insumos',
    salary: 'Nómina',
    services: 'Servicios',
    equipment: 'Equipo',
    maintenance: 'Mantenimiento',
    other: 'Otro'
  };
  return labels[category] || 'General';
}

/**
 * Calcula el total de una lista de gastos
 *
 * @param {Array<Object>} expenses - Array de gastos
 * @param {number} expenses[].amount - Monto del gasto
 * @returns {number} Total de gastos
 */
export function calculateTotalExpenses(expenses) {
  return expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
}

/**
 * Calcula el total de una lista de retiros
 *
 * @param {Array<Object>} withdrawals - Array de retiros
 * @param {number} withdrawals[].amount - Monto del retiro
 * @returns {number} Total de retiros
 */
export function calculateTotalWithdrawals(withdrawals) {
  return withdrawals.reduce((sum, withdrawal) => sum + (parseFloat(withdrawal.amount) || 0), 0);
}

/**
 * Genera un ID único para un gasto o retiro
 *
 * @param {string} prefix - Prefijo del ID ('exp' para gasto, 'wit' para retiro)
 * @returns {string} ID único
 */
export function generateTransactionId(prefix = 'txn') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
