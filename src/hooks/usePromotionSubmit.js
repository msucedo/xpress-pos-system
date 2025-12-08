import { useCallback } from 'react';
import { buildPromotionData } from '../utils/promotions/promotionDataBuilder';

/**
 * Hook para manejar el envío del formulario de promoción
 * @param {Function} onSubmit - Callback a ejecutar con los datos procesados
 * @param {Object} initialData - Datos iniciales (null si es creación)
 * @returns {Object} Handler de submit
 */
export function usePromotionSubmit(onSubmit, initialData = null) {
  /**
   * Procesa y envía los datos del formulario
   * @param {Object} formData - Datos del formulario
   */
  const handleSubmit = useCallback((formData) => {
    const promotionData = buildPromotionData(formData, initialData);
    onSubmit(promotionData);
  }, [onSubmit, initialData]);

  return {
    handleSubmit
  };
}
