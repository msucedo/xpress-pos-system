import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== PRINT TRACKING ====================

/**
 * Agregar registro de impresión al historial de la orden
 * @param {string} orderId - ID de la orden
 * @param {Object} printData - Datos de la impresión
 * @returns {Promise<Object>} Resultado de la operación
 */
export const addPrintRecord = async (orderId, printData) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      printHistory: arrayUnion(printData)
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding print record:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verificar si ya existe un registro de impresión de cierto tipo
 * @param {Object} order - Objeto de orden
 * @param {string} type - Tipo de ticket ('receipt' o 'delivery')
 * @returns {boolean}
 */
export const hasPrintRecord = (order, type) => {
  if (!order.printHistory || order.printHistory.length === 0) {
    return false;
  }
  return order.printHistory.some(record => record.type === type);
};

/**
 * Obtener todos los registros de un tipo específico
 * @param {Object} order - Objeto de orden
 * @param {string} type - Tipo de ticket ('receipt' o 'delivery')
 * @returns {Array}
 */
export const getPrintRecords = (order, type) => {
  if (!order.printHistory) return [];
  return order.printHistory.filter(record => record.type === type);
};
