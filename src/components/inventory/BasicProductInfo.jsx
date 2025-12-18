import PropTypes from 'prop-types';
import { ValidatedAlphanumericInput } from '../inputs';
import { IconPickerButton } from '../iconPicker';
import { PRODUCT_CATEGORIES } from '../../utils/inventory/inventoryConstants';

/**
 * Sección de información básica del producto
 * Maneja nombre, categoría y emoji
 */
export function BasicProductInfo({ formData, errors, onChange }) {
  // Handler para el cambio de icono
  const handleIconChange = (iconName) => {
    onChange({
      target: {
        name: 'emoji',
        value: iconName
      }
    });
  };

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

      {/* Icono del Producto */}
      <IconPickerButton
        label="Icono del Producto (opcional)"
        value={formData.emoji}
        onChange={handleIconChange}
        category="products"
        placeholder="Seleccionar icono"
      />
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
