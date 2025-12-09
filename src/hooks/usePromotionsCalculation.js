import { useState, useEffect, useCallback } from 'react';
import { validatePromotion } from '../services/firebaseService';
import { calculateSubtotal } from '../utils/promotions/promotionCalculations';

/**
 * Hook para manejar cálculo y validación de promociones aplicables al carrito
 *
 * @param {Array} cart - Items en el carrito
 * @param {string} clientPhone - Teléfono del cliente
 * @param {Array} activePromotions - Promociones activas disponibles
 * @returns {Object} { appliedPromotions, promotionValidations }
 */
export function usePromotionsCalculation(cart, clientPhone, activePromotions) {
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [promotionValidations, setPromotionValidations] = useState({});

  // Validar y calcular promociones aplicables - memoizado con useCallback
  const checkApplicablePromotions = useCallback(async () => {
    if (cart.length === 0 || activePromotions.length === 0) {
      setAppliedPromotions([]);
      setPromotionValidations({});
      return;
    }

    const subtotal = calculateSubtotal(cart);

    const validPromotions = [];
    const validations = {};

    for (const promotion of activePromotions) {
      const result = await validatePromotion(promotion, cart, clientPhone, subtotal);

      // Guardar resultado de validación para mostrar razón si no aplica
      validations[promotion.id] = {
        isValid: result.isValid,
        reason: result.reason || '',
        discountAmount: result.discountAmount || 0
      };

      if (result.isValid && result.discountAmount > 0) {
        validPromotions.push({
          ...promotion,
          discountAmount: result.discountAmount
        });
      }
    }

    setAppliedPromotions(validPromotions);
    setPromotionValidations(validations);
  }, [cart, clientPhone, activePromotions]);

  // Recalcular promociones cuando cambie la función memoizada
  useEffect(() => {
    checkApplicablePromotions();
  }, [checkApplicablePromotions]);

  return {
    appliedPromotions,
    promotionValidations,
    refetchPromotions: checkApplicablePromotions
  };
}
