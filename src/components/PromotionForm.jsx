import { useAdminCheck } from '../contexts/AuthContext';
import { usePromotionForm } from '../hooks/usePromotionForm';
import { usePromotionItems } from '../hooks/usePromotionItems';
import { usePromotionValidation } from '../hooks/usePromotionValidation';
import { usePromotionSubmit } from '../hooks/usePromotionSubmit';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { BasicInfoSection } from './promotions/BasicInfoSection';
import { PromotionTypeSelector } from './promotions/PromotionTypeSelector';
import { TypeConfigSection } from './promotions/TypeConfigSection';
import { RestrictionsSection } from './promotions/RestrictionsSection';
import './PromotionForm.css';

/**
 * Formulario de creación/edición de promociones
 * Arquitectura modular: 15 componentes UI + 5 hooks + 4 utilidades
 *
 * COMPONENTES UI:
 * - BasicInfoSection: emoji, nombre, descripción, activo
 * - PromotionTypeSelector: selector de 7 tipos de promoción
 * - TypeConfigSection: orquestador de configuración por tipo
 * - RestrictionsSection: restricciones opcionales
 * - 7 componentes de tipo específico (PercentageConfig, FixedConfig, etc)
 * - 4 componentes reutilizables (ItemsSelector, DaysSelector, HelpText, ComboItemQuantities)
 *
 * HOOKS:
 * - usePromotionForm: estado del formulario y handlers
 * - usePromotionItems: combina servicios y productos
 * - usePromotionValidation: validación de formulario
 * - usePromotionSubmit: procesamiento de submit
 * - useAutoScroll: auto-scroll en submit
 *
 * UTILIDADES:
 * - promotionTypes: constantes y configuraciones
 * - promotionValidations: funciones de validación
 * - promotionDataBuilder: construcción de datos con deleteField()
 * - promotionInitialState: estado inicial y carga de datos
 */
const PromotionForm = ({
  onSubmit,
  onCancel,
  onDelete,
  initialData = null,
  services = [],
  products = [],
  isSubmitting = false
}) => {
  // Auth
  const isAdmin = useAdminCheck();

  // Hooks de gestión del formulario
  const {
    formData,
    errors,
    setErrors,
    handleChange,
    handleDayToggle,
    handleItemToggle,
    handleComboItemToggle,
    handleComboItemQuantityChange
  } = usePromotionForm(initialData);

  const { allItems } = usePromotionItems(services, products);
  const { validate } = usePromotionValidation();
  const { handleSubmit: processSubmit } = usePromotionSubmit(onSubmit, initialData);

  // Auto-scroll al top cuando se está enviando
  useAutoScroll(isSubmitting);

  /**
   * Maneja el submit del formulario
   * 1. Previene default
   * 2. Valida el formulario
   * 3. Si es válido, procesa y envía los datos
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validate(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    processSubmit(formData);
  };

  return (
    <form
      className={`promotion-form ${isSubmitting ? 'submitting' : ''}`}
      onSubmit={handleFormSubmit}
    >
      <div className="promotion-form-wrapper">
        <div className="form-content">
          {/* Información Básica */}
          <BasicInfoSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
          />

          {/* Selector de Tipo de Promoción */}
          <PromotionTypeSelector
            selectedType={formData.type}
            onChange={handleChange}
          />

          {/* Configuración Específica por Tipo */}
          <TypeConfigSection
            type={formData.type}
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onItemToggle={handleItemToggle}
            onComboItemToggle={handleComboItemToggle}
            onComboItemQuantityChange={handleComboItemQuantityChange}
            onDayToggle={handleDayToggle}
            allItems={allItems}
          />

          {/* Restricciones */}
          <RestrictionsSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onDayToggle={handleDayToggle}
          />
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>

          {initialData && isAdmin && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                if (window.confirm(`¿Eliminar la promoción "${formData.name}"?`)) {
                  onDelete(initialData.id);
                }
              }}
              disabled={isSubmitting}
            >
              Eliminar
            </button>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting
              ? '⏳ Guardando...'
              : `${initialData ? 'Actualizar' : 'Crear'} Promoción`
            }
          </button>
        </div>

        {/* Success Animation Overlay */}
        {isSubmitting && (
          <div className="success-overlay">
            <div className="success-animation">
              <div className="success-checkmark">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <h2 className="success-title">
                {initialData ? '¡Promoción Actualizada!' : '¡Promoción Creada!'}
              </h2>
              <p className="success-message">Procesando...</p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default PromotionForm;
