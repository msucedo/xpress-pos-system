/**
 * Funciones de utilidad para el manejo de estados de órdenes y servicios
 */

/**
 * Verifica si todos los items (servicios) están completados o cancelados
 *
 * @param {Array} services - Array de servicios
 * @returns {boolean} True si todos están completados o cancelados
 */
export function checkAllItemsCompleted(services) {
  if (!services || services.length === 0) return false;

  return services.every(service =>
    service.status === 'completed' || service.status === 'cancelled'
  );
}

/**
 * Valida si se puede cambiar al nuevo estado
 *
 * @param {string} newStatus - Nuevo estado deseado
 * @param {Array} services - Array de servicios
 * @returns {Object} { canChange: boolean, reason: string }
 */
export function canMoveToStatus(newStatus, services) {
  // Validar si se intenta cambiar a "enEntrega"
  if (newStatus === 'enEntrega') {
    const allCompleted = checkAllItemsCompleted(services);
    if (!allCompleted) {
      return {
        canChange: false,
        reason: 'No se puede mover a "En Entrega" hasta que todos los items estén completados o cancelados'
      };
    }
  }

  return { canChange: true, reason: '' };
}

/**
 * Obtiene las opciones de estado disponibles para la orden
 *
 * @returns {Array} Array de objetos con value, label e icon
 */
export function getOrderStatusOptions() {
  return [
    { value: 'recibidos', label: 'Recibidos', icon: 'download' },
    { value: 'proceso', label: 'En Proceso', icon: 'processing' },
    { value: 'listos', label: 'Listos', icon: 'success' },
    { value: 'enEntrega', label: 'En Entrega', icon: 'delivery' }
  ];
}

/**
 * Obtiene las opciones de estado para servicios individuales
 *
 * @returns {Array} Array de objetos con value, label y color
 */
export function getPairStatusOptions() {
  return [
    { value: 'pending', label: 'Pendiente', color: '#9ca3af' },
    { value: 'completed', label: 'Completado', color: '#10b981' },
    { value: 'cancelled', label: 'Cancelado', color: '#ef4444' }
  ];
}

/**
 * Obtiene el label de un estado de servicio
 *
 * @param {string} status - Estado del servicio (pending, completed, cancelled)
 * @returns {string} Label en español
 */
export function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado'
  };
  return labels[status] || 'Pendiente';
}

/**
 * Calcula el siguiente estado en el ciclo de estados
 * Loop: pending → completed → cancelled → pending
 *
 * @param {string} currentStatus - Estado actual
 * @returns {string} Siguiente estado en el ciclo
 */
export function getNextStatus(currentStatus) {
  const statusLoop = ['pending', 'completed', 'cancelled'];
  const currentIndex = statusLoop.indexOf(currentStatus || 'pending');
  const nextIndex = (currentIndex + 1) % statusLoop.length;
  return statusLoop[nextIndex];
}

/**
 * Filtra servicios excluyendo "Servicio Express"
 *
 * @param {Array} services - Array de servicios
 * @returns {Array} Servicios filtrados sin "Servicio Express"
 */
export function filterRegularServices(services) {
  if (!services) return [];
  return services.filter(service =>
    service.serviceName?.toLowerCase() !== 'servicio express'
  );
}

/**
 * Marca servicios "Servicio Express" como completados automáticamente
 *
 * @param {Array} services - Array de servicios
 * @returns {Array} Servicios con "Servicio Express" marcados como completed
 */
export function autoCompleteExpressServices(services) {
  if (!services) return [];

  return services.map(service => {
    if (service.serviceName?.toLowerCase() === 'servicio express') {
      return { ...service, status: 'completed' };
    }
    return service;
  });
}

/**
 * Obtiene el label de un estado de orden
 *
 * @param {string} statusCategory - Estado de la orden (recibidos, proceso, listos, etc.)
 * @returns {string} Label en español
 */
export function getOrderStatusLabel(statusCategory) {
  const labels = {
    recibidos: 'Recibido',
    proceso: 'En Proceso',
    listos: 'Listo',
    enEntrega: 'En Entrega',
    completados: 'Completado',
    cancelado: 'Cancelado'
  };
  return labels[statusCategory] || statusCategory;
}
