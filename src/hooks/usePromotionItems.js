import { useMemo } from 'react';
import { combineServicesAndProducts } from '../utils/promotions/promotionTypes';

/**
 * Hook genérico y reutilizable para manejar items (servicios y productos)
 * @param {Array} services - Array de servicios
 * @param {Array} products - Array de productos
 * @returns {Object} Items combinados y helpers
 */
export function usePromotionItems(services = [], products = []) {
  /**
   * Combina servicios y productos en un único array con formato unificado
   * Memoizado para evitar recálculos innecesarios
   */
  const allItems = useMemo(() =>
    combineServicesAndProducts(services, products),
    [services, products]
  );

  return {
    allItems
  };
}
