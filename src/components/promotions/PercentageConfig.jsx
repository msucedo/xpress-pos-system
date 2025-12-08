import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { ItemsSelector } from './ItemsSelector';

/**
 * Configuración específica para promociones de tipo 'percentage'
 * Maneja porcentaje de descuento y aplica a qué items
 */
export function PercentageConfig({ formData, errors, onChange, onItemToggle, allItems }) {
  return (
    <>
      <div className="form-group">
        <ValidatedNumberInput
          name="discountValue"
          value={formData.discountValue}
          onChange={onChange}
          label="Porcentaje de Descuento"
          placeholder="20"
          min={1}
          max={100}
          integer={false}
          suffix="%"
          required={true}
          error={errors.discountValue}
        />
      </div>

      <div className="form-group">
        <label>Aplica a:</label>
        <select
          name="appliesTo"
          value={formData.appliesTo}
          onChange={onChange}
          className="applies-to-select"
        >
          <option value="all">Todos los items</option>
          <option value="services">Solo servicios</option>
          <option value="products">Solo productos</option>
          <option value="specific">Items específicos</option>
        </select>
      </div>

      {formData.appliesTo === 'specific' && (
        <ItemsSelector
          items={allItems}
          selectedIds={formData.specificItems}
          onToggle={(itemId) => onItemToggle(itemId, 'specificItems')}
          error={errors.specificItems}
          label="Selecciona Items *"
        />
      )}
    </>
  );
}

PercentageConfig.propTypes = {
  formData: PropTypes.shape({
    discountValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    appliesTo: PropTypes.string,
    specificItems: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onItemToggle: PropTypes.func.isRequired,
  allItems: PropTypes.array.isRequired
};
