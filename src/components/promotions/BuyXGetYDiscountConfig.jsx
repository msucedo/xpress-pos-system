import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { ItemsSelector } from './ItemsSelector';

/**
 * Configuración específica para promociones de tipo 'buyXgetYdiscount'
 * Maneja cantidad comprada y descuento en el último item (2do a 50% OFF)
 */
export function BuyXGetYDiscountConfig({ formData, errors, onChange, onItemToggle, allItems }) {
  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <ValidatedNumberInput
            name="buyQuantity"
            value={formData.buyQuantity}
            onChange={onChange}
            label="Cantidad de Items"
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
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={onChange}
            label="% de Descuento"
            placeholder="50"
            min={1}
            max={100}
            integer={false}
            suffix="%"
            required={true}
            error={errors.discountPercentage}
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
          <li><strong>2do a 50% OFF</strong>: Cantidad=<strong>2</strong>, Descuento=<strong>50</strong>%</li>
          <li><strong>3ro a 30% OFF</strong>: Cantidad=<strong>3</strong>, Descuento=<strong>30</strong>%</li>
          <li><strong>4to a 25% OFF</strong>: Cantidad=<strong>4</strong>, Descuento=<strong>25</strong>%</li>
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

BuyXGetYDiscountConfig.propTypes = {
  formData: PropTypes.shape({
    buyQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    discountPercentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    applicableItems: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onItemToggle: PropTypes.func.isRequired,
  allItems: PropTypes.array.isRequired
};
