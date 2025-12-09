import { checkBarcodeExists } from '../services/firebaseService';
import {
  validateName,
  validateCategory,
  validateBarcode,
  validatePurchasePrice,
  validateSalePrice,
  validatePriceRelation,
  validateStock,
  validateMinStock
} from '../utils/inventory/inventoryValidations';

/**
 * Hook personalizado para validación de formulario de inventario
 * Combina validaciones síncronas (utils) con validaciones asíncronas (Firebase)
 */
export function useInventoryValidation() {
  /**
   * Valida el formulario completo
   * @param {Object} formData - Datos del formulario a validar
   * @param {string|null} excludeId - ID del producto actual (para edición, null para creación)
   * @returns {Promise<Object>} Objeto con errores encontrados
   */
  const validate = async (formData, excludeId = null) => {
    const newErrors = {};

    // Validaciones síncronas usando funciones puras
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const categoryError = validateCategory(formData.category);
    if (categoryError) newErrors.category = categoryError;

    const purchasePriceError = validatePurchasePrice(formData.purchasePrice);
    if (purchasePriceError) newErrors.purchasePrice = purchasePriceError;

    const salePriceError = validateSalePrice(formData.salePrice);
    if (salePriceError) newErrors.salePrice = salePriceError;

    // Validar relación entre precios solo si ambos son válidos
    if (!purchasePriceError && !salePriceError) {
      const priceRelationError = validatePriceRelation(formData.purchasePrice, formData.salePrice);
      if (priceRelationError) newErrors.salePrice = priceRelationError;
    }

    const stockError = validateStock(formData.stock);
    if (stockError) newErrors.stock = stockError;

    const minStockError = validateMinStock(formData.minStock);
    if (minStockError) newErrors.minStock = minStockError;

    const barcodeError = validateBarcode(formData.barcode);
    if (barcodeError) {
      newErrors.barcode = barcodeError;
    } else {
      // Validación asíncrona: verificar que el código de barras sea único
      try {
        const barcodeExists = await checkBarcodeExists(formData.barcode, excludeId);
        if (barcodeExists) {
          newErrors.barcode = 'Este código de barras ya está registrado en otro producto';
        }
      } catch (error) {
        console.error('Error validando código de barras:', error);
        newErrors.barcode = 'Error al validar el código de barras';
      }
    }

    return newErrors;
  };

  return { validate };
}
