import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { ItemsSelector } from './ItemsSelector';

/**
 * Configuración específica para promociones de tipo 'specificPrice'
 * Maneja precio específico para productos seleccionados
 */
export function SpecificPriceConfig({ formData, errors, onChange, onItemToggle, allItems }) {
  // Filtrar solo productos para specificPrice
  const products = allItems.filter(item => item.type === 'product');

  return (
    <>
      <div className="form-group">
        <ValidatedNumberInput
          name="specificPrice"
          value={formData.specificPrice}
          onChange={onChange}
          label="Precio Específico"
          placeholder="50.00"
          min={0}
          max={999999}
          integer={false}
          prefix="$"
          required={true}
          error={errors.specificPrice}
        />
        <span className="field-hint">Este será el precio final del producto durante la promoción</span>
      </div>

      <ItemsSelector
        items={products}
        selectedIds={formData.applicableItems}
        onToggle={(itemId) => onItemToggle(itemId, 'applicableItems')}
        error={errors.applicableItems}
        label="Productos Aplicables *"
        helpText="Selecciona los productos que tendrán este precio específico"
      />
    </>
  );
}

SpecificPriceConfig.propTypes = {
  formData: PropTypes.shape({
    specificPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    applicableItems: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onItemToggle: PropTypes.func.isRequired,
  allItems: PropTypes.array.isRequired
};
