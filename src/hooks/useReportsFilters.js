import { useState, useCallback, useMemo } from 'react';

/**
 * Hook para manejar los filtros de Reports
 * @param {Object} params
 * @param {Object} params.orders - Órdenes organizadas por estado
 * @param {Object} params.todayDraft - Borrador del día actual
 * @param {Array} params.closures - Cortes de caja
 * @param {string} params.activeTab - Tab activo (para forzar filtro "Hoy" en corte de caja)
 * @returns {Object} Filter state and filtering functions
 */
export const useReportsFilters = ({ orders, todayDraft, closures, activeTab }) => {
  const [activeFilter, setActiveFilter] = useState('Hoy');

  const dateFilters = ['Hoy', 'Semana', 'Mes', 'Año'];

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  // Helper: Get date range for current filter
  const getDateRange = useCallback((filter = activeFilter) => {
    const now = new Date();
    let startDate, endDate;

    switch (filter) {
      case 'Hoy':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      case 'Semana': {
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      }
      case 'Mes':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'Año':
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    }

    return { startDate, endDate };
  }, [activeFilter]);

  // Helper: Check if today is within a date range
  const isTodayInRange = useCallback((startDate, endDate) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    return todayStart >= startDate && todayEnd <= endDate;
  }, []);

  // Helper: Check if today's draft has data (expenses or completed orders)
  const hasDraftData = useCallback(() => {
    // Verificar si ya existe un closure de hoy
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const closureToday = closures.find(closure => {
      if (!closure.fechaCorte) return false;
      const closureDate = new Date(closure.fechaCorte);
      return closureDate >= todayStart && closureDate <= todayEnd;
    });

    // Si ya hay un closure de hoy, no usar draft (evitar duplicación)
    if (closureToday) return false;

    // Si NO hay closure de hoy, verificar si draft tiene datos
    if (!todayDraft) return false;

    // Check if draft has expenses
    if (todayDraft.gastos && todayDraft.gastos.length > 0) {
      return true;
    }

    // Check if there are orders completed today
    const allOrders = [
      ...orders.recibidos,
      ...orders.proceso,
      ...orders.listos,
      ...orders.enEntrega,
      ...orders.completados
    ];

    const ordersToday = allOrders.filter(order => {
      if (!order.completedDate) return false;
      const orderDate = new Date(order.completedDate);
      return orderDate >= todayStart && orderDate <= todayEnd;
    });

    return ordersToday.length > 0;
  }, [todayDraft, closures, orders]);

  // Get filtered orders based on date filter
  const getFilteredOrders = useCallback(() => {
    const { startDate, endDate } = getDateRange();

    // Combine all orders from all statuses
    const allOrders = [
      ...orders.recibidos,
      ...orders.proceso,
      ...orders.listos,
      ...orders.enEntrega,
      ...orders.completados
    ];

    // Filter by date range (using completion date for cash register)
    return allOrders.filter(order => {
      if (!order.completedDate) return false;
      const orderDate = new Date(order.completedDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }, [orders, getDateRange]);

  // Get filtered expenses based on date filter
  const getFilteredExpenses = useCallback(() => {
    // For "Hoy", get expenses from today's draft AND closures of today
    if (activeFilter === 'Hoy') {
      const allExpenses = [];

      // Add expenses from today's draft
      if (todayDraft?.gastos) {
        allExpenses.push(...todayDraft.gastos);
      }

      // Add expenses from all closures of today
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

      const closuresToday = closures.filter(closure => {
        if (!closure.fechaCorte) return false;
        const closureDate = new Date(closure.fechaCorte);
        return closureDate >= todayStart && closureDate <= todayEnd;
      });

      closuresToday.forEach(closure => {
        if (closure.gastos?.items) {
          allExpenses.push(...closure.gastos.items);
        }
      });

      return allExpenses;
    }

    // For historical periods, expenses come from closures
    // This function is no longer used for historical data
    return [];
  }, [activeFilter, todayDraft, closures]);

  // Get filtered closures based on date filter
  const getFilteredClosures = useCallback(() => {
    const { startDate, endDate } = getDateRange();

    const filtered = closures.filter(closure => {
      if (!closure.fechaCorte) return false;
      const closureDate = new Date(closure.fechaCorte);
      return closureDate >= startDate && closureDate <= endDate;
    });

    // Debug log
    console.log('=== CLOSURES DEBUG ===');
    console.log('Total closures:', closures.length);
    console.log('Filter:', activeFilter);
    console.log('Date range:', startDate, 'to', endDate);
    console.log('Filtered closures:', filtered.length);
    if (filtered.length > 0) {
      console.log('Sample closure:', filtered[0]);
    }

    return filtered;
  }, [closures, getDateRange, activeFilter]);

  // Get expenses from closures for ExpensesByCategoryChart
  const getExpensesFromClosures = useCallback(() => {
    const filteredClosures = getFilteredClosures();
    const allExpenses = [];

    filteredClosures.forEach(closure => {
      if (closure.gastos?.items) {
        allExpenses.push(...closure.gastos.items);
      }
    });

    // Include today's draft expenses if applicable (for Semana, Mes, Año filters)
    if (activeFilter !== 'Hoy') {
      const { startDate, endDate } = getDateRange();

      // If today is in range, ALWAYS include draft expenses (independent of closures)
      if (isTodayInRange(startDate, endDate)) {
        if (todayDraft?.gastos) {
          allExpenses.push(...todayDraft.gastos);
        }
      }
    }

    return allExpenses;
  }, [getFilteredClosures, activeFilter, getDateRange, isTodayInRange, todayDraft]);

  // Memoized filtered data
  const filteredOrders = useMemo(() => getFilteredOrders(), [getFilteredOrders]);
  const filteredExpenses = useMemo(() => getFilteredExpenses(), [getFilteredExpenses]);
  const filteredClosures = useMemo(() => getFilteredClosures(), [getFilteredClosures]);

  return {
    // State
    activeFilter,
    dateFilters,

    // Actions
    handleFilterChange,

    // Helpers
    getDateRange,
    isTodayInRange,
    hasDraftData,

    // Filtered data
    filteredOrders,
    filteredExpenses,
    filteredClosures,

    // Additional getters
    getFilteredOrders,
    getFilteredExpenses,
    getFilteredClosures,
    getExpensesFromClosures
  };
};
