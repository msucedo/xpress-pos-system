import { useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { validateForm } from '../utils/promotions/promotionValidations';

/**
 * Hook para manejar validación del formulario de promociones
 * @returns {Object} Funciones de validación
 */
export function usePromotionValidation() {
  const { showValidationErrors } = useNotification();

  /**
   * Valida el formulario completo
   * @param {Object} formData - Datos del formulario
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  const validate = useCallback((formData) => {
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      showValidationErrors(errors);
      return { isValid: false, errors };
    }

    return { isValid: true, errors: {} };
  }, [showValidationErrors]);

  return {
    validate
  };
}
