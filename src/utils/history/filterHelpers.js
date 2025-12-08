/**
 * Funciones de utilidad para filtrado de órdenes en OrderHistory
 */

/**
 * Aplica todos los filtros a un array de órdenes
 *
 * @param {Array} orders - Array de órdenes
 * @param {Object} filters - Objeto de filtros
 * @param {Array} employees - Array de empleados (para filtro de autor)
 * @returns {Array} Órdenes filtradas
 */
export function applyOrderFilters(orders, filters, employees) {
  let filtered = orders;

  // Filtro por número de orden
  if (filters.orderNumber) {
    filtered = filtered.filter(order =>
      order.orderNumber?.toString().includes(filters.orderNumber)
    );
  }

  // Filtro por foto
  if (filters.photo !== 'all') {
    filtered = filtered.filter(order => {
      const hasPhoto = order.orderImages && order.orderImages.length > 0;
      return filters.photo === 'with' ? hasPhoto : !hasPhoto;
    });
  }

  // Filtro por cliente
  if (filters.client) {
    const clientSearch = filters.client.toLowerCase();
    filtered = filtered.filter(order =>
      order.client?.toLowerCase().includes(clientSearch)
    );
  }

  // Filtro por fecha de creación (desde)
  if (filters.createdDateFrom) {
    const [year, month, day] = filters.createdDateFrom.split('-').map(Number);
    const fromDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    filtered = filtered.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate >= fromDate;
    });
  }

  // Filtro por fecha de creación (hasta)
  if (filters.createdDateTo) {
    const [year, month, day] = filters.createdDateTo.split('-').map(Number);
    const toDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    filtered = filtered.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate <= toDate;
    });
  }

  // Filtro por fecha de entrega (desde)
  if (filters.deliveryDateFrom) {
    const [year, month, day] = filters.deliveryDateFrom.split('-').map(Number);
    const fromDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    filtered = filtered.filter(order => {
      if (!order.deliveryDate) return false;
      // Parse order deliveryDate manually if it's in YYYY-MM-DD format
      let orderDate;
      if (typeof order.deliveryDate === 'string' && order.deliveryDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [y, m, d] = order.deliveryDate.split('-').map(Number);
        orderDate = new Date(y, m - 1, d, 0, 0, 0, 0);
      } else {
        orderDate = new Date(order.deliveryDate);
        orderDate.setHours(0, 0, 0, 0);
      }
      return orderDate >= fromDate;
    });
  }

  // Filtro por fecha de entrega (hasta)
  if (filters.deliveryDateTo) {
    const [year, month, day] = filters.deliveryDateTo.split('-').map(Number);
    const toDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    filtered = filtered.filter(order => {
      if (!order.deliveryDate) return false;
      // Parse order deliveryDate manually if it's in YYYY-MM-DD format
      let orderDate;
      if (typeof order.deliveryDate === 'string' && order.deliveryDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [y, m, d] = order.deliveryDate.split('-').map(Number);
        orderDate = new Date(y, m - 1, d, 23, 59, 59, 999);
      } else {
        orderDate = new Date(order.deliveryDate);
      }
      return orderDate <= toDate;
    });
  }

  // Filtro por estado de orden
  if (filters.statusOrder.length > 0) {
    filtered = filtered.filter(order =>
      filters.statusOrder.includes(order.statusCategory)
    );
  }

  // Filtro por servicios
  if (filters.services.length > 0) {
    filtered = filtered.filter(order => {
      if (!order.services || order.services.length === 0) return false;
      const orderServiceNames = order.services
        .filter(s => s.status !== 'cancelled')
        .map(s => s.serviceName);
      return filters.services.some(serviceName =>
        orderServiceNames.includes(serviceName)
      );
    });
  }

  // Filtro por precio mínimo
  if (filters.totalMin) {
    const min = parseFloat(filters.totalMin);
    filtered = filtered.filter(order =>
      (parseFloat(order.totalPrice) || 0) >= min
    );
  }

  // Filtro por precio máximo
  if (filters.totalMax) {
    const max = parseFloat(filters.totalMax);
    filtered = filtered.filter(order =>
      (parseFloat(order.totalPrice) || 0) <= max
    );
  }

  // Filtro por estado de pago
  if (filters.paymentStatus.length > 0) {
    filtered = filtered.filter(order =>
      filters.paymentStatus.includes(order.paymentStatus)
    );
  }

  // Filtro por método de pago
  if (filters.paymentMethod.length > 0) {
    filtered = filtered.filter(order =>
      filters.paymentMethod.includes(order.paymentMethod)
    );
  }

  // Filtro por autor
  if (filters.author.length > 0) {
    filtered = filtered.filter(order => {
      const authorId = order.authorId || null;
      const authorName = order.author || null;

      if (!authorId && !authorName) {
        // Include orders with no author if "N/A" is selected
        return filters.author.includes('no-author');
      }

      // Check if author ID or name matches
      return filters.author.includes(authorId) ||
             filters.author.some(id => {
               const emp = employees.find(e => e.id === id);
               return emp?.name === authorName;
             });
    });
  }

  return filtered;
}

