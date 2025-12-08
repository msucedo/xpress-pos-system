/**
 * Constantes para filtros de histórico de órdenes
 */

/**
 * Estado inicial de filtros
 */
export const INITIAL_FILTERS = {
  orderNumber: '',
  photo: 'all', // 'all', 'with', 'without'
  client: '',
  createdDateFrom: '',
  createdDateTo: '',
  deliveryDateFrom: '',
  deliveryDateTo: '',
  statusOrder: [], // array of selected statuses
  services: [], // array of selected service names
  totalMin: '',
  totalMax: '',
  paymentStatus: [], // array of selected payment statuses
  paymentMethod: [], // array of selected payment methods
  author: [] // array of selected author IDs
};

/**
 * Opciones de estados de orden
 */
export const STATUS_OPTIONS = [
  { value: 'recibidos', label: 'Recibido' },
  { value: 'proceso', label: 'En Proceso' },
  { value: 'listos', label: 'Listo' },
  { value: 'enEntrega', label: 'En Entrega' },
  { value: 'completados', label: 'Completado' },
  { value: 'cancelado', label: 'Cancelado' }
];

/**
 * Opciones de estados de pago
 */
export const PAYMENT_STATUS_OPTIONS = [
  { value: 'paid', label: 'Pagado' },
  { value: 'partial', label: 'Parcial' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'cancelled', label: 'Cancelado' }
];

/**
 * Opciones de métodos de pago
 */
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'pending', label: 'Pendiente' }
];

/**
 * Número de items por página en paginación
 */
export const ITEMS_PER_PAGE = 25;
