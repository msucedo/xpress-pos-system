/**
 * Utilidades para cálculos de carrito y promociones
 * Extraído de OrderForm.jsx para reutilización
 */

/**
 * Calcula el subtotal del carrito (antes de descuentos)
 * @param {Array} cart - Items en el carrito
 * @returns {number} - Subtotal
 */
export const calculateSubtotal = (cart) => {
  return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
};

/**
 * Calcula el total de descuentos aplicados
 * @param {Array} appliedPromotions - Promociones aplicadas
 * @returns {number} - Total de descuentos
 */
export const calculateTotalDiscount = (appliedPromotions) => {
  return appliedPromotions.reduce((total, promo) => total + (promo.discountAmount || 0), 0);
};

/**
 * Calcula el precio total del carrito (con descuentos aplicados)
 * @param {Array} cart - Items en el carrito
 * @param {Array} appliedPromotions - Promociones aplicadas
 * @returns {number} - Precio total
 */
export const calculateTotalPrice = (cart, appliedPromotions) => {
  const subtotal = calculateSubtotal(cart);
  const discount = calculateTotalDiscount(appliedPromotions);
  return Math.max(0, subtotal - discount);
};

/**
 * Calcula la cantidad total de items en el carrito (incluyendo cantidades)
 * @param {Array} cart - Items en el carrito
 * @returns {number} - Cantidad total de items
 */
export const calculateTotalItems = (cart) => {
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
};