/**
 * Verifica si una columna tiene filtro activo
 *
 * @param {string} columnName - Nombre de la columna
 * @param {Object} filters - Objeto de filtros
 * @returns {boolean} True si la columna tiene filtro activo
 */
export function hasActiveFilter(columnName, filters) {
  switch (columnName) {
    case 'orderNumber':
      return !!filters.orderNumber;
    case 'photo':
      return filters.photo !== 'all';
    case 'client':
      return !!filters.client;
    case 'createdDate':
      return !!(filters.createdDateFrom || filters.createdDateTo);
    case 'deliveryDate':
      return !!(filters.deliveryDateFrom || filters.deliveryDateTo);
    case 'statusOrder':
      return filters.statusOrder.length > 0;
    case 'services':
      return filters.services.length > 0;
    case 'total':
      return !!(filters.totalMin || filters.totalMax);
    case 'paymentStatus':
      return filters.paymentStatus.length > 0;
    case 'paymentMethod':
      return filters.paymentMethod.length > 0;
    case 'author':
      return filters.author.length > 0;
    default:
      return false;
  }
}

/**
 * Cuenta el número de filtros activos
 *
 * @param {Object} filters - Objeto de filtros
 * @returns {number} Número de filtros activos
 */
export function getActiveFiltersCount(filters) {
  let count = 0;
  if (filters.orderNumber) count++;
  if (filters.photo !== 'all') count++;
  if (filters.client) count++;
  if (filters.createdDateFrom || filters.createdDateTo) count++;
  if (filters.deliveryDateFrom || filters.deliveryDateTo) count++;
  if (filters.statusOrder.length > 0) count++;
  if (filters.services.length > 0) count++;
  if (filters.totalMin || filters.totalMax) count++;
  if (filters.paymentStatus.length > 0) count++;
  if (filters.paymentMethod.length > 0) count++;
  if (filters.author.length > 0) count++;
  return count;
}

/**
 * Limpia filtro de una columna específica
 *
 * @param {string} columnName - Nombre de la columna
 * @param {Object} currentFilters - Filtros actuales
 * @returns {Object} Nuevos filtros con la columna limpiada
 */
export function clearColumnFilter(columnName, currentFilters) {
  switch (columnName) {
    case 'orderNumber':
      return { ...currentFilters, orderNumber: '' };
    case 'photo':
      return { ...currentFilters, photo: 'all' };
    case 'client':
      return { ...currentFilters, client: '' };
    case 'createdDate':
      return { ...currentFilters, createdDateFrom: '', createdDateTo: '' };
    case 'deliveryDate':
      return { ...currentFilters, deliveryDateFrom: '', deliveryDateTo: '' };
    case 'statusOrder':
      return { ...currentFilters, statusOrder: [] };
    case 'services':
      return { ...currentFilters, services: [] };
    case 'total':
      return { ...currentFilters, totalMin: '', totalMax: '' };
    case 'paymentStatus':
      return { ...currentFilters, paymentStatus: [] };
    case 'paymentMethod':
      return { ...currentFilters, paymentMethod: [] };
    case 'author':
      return { ...currentFilters, author: [] };
    default:
      return currentFilters;
  }
}
