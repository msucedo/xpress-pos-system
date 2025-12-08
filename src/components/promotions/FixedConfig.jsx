import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { ItemsSelector } from './ItemsSelector';
import { HelpText } from './HelpText';

/**
 * Configuración específica para promociones de tipo 'fixed'
 * Maneja descuento fijo en pesos con items aplicables opcionales
 */
export function FixedConfig({ formData, errors, onChange, onItemToggle, allItems }) {
  return (
    <>
      <div className="form-group">
        <ValidatedNumberInput
          name="discountValue"
          value={formData.discountValue}
          onChange={onChange}
          label="Monto de Descuento"
          placeholder="100"
          min={0}
          max={999999}
          integer={false}
          prefix="$"
          required={true}
          error={errors.discountValue}
        />
      </div>

      <ItemsSelector
        items={allItems}
        selectedIds={formData.applicableItems}
        onToggle={(itemId) => onItemToggle(itemId, 'applicableItems')}
        error={errors.applicableItems}
        label="Items Aplicables (opcional)"
        helpText="Si no seleccionas ninguno, el descuento aplicará a todo el carrito"
      />
    </>
  );
}

FixedConfig.propTypes = {
  formData: PropTypes.shape({
    discountValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    applicableItems: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onItemToggle: PropTypes.func.isRequired,
  allItems: PropTypes.array.isRequired
};
