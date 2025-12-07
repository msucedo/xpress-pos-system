import { useState } from 'react';
import { printTicket, getPrinterStatus } from '../services/printService';
import { addPrintJob } from '../services/printQueueService';
import { addPrintRecord } from '../services/firebaseService';
import { shouldUseQueuePrinting, getPrintOptions, createPrintRecord, getPrintSuccessMessage, getPrintErrorMessage } from '../utils/printing/printHelpers';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook para manejar acciones de orden (imprimir, WhatsApp, etc.)
 *
 * @param {Object} order - Orden completa
 * @returns {Object} Estados y funciones para acciones
 */
export function useOrderActions(order) {
  const { showSuccess, showInfo, showError } = useNotification();
  const [isPrinting, setIsPrinting] = useState(false);

  // Manejar impresión de tickets
  const handlePrint = async (type) => {
    // Prevenir doble-click
    if (isPrinting) {
      showInfo('Ya hay una impresión en proceso, por favor espera...');
      return;
    }

    setIsPrinting(true);

    // Verificar preferencia del usuario
    const shouldUseQueue = shouldUseQueuePrinting();

    // Safety timeout como backup
    const safetyTimeoutId = setTimeout(() => {
      console.log('⏱️ Safety timeout: liberando UI');
      setIsPrinting(false);
    }, 5000);

    try {
      if (shouldUseQueue) {
        // Usar cola: enviar automáticamente
        clearTimeout(safetyTimeoutId);
        setIsPrinting(false);
        try {
          await addPrintJob(order.id, order.orderNumber, type);
          showSuccess(`Ticket de ${type === 'receipt' ? 'recepción' : 'entrega'} enviado a la impresora del local`);
        } catch (error) {
          console.error('Error al enviar ticket a cola:', error);
          showError('Error al enviar ticket a impresora');
        }
        return;
      }

      // Impresión directa: verificar estado de impresora Bluetooth
      const printerStatus = getPrinterStatus();
      const options = getPrintOptions(printerStatus);

      // Imprimir
      const result = await printTicket(order, type, options);

      // Limpiar timeout - operación completó
      clearTimeout(safetyTimeoutId);

      if (!result.success) {
        const errorMessage = getPrintErrorMessage(result);
        if (result.cancelled) {
          showInfo(errorMessage);
        } else {
          showError(errorMessage);
        }
        return;
      }

      // Registrar en Firebase
      const printData = createPrintRecord(type, result, printerStatus);
      const recordResult = await addPrintRecord(order.id, printData);

      if (recordResult.success) {
        showSuccess(getPrintSuccessMessage(type));
      } else {
        showError('Ticket impreso, pero no se guardó en el historial');
      }
    } catch (error) {
      clearTimeout(safetyTimeoutId);
      showError('Error al imprimir: ' + error.message);
    } finally {
      clearTimeout(safetyTimeoutId);
      setIsPrinting(false);
    }
  };

  // Manejar apertura de WhatsApp
  const handleWhatsApp = (totalPrice) => {
    const phone = order.phone.replace(/\D/g, '');
    const message = `Hola ${order.client}, tu orden está lista para recoger. Total: $${totalPrice}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return {
    isPrinting,
    handlePrint,
    handleWhatsApp
  };
}
