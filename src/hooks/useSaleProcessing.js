import { useState, useRef, useCallback } from 'react';
import { createSale } from '../services/salesService';
import { incrementPromotionUsage } from '../services/firebaseService';
import { prepareSaleData } from '../utils/sales/saleDataBuilder';
import { handleSalePrinting } from '../utils/sales/printingHelpers';
import { parseSaleError } from '../utils/sales/errorHandlers';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook para procesar ventas del carrito
 * Maneja creación de venta, promociones, impresión y limpieza
 *
 * @param {Object} params - Parámetros de la venta
 * @returns {Object} Handler de confirmación de pago y estado de procesamiento
 */
export function useSaleProcessing({
  cartItems,
  subtotal,
  discount,
  discountType,
  discountAmount,
  total,
  selectedClient,
  notes,
  employee,
  user,
  appliedPromotions,
  clearCart,
  setShowPayment,
  setPaymentAnimating,
  setIsCartOpen
}) {
  const { showSuccess, showError, showWarning } = useNotification();
  const [isProcessing, setIsProcessing] = useState(false);
  const isPrintingRef = useRef(false);

  /**
   * Maneja la confirmación del pago y procesamiento completo de la venta
   */
  const handlePaymentConfirm = useCallback(async (paymentData) => {
    setIsProcessing(true);

    try {
      // 1. Preparar datos de la venta
      const saleData = prepareSaleData({
        cartItems,
        subtotal,
        discount,
        discountType,
        discountAmount,
        total,
        paymentData,
        selectedClient,
        notes,
        employee,
        user,
        appliedPromotions
      });

      // 2. Crear la venta en Firebase (actualiza inventario automáticamente)
      const saleId = await createSale(saleData);

      // 3. Incrementar uso de promociones
      await incrementPromotionsUsage(appliedPromotions, selectedClient);

      // 4. Mostrar mensaje de éxito
      showSuccess(`Venta completada exitosamente. ID: ${saleId.substring(0, 8)}`);

      // 5. Manejar impresión (cola o Bluetooth según preferencia)
      await handleSalePrinting(saleId, saleData, isPrintingRef, showWarning);

      // 6. Limpiar carrito y cerrar
      clearCart();
      setShowPayment(false);
      setPaymentAnimating(false);
      setIsCartOpen(false);
    } catch (error) {
      // Parsear y mostrar error user-friendly
      const errorMessage = parseSaleError(error);
      showError(errorMessage);

      // Resetear estados de pago para que usuario pueda volver al carrito
      setShowPayment(false);
      setPaymentAnimating(false);
    } finally {
      setIsProcessing(false);
    }
  }, [
    cartItems,
    subtotal,
    discount,
    discountType,
    discountAmount,
    total,
    selectedClient,
    notes,
    employee,
    user,
    appliedPromotions,
    clearCart,
    setShowPayment,
    setPaymentAnimating,
    setIsCartOpen,
    showSuccess,
    showError,
    showWarning
  ]);

  return {
    handlePaymentConfirm,
    isProcessing
  };
}

/**
 * Incrementa el contador de uso de promociones aplicadas
 * @param {Array} appliedPromotions - Promociones aplicadas
 * @param {Object|null} selectedClient - Cliente seleccionado
 */
async function incrementPromotionsUsage(appliedPromotions, selectedClient) {
  if (!appliedPromotions || appliedPromotions.length === 0) {
    return;
  }

  for (const promo of appliedPromotions) {
    try {
      await incrementPromotionUsage(promo.id, selectedClient?.phone || '');
    } catch (error) {
      console.error('Error incrementing promotion usage:', error);
    }
  }
}
