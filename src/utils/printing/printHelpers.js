/**
 * Funciones de utilidad para el manejo de impresión
 */

import { getPrinterMethodPreference, PRINTER_METHODS } from '../printerConfig';

/**
 * Determina si se debe usar cola de impresión según preferencia del usuario
 *
 * @returns {boolean} True si se debe usar cola de impresión
 */
export function shouldUseQueuePrinting() {
  const userPreference = getPrinterMethodPreference();
  return userPreference === PRINTER_METHODS.QUEUE || userPreference === 'queue';
}

/**
 * Obtiene opciones de impresión según estado de impresora
 *
 * @param {Object} printerStatus - Estado de la impresora (isConnected, deviceName)
 * @returns {Object} Opciones de impresión
 */
export function getPrintOptions(printerStatus) {
  const options = {};

  // Si hay impresora Bluetooth conectada, usarla directamente
  if (printerStatus && printerStatus.isConnected) {
    console.log('✅ Impresora Bluetooth conectada, usando método bluetooth');
    options.method = 'bluetooth';
  } else {
    console.log('ℹ️ Sin impresora Bluetooth conectada, usando detección automática');
  }

  return options;
}

/**
 * Obtiene información del dispositivo para registro de impresión
 *
 * @param {Object} printResult - Resultado de la impresión
 * @param {Object} printerStatus - Estado de la impresora
 * @returns {string} Información del dispositivo
 */
export function getPrintDeviceInfo(printResult, printerStatus) {
  if (printResult.method === 'bluetooth') {
    return `Bluetooth (${printerStatus?.deviceName || 'Impresora'})`;
  } else if (printResult.method === 'desktop') {
    return 'Desktop';
  } else {
    return 'Mobile';
  }
}

/**
 * Crea objeto de datos de impresión para guardar en Firebase
 *
 * @param {string} type - Tipo de impresión (receipt, delivery)
 * @param {Object} printResult - Resultado de la impresión
 * @param {Object} printerStatus - Estado de la impresora
 * @returns {Object} Datos de impresión para Firebase
 */
export function createPrintRecord(type, printResult, printerStatus) {
  return {
    type,
    printedAt: new Date().toISOString(),
    printedBy: 'manual',
    deviceInfo: getPrintDeviceInfo(printResult, printerStatus)
  };
}

/**
 * Obtiene el mensaje de éxito según el tipo de impresión
 *
 * @param {string} type - Tipo de impresión (receipt, delivery)
 * @returns {string} Mensaje de éxito
 */
export function getPrintSuccessMessage(type) {
  return type === 'receipt'
    ? 'Ticket de recepción impreso'
    : 'Ticket de entrega impreso';
}

/**
 * Obtiene el mensaje de error según el resultado
 *
 * @param {Object} printResult - Resultado de la impresión
 * @returns {string} Mensaje de error
 */
export function getPrintErrorMessage(printResult) {
  if (printResult.cancelled) {
    return 'Impresión cancelada';
  } else if (printResult.needsConnection) {
    return 'Por favor, conecta una impresora Bluetooth desde Configuración';
  } else {
    return printResult.error || 'Error al imprimir';
  }
}
