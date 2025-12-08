/**
 * Constantes y configuraciones para tipos de promociones
 */

// Tipos de promociones disponibles
export const PROMOTION_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
  BUY_X_GET_Y: 'buyXgetY',
  BUY_X_GET_Y_DISCOUNT: 'buyXgetYdiscount',
  COMBO: 'combo',
  SPECIFIC_PRICE: 'specificPrice',
  DAY_OF_WEEK: 'dayOfWeek'
};

// Configuración de cada tipo de promoción
export const PROMOTION_TYPE_CONFIG = {
  percentage: {
    label: 'Descuento %',
    icon: '%',
    example: 'Ej: 20% OFF en Limpieza calzado blanco y gamusa',
    fields: ['discountValue', 'appliesTo', 'specificItems']
  },
  fixed: {
    label: 'Descuento Fijo',
    icon: '$',
    example: 'Ej: $50 OFF en cualquier servicio',
    fields: ['discountValue', 'applicableItems']
  },
  buyXgetY: {
    label: 'Compra y Lleva',
    icon: '2x1',
    example: 'Ej: 2x1, 3x2 gratis',
    fields: ['buyQuantity', 'getQuantity', 'applicableItems']
  },
  buyXgetYdiscount: {
    label: 'Compra y Descuento',
    icon: '🏷️',
    example: 'Ej: 2do a 50% OFF',
    fields: ['buyQuantity', 'discountPercentage', 'applicableItems']
  },
  combo: {
    label: 'Combo/Paquete',
    icon: '📦',
    example: 'Ej: 2 servicios por $200',
    fields: ['comboItems', 'comboPrice']
  },
  specificPrice: {
    label: 'Precio Específico',
    icon: '💰',
    example: 'Ej: Producto a $50',
    fields: ['specificPrice', 'applicableItems']
  },
  dayOfWeek: {
    label: 'Día de Semana',
    icon: '📅',
    example: 'Ej: Martes 15% OFF',
    fields: ['discountValue', 'daysOfWeek']
  }
};

// Nombres de días de la semana
export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Opciones para el campo "appliesTo" en promociones de porcentaje
export const APPLIES_TO_OPTIONS = [
  { value: 'all', label: 'Todos los items' },
  { value: 'services', label: 'Solo servicios' },
  { value: 'products', label: 'Solo productos' },
  { value: 'specific', label: 'Items específicos' }
];

/**
 * Obtiene los campos que debe tener un tipo de promoción
 * @param {string} type - Tipo de promoción
 * @returns {Array<string>} Array de nombres de campos
 */
export function getTypeFields(type) {
  return PROMOTION_TYPE_CONFIG[type]?.fields || [];
}

/**
 * Verifica si un tipo requiere un campo específico
 * @param {string} type - Tipo de promoción
 * @param {string} field - Nombre del campo
 * @returns {boolean}
 */
export function typeRequiresField(type, field) {
  const fields = getTypeFields(type);
  return fields.includes(field);
}

/**
 * Obtiene todos los campos únicos que usan todas las promociones
 * @returns {Array<string>}
 */
export function getAllPromotionFields() {
  const allFields = new Set();

  Object.values(PROMOTION_TYPE_CONFIG).forEach(config => {
    config.fields.forEach(field => allFields.add(field));
  });

  return Array.from(allFields);
}

/**
 * Combina servicios y productos en un array único de items
 * @param {Array} services - Array de servicios
 * @param {Array} products - Array de productos
 * @returns {Array} Array combinado de items con formato unificado
 */
export function combineServicesAndProducts(services = [], products = []) {
  return [
    ...services.map(s => ({
      id: s.id,
      name: s.name,
      type: 'service',
      price: s.price
    })),
    ...products.map(p => ({
      id: p.id,
      name: p.name,
      type: 'product',
      price: p.salePrice
    }))
  ];
}
