/**
 * Funciones de utilidad para el manejo de pagos
 */

/**
 * Obtiene el label del método de pago
 *
 * @param {string} method - Método de pago (cash, card, transfer, pending)
 * @returns {string} Label con emoji
 */
export function getPaymentMethodLabel(method) {
  const methods = {
    'cash': '💵 Efectivo',
    'card': '💳 Tarjeta',
    'transfer': '📱 Transferencia',
    'pending': '⏳ Pendiente'
  };
  return methods[method] || '⏳ Pendiente';
}

/**
 * Calcula el pago restante
 *
 * @param {number} totalPrice - Precio total de la orden
 * @param {number} advancePayment - Pago adelantado
 * @param {string} paymentStatus - Estado del pago (paid, pending)
 * @returns {number} Monto restante por cobrar
 */
export function calculateRemainingPayment(totalPrice, advancePayment, paymentStatus) {
  // Si el estado de pago es 'paid', el restante es 0, sino calcularlo normalmente
  if (paymentStatus === 'paid') return 0;

  const remaining = totalPrice - advancePayment;
  return Math.max(0, remaining);
}

/**
 * Verifica si la orden está completamente pagada
 * Una orden NO está pagada si tiene servicios con precio $0 pendientes de definir
 *
 * @param {number} remainingPayment - Pago restante
 * @param {string} paymentStatus - Estado del pago
 * @param {Array} services - Array de servicios
 * @returns {boolean} True si está completamente pagada
 */
export function isFullyPaid(remainingPayment, paymentStatus, services) {
  // Detectar si hay servicios con precio por definir ($0)
  const hasServicesWithoutPrice = services.some(service =>
    service.status !== 'cancelled' && service.price === 0
  );

  // Una orden está pagada si no tiene saldo pendiente Y no tiene servicios sin precio
  return (remainingPayment <= 0 || paymentStatus === 'paid') && !hasServicesWithoutPrice;
}

/**
 * Detecta servicios con precio $0 (precio por definir)
 *
 * @param {Array} services - Array de servicios
 * @returns {Array} Servicios sin precio definido
 */
export function getServicesWithoutPrice(services) {
  if (!services) return [];
  return services.filter(service => service.price === 0);
}

/**
 * Determina el texto del botón de entregar según el estado de pago
 *
 * @param {boolean} isFullyPaid - Si está completamente pagada
 * @returns {string} Texto del botón
 */
export function getDeliverButtonText(isFullyPaid) {
  return !isFullyPaid ? '💰 Cobrar y Entregar' : '✅ Entregar Orden';
}

/**
 * Determina el subtítulo del botón de entregar
 *
 * @param {boolean} isFullyPaid - Si está completamente pagada
 * @param {number} remainingPayment - Pago restante
 * @returns {string} Subtítulo del botón
 */
export function getDeliverButtonSubtitle(isFullyPaid, remainingPayment) {
  return !isFullyPaid
    ? `Cobrar $${remainingPayment.toFixed(2)} y entregar`
    : 'Marcar como completada y entregada';
}

/**
 * Valida si se puede cobrar la orden
 *
 * @param {number} remainingPayment - Pago restante
 * @returns {Object} { canCharge: boolean, reason: string }
 */
export function canChargeOrder(remainingPayment) {
  if (remainingPayment <= 0) {
    return {
      canCharge: false,
      reason: 'La orden ya está pagada completamente'
    };
  }

  return { canCharge: true, reason: '' };
}
