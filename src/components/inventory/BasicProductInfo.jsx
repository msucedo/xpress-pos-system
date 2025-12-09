import PropTypes from 'prop-types';
import { ValidatedAlphanumericInput } from '../inputs';
import { PRODUCT_CATEGORIES } from '../../utils/inventory/inventoryConstants';

/**
 * Sección de información básica del producto
 * Maneja nombre, categoría y emoji
 */
export function BasicProductInfo({ formData, errors, onChange }) {
  return (
    <>
      {/* Nombre */}
      <ValidatedAlphanumericInput
        name="name"
        value={formData.name}
        onChange={onChange}
        label="Nombre del Producto"
        placeholder="Ej: Nike Air Max 90"
        required={true}
        error={errors.name}
        className="full-width"
      />

      {/* Categoría */}
      <div className="form-group">
        <label htmlFor="category">Categoría *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={onChange}
          className={`category-select ${errors.category ? 'error' : ''}`}
        >
          {PRODUCT_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      {/* Emoji */}
      <div className="form-group">
        <label htmlFor="emoji">Emoji del Producto</label>
        <input
          type="text"
          id="emoji"
          name="emoji"
          value={formData.emoji}
          onChange={onChange}
          placeholder="📦"
          maxLength="2"
        />
        <span className="emoji-preview">{formData.emoji || '📦'}</span>
      </div>
    </>
  );
}

BasicProductInfo.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    emoji: PropTypes.string
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
