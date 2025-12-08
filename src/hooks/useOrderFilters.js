import { useState, useMemo, useCallback } from 'react';
import { applyOrderFilters, hasActiveFilter as checkActiveFilter, getActiveFiltersCount as countActiveFilters, clearColumnFilter as clearFilter } from '../utils/history/filterHelpers';
import { INITIAL_FILTERS } from '../utils/history/filterConstants';

/**
 * Hook para manejar estado de filtros y órdenes filtradas
 *
 * @param {Array} orders - Array de órdenes combinadas
 * @param {Array} employees - Array de empleados
 * @returns {Object} Estado y funciones de filtros
 */
export function useOrderFilters(orders, employees) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Aplicar filtros usando helper
  const filteredOrders = useMemo(() => {
    return applyOrderFilters(orders, filters, employees);
  }, [orders, filters, employees]);

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    return countActiveFilters(filters);
  }, [filters]);

  // Limpiar todos los filtros
  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Limpiar filtro de columna específica
  const handleClearColumnFilter = useCallback((columnName) => {
    setFilters(prev => clearFilter(columnName, prev));
  }, []);

  // Toggle checkbox en filtros multi-select
  const toggleCheckbox = useCallback((filterName, value) => {
    setFilters(prev => {
      const currentValues = prev[filterName];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterName]: newValues };
    });
  }, []);

  // Verificar si columna tiene filtro activo
  const hasColumnActiveFilter = useCallback((columnName) => {
    return checkActiveFilter(columnName, filters);
  }, [filters]);

  return {
    filters,
    setFilters,
    filteredOrders,
    activeFiltersCount,
    handleClearFilters,
    clearColumnFilter: handleClearColumnFilter,
    toggleCheckbox,
    hasActiveFilter: hasColumnActiveFilter
  };
}
