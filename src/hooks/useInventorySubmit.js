import { prepareProductData } from '../utils/inventory/inventoryDataBuilder';

/**
 * Hook personalizado para manejar el submit del formulario de inventario
 * @param {Function} onSubmit - Callback para enviar los datos
 * @param {Object|null} initialData - Datos iniciales (null para nuevo producto)
 */
export function useInventorySubmit(onSubmit, initialData = null) {
  /**
   * Procesa y envía los datos del formulario
   * Convierte strings a números usando la utilidad prepareProductData
   */
  const handleSubmit = async (formData) => {
    try {
      // Preparar datos: convertir strings a números
      const submitData = prepareProductData(formData);

      // Enviar al callback del componente padre
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting product:', error);
      // El error ya se maneja en el componente padre
      throw error;
    }
  };

  return { handleSubmit };
}
