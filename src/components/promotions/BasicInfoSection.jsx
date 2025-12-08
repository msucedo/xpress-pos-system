import PropTypes from 'prop-types';
import { ValidatedAlphanumericInput } from '../inputs';

/**
 * Sección de información básica del formulario de promoción
 * Maneja: emoji, nombre, descripción y estado activo
 */
export function BasicInfoSection({ formData, errors, onChange }) {
  return (
    <div className="form-section">
      <h3>Información Básica</h3>

      <div className="form-row">
        <div className="form-group emoji-picker">
          <label>Emoji</label>
          <input
            type="text"
            name="emoji"
            value={formData.emoji}
            onChange={onChange}
            maxLength={2}
            placeholder="🎉"
          />
        </div>

        <div className="form-group flex-grow">
          <ValidatedAlphanumericInput
            name="name"
            value={formData.name}
            onChange={onChange}
            label="Nombre de la Promoción"
            placeholder="Ej: Promoción 2x1 Verano"
            required={true}
            error={errors.name}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Descripción *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Describe los detalles de la promoción"
          rows={3}
          className={errors.description ? 'error' : ''}
        />
        {errors.description && <span className="error-message">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={onChange}
          />
          <span>Promoción activa</span>
        </label>
      </div>
    </div>
  );
}

BasicInfoSection.propTypes = {
  formData: PropTypes.shape({
    emoji: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
