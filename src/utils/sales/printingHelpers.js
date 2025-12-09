/**
 * Funciones helper para manejar la impresión de tickets de venta
 * Soporta impresión en cola y Bluetooth automática
 */

import { printTicket } from '../../services/printService';
import { addPrintJob } from '../../services/printQueueService';
import { addSalePrintRecord } from '../../services/salesService';
import { getPrinterMethodPreference, PRINTER_METHODS } from '../printerConfig';

/**
 * Determina si debe usar cola de impresión según la preferencia del usuario
 * @param {string} userPreference - Preferencia de impresión del usuario
 * @returns {boolean} True si debe usar cola
 */
export function shouldUsePrintQueue(userPreference) {
  return userPreference === PRINTER_METHODS.QUEUE || userPreference === 'queue';
}

/**
 * Determina si debe auto-imprimir según la preferencia del usuario
 * @param {string} userPreference - Preferencia de impresión del usuario
 * @returns {boolean} True si debe auto-imprimir
 */
export function shouldAutoprint(userPreference) {
  return userPreference === PRINTER_METHODS.BLUETOOTH || userPreference === 'bluetooth';
}

/**
 * Maneja la impresión de un ticket de venta
 * Soporta dos flujos:
 * 1. Cola de impresión remota: Envía a cola automáticamente
 * 2. Bluetooth: Auto-imprime con reconexión automática
 *
 * @param {string} saleId - ID de la venta
 * @param {Object} saleData - Datos completos de la venta
 * @param {Object} isPrintingRef - Ref para prevenir impresiones duplicadas
 * @param {Function} showWarning - Callback para mostrar advertencias
 * @returns {Promise<void>}
 */
export async function handleSalePrinting(saleId, saleData, isPrintingRef, showWarning) {
  // Obtener preferencia del usuario
  const userPreference = getPrinterMethodPreference();
  const useQueue = shouldUsePrintQueue(userPreference);
  const autoprint = shouldAutoprint(userPreference);

  // FLUJO 1: Impresión Remota en Cola
  if (useQueue) {
    try {
      await addPrintJob(saleId, saleId.substring(0, 8), 'sale');
      console.log('✅ Ticket de venta enviado a cola de impresión');
    } catch (error) {
      console.error('Error al enviar ticket de venta a cola:', error);
      // No bloquear el flujo si falla el envío a cola
    }
  }

  // FLUJO 2: Auto-impresión Bluetooth
  if (autoprint && !isPrintingRef.current) {
    await handleBluetoothPrinting(saleId, saleData, isPrintingRef, showWarning);
  }
}

/**
 * Maneja la impresión automática vía Bluetooth
 * @param {string} saleId - ID de la venta
 * @param {Object} saleData - Datos de la venta
 * @param {Object} isPrintingRef - Ref para prevenir duplicados
 * @param {Function} showWarning - Callback para advertencias
 */
async function handleBluetoothPrinting(saleId, saleData, isPrintingRef, showWarning) {
  isPrintingRef.current = true;

  try {
    const printResult = await printTicket(saleData, 'sale', {
      method: 'bluetooth',
      allowFallback: false
    });

    if (printResult.success) {
      console.log('✅ Ticket de venta auto-impreso:', printResult.deviceName);

      // Registrar en historial de impresiones
      await recordPrintSuccess(saleId, printResult);
    } else if (!printResult.cancelled) {
      showWarning('⚠️ No se pudo imprimir el ticket automáticamente. Puedes imprimirlo desde el historial.');
      console.warn('Auto-impresión falló:', printResult.error);
    }
  } catch (error) {
    showWarning('⚠️ Error al imprimir ticket. Puedes imprimirlo desde el historial.');
    console.warn('Error en auto-impresión:', error.message);
  } finally {
    isPrintingRef.current = false;
  }
}

/**
 * Registra una impresión exitosa en el historial
 * @param {string} saleId - ID de la venta
 * @param {Object} printResult - Resultado de la impresión
 */
async function recordPrintSuccess(saleId, printResult) {
  try {
    const printData = {
      type: 'sale',
      printedAt: new Date().toISOString(),
      printedBy: 'auto',
      deviceInfo: printResult.method === 'bluetooth'
        ? `Bluetooth (${printResult.deviceName || 'Impresora'})`
        : 'Desktop'
    };
    await addSalePrintRecord(saleId, printData);
  } catch (recordError) {
    console.warn('⚠️ Error al registrar impresión:', recordError.message);
  }
}
