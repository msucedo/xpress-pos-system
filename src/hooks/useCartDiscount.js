import { useState } from 'react';
import { useInputValidation } from './useInputValidation';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook para manejar descuentos manuales en el carrito
 * Soporta descuentos por monto ($) o porcentaje (%)
 *
 * @param {number} subtotal - Subtotal del carrito
 * @param {Function} applyDiscount - Función para aplicar descuento (de useCart)
 * @param {Array} appliedPromotions - Promociones aplicadas (deshabilita descuento manual)
 * @returns {Object} Estado y handlers de descuento
 */
export function useCartDiscount(subtotal, applyDiscount, appliedPromotions) {
  const { showSuccess, showWarning } = useNotification();
  const [discountTypeInput, setDiscountTypeInput] = useState('amount');

  // Input validado para descuento (entero para %, decimal para $)
  const {
    value: discountInput,
    setValue: setDiscountInput,
    onChange: handleDiscountChange,
    onKeyPress: handleDiscountKeyPress,
    showFeedback: showDiscountFeedback
  } = useInputValidation('', discountTypeInput === 'percentage' ? 'INTEGER' : 'NUMBER');

  /**
   * Aplica el descuento si es válido
   * Valida límites según el tipo de descuento
   */
  const handleApplyDiscount = () => {
    const value = parseFloat(discountInput) || 0;

    // Validar límites según tipo de descuento
    const maxDiscount = discountTypeInput === 'percentage' ? 100 : subtotal;

    if (value > maxDiscount) {
      showWarning(
        `Descuento máximo: ${discountTypeInput === 'percentage' ? '100%' : `$${subtotal.toFixed(2)}`}`
      );
      return;
    }

    if (value < 0) {
      showWarning('El descuento no puede ser negativo');
      return;
    }

    applyDiscount(value, discountTypeInput);
    showSuccess('Descuento aplicado');
  };

  return {
    discountInput,
    setDiscountInput,
    discountTypeInput,
    setDiscountTypeInput,
    handleDiscountChange,
    handleDiscountKeyPress,
    handleApplyDiscount,
    showDiscountFeedback
  };
}
