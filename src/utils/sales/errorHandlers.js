/**
 * Funciones para manejar y parsear errores de ventas
 * Retornan mensajes user-friendly para diferentes tipos de errores
 */

/**
 * Parsea un error de venta y retorna un mensaje user-friendly
 * @param {Error} error - Error capturado
 * @returns {string} Mensaje de error formateado para mostrar al usuario
 */
export function parseSaleError(error) {
  // Error de stock insuficiente
  if (error.message && error.message.includes('Stock insuficiente')) {
    return parseStockError(error.message);
  }

  // Error de producto no encontrado
  if (error.message && error.message.includes('no encontrado')) {
    return '⚠️ Uno o más productos ya no están disponibles en el inventario.';
  }

  // Error genérico
  if (error.message) {
    return error.message;
  }

  // Error desconocido
  return 'Error al procesar la venta. Por favor intenta de nuevo.';
}

/**
 * Parsea un error de stock insuficiente y extrae el nombre del producto
 * @param {string} errorMessage - Mensaje de error original
 * @returns {string} Mensaje formateado con el nombre del producto
 */
function parseStockError(errorMessage) {
  // Intentar extraer el nombre del producto del mensaje
  const match = errorMessage.match(/Stock insuficiente para (.+?)\./);

  if (match) {
    return `⚠️ No hay suficiente stock de "${match[1]}". Por favor verifica el inventario.`;
  }

  return '⚠️ Stock insuficiente para completar la venta. Verifica las cantidades.';
}

/**
 * Retorna un mensaje de error genérico para ventas
 * @param {Error} error - Error capturado
 * @returns {string} Mensaje de error genérico
 */
export function getSaleErrorMessage(error) {
  console.error('Error al procesar la venta:', error);
  return parseSaleError(error);
}
