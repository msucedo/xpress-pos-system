import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';

/**
 * Sección de precios y ganancia
 * Muestra precio de compra, precio de venta y ganancia calculada
 */
export function PricingSection({ formData, errors, onChange, profit, percentage }) {
  const showProfit = formData.purchasePrice && formData.salePrice;

  return (
    <>
      {/* Precio de Compra */}
      <ValidatedNumberInput
        name="purchasePrice"
        value={formData.purchasePrice}
        onChange={onChange}
        label="Precio de Compra"
        placeholder="0.00"
        required={true}
        error={errors.purchasePrice}
        min={0}
        step={0.01}
        prefix="$"
      />

      {/* Precio de Venta */}
      <ValidatedNumberInput
        name="salePrice"
        value={formData.salePrice}
        onChange={onChange}
        label="Precio de Venta"
        placeholder="0.00"
        required={true}
        error={errors.salePrice}
        min={0}
        step={0.01}
        prefix="$"
      />

      {/* Ganancia Calculada */}
      {showProfit && (
        <div className="form-group profit-display">
          <label>Ganancia</label>
          <div className={`profit-value ${profit >= 0 ? 'positive' : 'negative'}`}>
            ${profit.toFixed(2)} ({percentage}%)
          </div>
        </div>
      )}
    </>
  );
}

PricingSection.propTypes = {
  formData: PropTypes.shape({
    purchasePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  profit: PropTypes.number.isRequired,
  percentage: PropTypes.string.isRequired
};
