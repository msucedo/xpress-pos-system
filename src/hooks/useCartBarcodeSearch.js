import { useInputValidation } from './useInputValidation';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook para búsqueda de productos por código de barras en el carrito
 * Usa validación de input y agrega productos automáticamente al presionar Enter
 *
 * @param {Array} products - Lista de productos disponibles
 * @param {Function} addProductWithValidation - Función para agregar productos al carrito
 * @returns {Object} Estado y handlers de búsqueda por barcode
 */
export function useCartBarcodeSearch(products, addProductWithValidation) {
  const { showError } = useNotification();

  // Input validado para código de barras (alfanumérico)
  const {
    value: barcodeSearch,
    setValue: setBarcodeSearch,
    onChange: handleBarcodeChange,
    onKeyPress: handleBarcodeKeyPress,
    showFeedback: showBarcodeFeedback
  } = useInputValidation('', 'ALPHANUMERIC');

  /**
   * Busca y agrega producto por código de barras al presionar Enter
   * @param {KeyboardEvent} e - Evento de teclado
   */
  const handleBarcodeSearch = (e) => {
    if (e.key === 'Enter' && barcodeSearch.trim()) {
      // Buscar producto por código de barras
      const productByBarcode = products.find(
        p => p.barcode && p.barcode.toLowerCase() === barcodeSearch.trim().toLowerCase()
      );

      if (productByBarcode) {
        // Agregar al carrito
        const success = addProductWithValidation(productByBarcode, 1);
        if (success) {
          setBarcodeSearch(''); // Limpiar el campo de búsqueda
        }
      } else {
        showError('No se encontró ningún producto con ese código');
      }
    }
  };

  return {
    barcodeSearch,
    setBarcodeSearch,
    handleBarcodeChange,
    handleBarcodeKeyPress,
    handleBarcodeSearch,
    showBarcodeFeedback
  };
}
