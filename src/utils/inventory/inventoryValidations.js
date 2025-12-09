/**
 * Funciones de validación para el módulo de inventario
 * Todas son funciones puras que retornan mensajes de error o null
 */

/**
 * Valida que el nombre no esté vacío
 * @param {string} name - Nombre del producto
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return 'El nombre es requerido';
  }
  return null;
}

/**
 * Valida que la categoría esté seleccionada
 * @param {string} category - Categoría del producto
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateCategory(category) {
  if (!category) {
    return 'La categoría es requerida';
  }
  return null;
}

/**
 * Valida que el código de barras no esté vacío
 * @param {string} barcode - Código de barras
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateBarcode(barcode) {
  if (!barcode || barcode.trim() === '') {
    return 'El código de barras es requerido';
  }
  return null;
}

/**
 * Valida el precio de compra
 * @param {number|string} purchasePrice - Precio de compra
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validatePurchasePrice(purchasePrice) {
  if (purchasePrice === '' || isNaN(purchasePrice) || parseFloat(purchasePrice) < 0) {
    return 'El precio de compra debe ser un número positivo';
  }
  return null;
}

/**
 * Valida el precio de venta
 * @param {number|string} salePrice - Precio de venta
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateSalePrice(salePrice) {
  if (salePrice === '' || isNaN(salePrice) || parseFloat(salePrice) < 0) {
    return 'El precio de venta debe ser un número positivo';
  }
  return null;
}

/**
 * Valida que el precio de venta sea mayor al precio de compra
 * @param {number|string} purchasePrice - Precio de compra
 * @param {number|string} salePrice - Precio de venta
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validatePriceRelation(purchasePrice, salePrice) {
  const purchase = parseFloat(purchasePrice);
  const sale = parseFloat(salePrice);

  if (sale < purchase) {
    return 'El precio de venta debe ser mayor al precio de compra';
  }
  return null;
}

/**
 * Valida el stock actual
 * @param {number|string} stock - Stock actual
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateStock(stock) {
  if (stock === '' || isNaN(stock) || parseInt(stock) < 0) {
    return 'El stock debe ser un número positivo';
  }
  return null;
}

/**
 * Valida el stock mínimo
 * @param {number|string} minStock - Stock mínimo
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateMinStock(minStock) {
  if (minStock === '' || isNaN(minStock) || parseInt(minStock) < 0) {
    return 'El stock mínimo debe ser un número positivo';
  }
  return null;
}
