/**
 * Constantes y configuraciones para el módulo de inventario
 */

/**
 * Categorías de productos disponibles
 */
export const PRODUCT_CATEGORIES = [
  'Accesorios',
  'Gorras',
  'Bolsas',
  'Pines',
  'Agujetas'
];

/**
 * Estado inicial de un producto
 */
export const DEFAULT_PRODUCT_STATE = {
  name: '',
  category: 'Accesorios',
  description: '',
  barcode: '',
  emoji: 'picture',
  purchasePrice: '',
  salePrice: '',
  stock: '',
  minStock: '',
  images: []
};

/**
 * Emoji por defecto para productos
 */
export const DEFAULT_EMOJI = 'picture';
