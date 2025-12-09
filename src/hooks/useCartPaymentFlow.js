import { useState, useEffect, useRef } from 'react';

/**
 * Hook para manejar el flujo de pago del carrito
 * Gestiona las transiciones entre carrito y pantalla de pago con animaciones
 *
 * @param {Function} canCheckout - Función de validación del carrito
 * @returns {Object} Estado y handlers del flujo de pago
 */
export function useCartPaymentFlow(canCheckout) {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAnimating, setPaymentAnimating] = useState(false);
  const paymentCancelTimeoutRef = useRef(null);

  /**
   * Inicia el flujo de pago
   * Valida el carrito y muestra la pantalla de pago con animación
   */
  const handleProceedToPayment = () => {
    const validation = canCheckout();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    // Mostrar pantalla de pago con animación
    setShowPayment(true);
    setPaymentAnimating(true);
  };

  /**
   * Cancela el pago y regresa al carrito
   * Maneja la animación de salida de la pantalla de pago
   */
  const handlePaymentCancel = () => {
    // Iniciar animación de salida
    setPaymentAnimating(false);

    // Limpiar timeout previo si existe
    if (paymentCancelTimeoutRef.current) {
      clearTimeout(paymentCancelTimeoutRef.current);
    }

    // Esperar a que termine la animación (1s) antes de ocultar
    paymentCancelTimeoutRef.current = setTimeout(() => {
      setShowPayment(false);
    }, 1000);
  };

  // Cleanup del timeout cuando se desmonta el componente
  useEffect(() => {
    return () => {
      if (paymentCancelTimeoutRef.current) {
        clearTimeout(paymentCancelTimeoutRef.current);
      }
    };
  }, []);

  return {
    showPayment,
    setShowPayment,
    paymentAnimating,
    setPaymentAnimating,
    handleProceedToPayment,
    handlePaymentCancel
  };
}
