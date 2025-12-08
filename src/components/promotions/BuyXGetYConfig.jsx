import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { ItemsSelector } from './ItemsSelector';

/**
 * Configuración específica para promociones de tipo 'buyXgetY'
 * Maneja cantidad comprada y cantidad gratis (2x1, 3x2, etc)
 */
export function BuyXGetYConfig({ formData, errors, onChange, onItemToggle, allItems }) {
  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <ValidatedNumberInput
            name="buyQuantity"
            value={formData.buyQuantity}
            onChange={onChange}
            label="Total de Items"
            placeholder="2"
            min={2}
            max={100}
            integer={true}
            required={true}
            error={errors.buyQuantity}
          />
        </div>

        <div className="form-group">
          <ValidatedNumberInput
            name="getQuantity"
            value={formData.getQuantity}
            onChange={onChange}
            label="Cantidad Gratis"
            placeholder="1"
            min={1}
            max={100}
            integer={true}
            required={true}
            error={errors.getQuantity}
          />
        </div>
      </div>

      <div className="help-text" style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        fontSize: '13px',
        color: '#1e3a8a'
      }}>
        <strong>💡 Ejemplos:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
          <li><strong>2x1</strong> (lleva 2, paga 1): Total=<strong>2</strong>, Gratis=<strong>1</strong></li>
          <li><strong>3x2</strong> (lleva 3, paga 2): Total=<strong>3</strong>, Gratis=<strong>1</strong></li>
          <li><strong>4x3</strong> (lleva 4, paga 3): Total=<strong>4</strong>, Gratis=<strong>1</strong></li>
        </ul>
      </div>

      <ItemsSelector
        items={allItems}
        selectedIds={formData.applicableItems}
        onToggle={(itemId) => onItemToggle(itemId, 'applicableItems')}
        error={errors.applicableItems}
        label="Items Aplicables (opcional)"
        helpText="Si no seleccionas ninguno, la promoción aplicará a todos los items"
      />
    </>
  );
}

BuyXGetYConfig.propTypes = {
  formData: PropTypes.shape({
    buyQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    getQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    applicableItems: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onItemToggle: PropTypes.func.isRequired,
  allItems: PropTypes.array.isRequired
};
