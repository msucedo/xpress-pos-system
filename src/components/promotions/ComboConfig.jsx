import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { ComboItemQuantities } from './ComboItemQuantities';

/**
 * Configuración específica para promociones de tipo 'combo'
 * Maneja precio del combo y selección de items con cantidades
 */
export function ComboConfig({ formData, errors, onChange, onComboItemToggle, onComboItemQuantityChange, allItems }) {
  return (
    <>
      <div className="form-group">
        <ValidatedNumberInput
          name="comboPrice"
          value={formData.comboPrice}
          onChange={onChange}
          label="Precio del Combo"
          placeholder="150"
          min={0}
          max={999999}
          integer={false}
          prefix="$"
          required={true}
          error={errors.comboPrice}
        />
      </div>

      <div className="form-group">
        <label>Items del Combo (mínimo 2) *</label>
        <div className="items-selector">
          {allItems.map(item => (
            <label key={item.id} className="item-checkbox">
              <input
                type="checkbox"
                checked={formData.comboItems.some(ci => ci.id === item.id)}
                onChange={() => onComboItemToggle(item)}
              />
              <span>{item.name} (${item.price})</span>
            </label>
          ))}
        </div>

        <ComboItemQuantities
          comboItems={formData.comboItems}
          onQuantityChange={onComboItemQuantityChange}
        />

        {errors.comboItems && <span className="error-message">{errors.comboItems}</span>}
      </div>
    </>
  );
}

ComboConfig.propTypes = {
  formData: PropTypes.shape({
    comboPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    comboItems: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number
    }))
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onComboItemToggle: PropTypes.func.isRequired,
  onComboItemQuantityChange: PropTypes.func.isRequired,
  allItems: PropTypes.array.isRequired
};
