/**
 * Funciones de utilidad para el manejo de órdenes
 */

/**
 * Muestra fecha relativa con hora (ej: "hoy 14:30", "ayer 09:15", "hace 3 días 16:00")
 *
 * @param {string} dateString - Fecha en formato ISO string
 * @returns {string} Fecha formateada con texto relativo y hora
 */
export function getRelativeTimeWithHour(dateString) {
  if (!dateString) return 'Nunca';

  const date = new Date(dateString);
  const now = new Date();

  // Crear fechas sin hora para comparar días de calendario
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffInMs = nowOnly - dateOnly;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Obtener hora en formato HH:MM
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  if (diffInDays === 0) return `hoy ${timeStr}`;
  if (diffInDays === 1) return `ayer ${timeStr}`;
  if (diffInDays === 2) return `hace dos días ${timeStr}`;
  if (diffInDays === 3) return `hace tres días ${timeStr}`;
  if (diffInDays < 7) return `hace ${diffInDays} días ${timeStr}`;
  if (diffInDays < 14) return `hace 1 semana ${timeStr}`;
  if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} semanas ${timeStr}`;
  if (diffInDays < 60) return `hace 1 mes`;
  if (diffInDays < 365) return `hace ${Math.floor(diffInDays / 30)} meses`;
  return `hace ${Math.floor(diffInDays / 365)} años`;
}

/**
 * Formatea fecha de entrega para mostrar (ej: "Hoy", "Mañana", "15 ene 2025")
 *
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada de manera amigable
 */
export function formatDeliveryDateDisplay(dateString) {
  if (!dateString) return '';

  // Parsear la fecha como local en lugar de UTC
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Remove time component for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'Hoy';
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'Mañana';
  } else {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }
}

/**
 * Convierte data URI (base64) a Blob para descarga/compartir
 *
 * @param {string} dataURI - Data URI (ej: "data:application/pdf;base64,...")
 * @returns {Blob} Blob object para compartir o descargar
 */
export function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

/**
 * Detecta si hay cambios comparando datos actuales vs iniciales
 *
 * @param {Object} currentData - Datos actuales de la orden
 * @param {Object} initialData - Datos iniciales de la orden
 * @returns {boolean} True si hay cambios
 */
export function detectChanges(currentData, initialData) {
  if (!currentData || !initialData) return false;
  return JSON.stringify(currentData) !== JSON.stringify(initialData);
}

/**
 * Genera nombre de archivo para factura
 *
 * @param {Object} order - Objeto de la orden
 * @returns {string} Nombre del archivo (ej: "Factura_1234_Juan_Perez_07-12-2025.pdf")
 */
export function generateInvoiceFileName(order) {
  const orderNum = order.orderNumber || order.id.substring(0, 8);
  const clientName = order.client.replace(/\s+/g, '_');
  const date = new Date(order.createdAt).toLocaleDateString('es-MX').replace(/\//g, '-');
  return `Factura_${orderNum}_${clientName}_${date}.pdf`;
}

/**
 * Detecta si es dispositivo móvil (ancho < 768px)
 *
 * @returns {boolean} True si es móvil
 */
export function isMobileDevice() {
  return window.innerWidth < 768;
}

/**
 * Formatea fecha para tabla de histórico con manejo robusto de timezones
 *
 * @param {string} dateString - Fecha en formato ISO o YYYY-MM-DD
 * @returns {string} Fecha formateada (ej: "15 ene 2025")
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';

  let date;

  // Si es formato YYYY-MM-DD (sin hora)
  if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-');
    date = new Date(year, month - 1, day);
  } else {
    // Si es timestamp de Firebase o ISO string
    date = new Date(dateString);
  }

  // Validar fecha
  if (isNaN(date.getTime())) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Combina órdenes de todas las categorías y las ordena por número descendente
 *
 * @param {Object} orders - Objeto con órdenes agrupadas por estado
 * @returns {Array} Array de órdenes combinadas y ordenadas
 */
export function combineAndSortOrders(orders) {
  const combined = [
    ...orders.recibidos.map(o => ({ ...o, statusCategory: 'recibidos' })),
    ...orders.proceso.map(o => ({ ...o, statusCategory: 'proceso' })),
    ...orders.listos.map(o => ({ ...o, statusCategory: 'listos' })),
    ...orders.enEntrega.map(o => ({ ...o, statusCategory: 'enEntrega' })),
    ...orders.completados.map(o => ({ ...o, statusCategory: 'completados' })),
    ...orders.cancelado.map(o => ({ ...o, statusCategory: 'cancelado' }))
  ];

  // Ordenar por número de orden descendente (más recientes primero)
  return combined.sort((a, b) => {
    const numA = parseInt(a.orderNumber) || 0;
    const numB = parseInt(b.orderNumber) || 0;
    return numB - numA;
  });
}

/**
 * Extrae lista única de servicios de todas las órdenes
 *
 * @param {Array} orders - Array de órdenes
 * @returns {Array} Array de objetos { name, icon } únicos y ordenados
 */
export function extractUniqueServices(orders) {
  const servicesMap = new Map();

  orders.forEach(order => {
    if (order.services && order.services.length > 0) {
      order.services.forEach(service => {
        if (service.status !== 'cancelled' && service.serviceName) {
          servicesMap.set(service.serviceName, {
            name: service.serviceName,
            icon: service.icon || '🛠️'
          });
        }
      });
    }
  });

  return Array.from(servicesMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

/**
 * Obtiene información del autor de la orden con matching de empleados
 *
 * @param {Object} order - Orden
 * @param {Array} employees - Lista de empleados
 * @returns {Object} { name, emoji } del autor
 */
export function getAuthorInfo(order, employees) {
  const authorId = order.authorId || null;
  const authorName = order.author || null;

  if (!authorId && !authorName) {
    return { name: 'N/A', emoji: null };
  }

  const author = authorId
    ? employees.find(emp => emp.id === authorId)
    : employees.find(emp => emp.name === authorName);

  return {
    name: author?.name || authorName || 'N/A',
    emoji: author?.emoji || null
  };
}

/**
 * Agrupa y cuenta íconos de servicios de una orden
 *
 * @param {Object} order - Orden con array de servicios
 * @returns {Array} Array de { emoji, count } agrupados
 */
export function getServiceIcons(order) {
  if (!order.services || order.services.length === 0) return [];

  const activeServices = order.services.filter(
    service => service.status !== 'cancelled'
  );
  const grouped = {};

  activeServices.forEach(service => {
    const emoji = service.icon || '🛠️';
    if (!grouped[emoji]) {
      grouped[emoji] = { emoji, count: 0 };
    }
    grouped[emoji].count++;
  });

  return Object.values(grouped);
}
