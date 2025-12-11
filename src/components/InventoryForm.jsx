import { useState } from 'react';
import { useAdminCheck } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useInventoryForm } from '../hooks/useInventoryForm';
import { useInventoryValidation } from '../hooks/useInventoryValidation';
import { useInventorySubmit } from '../hooks/useInventorySubmit';
import { calculateProfit } from '../utils/inventory/inventoryCalculations';
import { BasicProductInfo } from './inventory/BasicProductInfo';
import { BarcodeSection } from './inventory/BarcodeSection';
import { PricingSection } from './inventory/PricingSection';
import { StockSection } from './inventory/StockSection';
import { ProductDescription } from './inventory/ProductDescription';
import './InventoryForm.css';

/**
 * Formulario de creación/edición de productos
 * Arquitectura modular: 5 componentes UI + 3 hooks + 4 utilidades
 *
 * COMPONENTES UI:
 * - BasicProductInfo: nombre, categoría, emoji
 * - BarcodeSection: código de barras + generador EAN-13
 * - PricingSection: precios y ganancia calculada
 * - StockSection: stock actual y mínimo
 * - ProductDescription: descripción e imágenes
 *
 * HOOKS:
 * - useInventoryForm: estado del formulario y handlers
 * - useInventoryValidation: validación síncrona y asíncrona
 * - useInventorySubmit: procesamiento de submit
 *
 * UTILIDADES:
 * - inventoryConstants: categorías y estados por defecto
 * - inventoryCalculations: calculateProfit, generateEAN13
 * - inventoryValidations: funciones de validación puras
 * - inventoryDataBuilder: preparación de datos para envío
 */
const InventoryForm = ({ onSubmit, onCancel, onDelete, initialData }) => {
  // Auth
  const isAdmin = useAdminCheck();
  const { showValidationErrors } = useNotification();

  // Hooks de gestión del formulario
  const {
    formData,
    errors,
    setErrors,
    handleChange,
    handleImagesChange,
    handleBarcodeGenerated
  } = useInventoryForm(initialData);

  const { validate } = useInventoryValidation();
  const { handleSubmit: processSubmit } = useInventorySubmit(onSubmit, initialData);

  // Estado UI local
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cálculos derivados (usa utilidad)
  const { profit, percentage } = calculateProfit(formData.purchasePrice, formData.salePrice);

  /**
   * Maneja el submit del formulario
   * 1. Previene submit duplicado
   * 2. Valida el formulario (sync + async)
   * 3. Si es válido, procesa y envía los datos
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prevenir múltiples clics
    if (isSubmitting) {
      return;
    }

    // Validar formulario (incluye validación async de barcode)
    const validationErrors = await validate(formData, initialData?.id);
    if (Object.keys(validationErrors).length > 0) {
      showValidationErrors(validationErrors);
      setErrors(validationErrors);
      return;
    }

    // Procesar y enviar
    setIsSubmitting(true);
    try {
      await processSubmit(formData);
    } catch (error) {
      console.error('Error submitting product:', error);
      // El error ya se maneja en el componente padre
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja la eliminación del producto
   */
  const handleDelete = () => {
    if (initialData && initialData.id) {
      onDelete(initialData.id);
    }
  };

  return (
    <form className="inventory-form" onSubmit={handleFormSubmit}>
      <div className="form-grid">
        {/* Información Básica */}
        <BasicProductInfo
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />

        {/* Código de Barras */}
        <BarcodeSection
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onBarcodeGenerated={handleBarcodeGenerated}
        />

        {/* Precios y Ganancia */}
        <PricingSection
          formData={formData}
          errors={errors}
          onChange={handleChange}
          profit={profit}
          percentage={percentage}
        />

        {/* Stock */}
        <StockSection
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />

        {/* Descripción e Imágenes */}
        <ProductDescription
          formData={formData}
          onChange={handleChange}
          onImagesChange={handleImagesChange}
        />
      </div>

      {/* Botones de Acción */}
      <div className="form-actions">
        <div className="form-actions-left">
          {initialData && isAdmin && (
            <button
              type="button"
              className="btn-delete"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Eliminar Producto
            </button>
          )}
        </div>
        <div className="form-actions-right">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting
              ? '⏳ Guardando...'
              : (initialData ? 'Guardar Cambios' : 'Agregar Producto')
            }
          </button>
        </div>
      </div>
    </form>
  );
};

export default InventoryForm;
