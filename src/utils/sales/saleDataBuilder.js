/**
 * Funciones para construir y preparar datos de ventas
 * Todas son funciones puras que transforman datos para envío
 */

/**
 * Prepara los datos completos de una venta para guardar en Firebase
 * @param {Object} params - Parámetros de la venta
 * @param {Array} params.cartItems - Items del carrito
 * @param {number} params.subtotal - Subtotal de la venta
 * @param {number} params.discount - Descuento aplicado
 * @param {string} params.discountType - Tipo de descuento ('amount' o 'percentage')
 * @param {number} params.discountAmount - Monto del descuento
 * @param {number} params.total - Total de la venta
 * @param {Object} params.paymentData - Datos del pago
 * @param {Object|null} params.selectedClient - Cliente seleccionado
 * @param {string} params.notes - Notas de la venta
 * @param {Object|null} params.employee - Empleado que registra la venta
 * @param {Object|null} params.user - Usuario autenticado
 * @param {Array} params.appliedPromotions - Promociones aplicadas
 * @returns {Object} Datos de la venta formateados
 */
export function prepareSaleData({
  cartItems,
  subtotal,
  discount,
  discountType,
  discountAmount,
  total,
  paymentData,
  selectedClient,
  notes,
  employee,
  user,
  appliedPromotions
}) {
  return {
    items: cartItems,
    subtotal,
    discount,
    discountType,
    discountAmount,
    total,
    paymentMethod: paymentData.paymentMethod,
    paymentStatus: paymentData.paymentStatus || 'paid',
    amountReceived: paymentData.amountReceived || total,
    change: paymentData.change || 0,
    clientId: selectedClient?.id || null,
    clientName: selectedClient?.name || null,
    notes,
    createdAt: new Date().toISOString(),
    createdBy: employee?.name || user?.email || 'system',
    appliedPromotions: prepareSalePromotions(appliedPromotions)
  };
}

/**
 * Prepara el array de promociones aplicadas para guardar
 * @param {Array} appliedPromotions - Promociones aplicadas
 * @returns {Array} Promociones formateadas
 */
export function prepareSalePromotions(appliedPromotions) {
  if (!appliedPromotions || appliedPromotions.length === 0) {
    return [];
  }

  return appliedPromotions.map(promo => ({
    id: promo.id,
    name: promo.name,
    type: promo.type,
    discountAmount: promo.discountAmount
  }));
}
