import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';

/**
 * Sección de gestión de stock
 * Maneja stock actual y stock mínimo
 */
export function StockSection({ formData, errors, onChange }) {
  return (
    <>
      {/* Stock Actual */}
      <ValidatedNumberInput
        name="stock"
        value={formData.stock}
        onChange={onChange}
        label="Stock Actual"
        placeholder="0"
        required={true}
        error={errors.stock}
        min={0}
        integer={true}
        suffix="pzas"
      />

      {/* Stock Mínimo */}
      <ValidatedNumberInput
        name="minStock"
        value={formData.minStock}
        onChange={onChange}
        label="Stock Mínimo"
        placeholder="0"
        required={true}
        error={errors.minStock}
        min={0}
        integer={true}
        suffix="pzas"
      />
    </>
  );
}

StockSection.propTypes = {
  formData: PropTypes.shape({
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    minStock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
