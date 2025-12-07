import { useState } from 'react';
import { calculateRemainingPayment, isFullyPaid as checkFullyPaid, getServicesWithoutPrice } from '../utils/payments/paymentHelpers';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook para manejar el estado de pago de una orden
 *
 * @param {Object} order - Orden completa
 * @param {Array} localServices - Servicios locales (pueden tener precios actualizados)
 * @param {Object} confirmDialog - Estado del dialog de confirmación
 * @param {Function} setConfirmDialog - Setter del dialog de confirmación
 * @returns {Object} Estados y funciones para manejar pagos
 */
export function usePaymentManagement(order, localServices, confirmDialog, setConfirmDialog) {
  const { showInfo } = useNotification();

  const [paymentData, setPaymentData] = useState({
    advancePayment: parseFloat(order.advancePayment) || 0,
    paymentStatus: order.paymentStatus || 'pending',
    paymentMethod: order.paymentMethod || 'pending'
  });

  const totalPrice = order.totalPrice || 0;
  const advancePayment = paymentData.advancePayment;

  // Calcular pago restante
  const remainingPayment = calculateRemainingPayment(
    totalPrice,
    advancePayment,
    paymentData.paymentStatus
  );

  // Determinar si la orden está completamente pagada
  const isFullyPaid = checkFullyPaid(
    remainingPayment,
    paymentData.paymentStatus,
    localServices
  );

  // Detectar servicios sin precio
  const servicesWithoutPrice = getServicesWithoutPrice(localServices);
  const hasServicesWithoutPrice = servicesWithoutPrice.length > 0;

  // Handler personalizado para cobrar
  const handleCobrar = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirmar Pago',
      message: `¿Confirmar pago de $${remainingPayment}?`,
      type: 'default',
      onConfirm: () => {
        // Actualizar estado local - se guardará al cerrar el modal
        setPaymentData({
          ...paymentData,
          paymentStatus: 'paid',
          paymentMethod: 'cash'
        });
        // Notificar al usuario
        showInfo('Pago registrado. Se guardará al cerrar el modal.');
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  return {
    paymentData,
    setPaymentData,
    totalPrice,
    advancePayment,
    remainingPayment,
    isFullyPaid,
    hasServicesWithoutPrice,
    servicesWithoutPrice,
    handleCobrar
  };
}
