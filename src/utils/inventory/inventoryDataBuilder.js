/**
 * Funciones para construir y preparar datos de productos para envío
 * Todas son funciones puras que transforman formData a formato requerido
 */

/**
 * Prepara los datos del producto para envío, convirtiendo strings a números
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Datos preparados con tipos correctos
 */
export function prepareProductData(formData) {
  return {
    ...formData,
    purchasePrice: parseFloat(formData.purchasePrice),
    salePrice: parseFloat(formData.salePrice),
    stock: parseInt(formData.stock),
    minStock: parseInt(formData.minStock)
  };
}

/**
 * Carga datos iniciales en el estado del formulario
 * @param {Object|null} initialData - Datos iniciales del producto
 * @param {Object} defaultState - Estado por defecto
 * @returns {Object} Estado del formulario inicializado
 */
export function loadInitialProductData(initialData, defaultState) {
  if (!initialData) {
    return defaultState;
  }

  return {
    name: initialData.name || '',
    category: initialData.category || 'Tenis',
    description: initialData.description || '',
    barcode: initialData.barcode || '',
    emoji: initialData.emoji || '📦',
    purchasePrice: initialData.purchasePrice || '',
    salePrice: initialData.salePrice || '',
    stock: initialData.stock || '',
    minStock: initialData.minStock || '',
    images: initialData.images || []
  };
}
