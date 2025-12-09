import { useState, useEffect } from 'react';
import { DEFAULT_PRODUCT_STATE } from '../utils/inventory/inventoryConstants';
import { loadInitialProductData } from '../utils/inventory/inventoryDataBuilder';

/**
 * Hook personalizado para manejar el estado del formulario de inventario
 * @param {Object|null} initialData - Datos iniciales del producto (null para nuevo producto)
 * @returns {Object} Estado y handlers del formulario
 */
export function useInventoryForm(initialData = null) {
  const [formData, setFormData] = useState(DEFAULT_PRODUCT_STATE);
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales cuando initialData cambia
  useEffect(() => {
    const loadedData = loadInitialProductData(initialData, DEFAULT_PRODUCT_STATE);
    setFormData(loadedData);
  }, [initialData]);

  /**
   * Maneja cambios en los campos del formulario
   * Limpia el error del campo cuando el usuario empieza a escribir
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Maneja cambios en el array de imágenes
   */
  const handleImagesChange = (newImages) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  /**
   * Actualiza el campo de código de barras
   * Útil para el botón "Generar EAN-13"
   */
  const handleBarcodeGenerated = (barcode) => {
    setFormData(prev => ({
      ...prev,
      barcode
    }));
  };

  return {
    formData,
    errors,
    setErrors,
    handleChange,
    handleImagesChange,
    handleBarcodeGenerated
  };
}
