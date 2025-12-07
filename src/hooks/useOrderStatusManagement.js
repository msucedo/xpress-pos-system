import { canMoveToStatus } from '../utils/orders/statusHelpers';

/**
 * Hook para manejar el cambio de estado de la orden con validaciones
 *
 * @param {Array} localServices - Servicios locales
 * @param {string} orderStatus - Estado actual de la orden
 * @param {Function} setOrderStatus - Setter del estado de orden
 * @returns {Object} Funciones para manejar el estado
 */
export function useOrderStatusManagement(localServices, orderStatus, setOrderStatus) {
  // Cambiar estado general de la orden
  const handleOrderStatusChange = (newStatus) => {
    // Validar si se puede cambiar al nuevo estado
    const validation = canMoveToStatus(newStatus, localServices);

    if (!validation.canChange) {
      alert(validation.reason);
      return;
    }

    setOrderStatus(newStatus);
    // Cambios se guardarán al cerrar el modal
  };

  return {
    orderStatus,
    handleOrderStatusChange
  };
}
