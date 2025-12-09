import PropTypes from 'prop-types';
import ImageUpload from '../ImageUpload';

/**
 * Sección de descripción e imágenes del producto
 * Maneja textarea para descripción y componente ImageUpload
 */
export function ProductDescription({ formData, onChange, onImagesChange }) {
  return (
    <>
      {/* Descripción */}
      <div className="form-group full-width">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Descripción del producto..."
          rows="3"
        />
      </div>

      {/* Imágenes */}
      <div className="form-group full-width">
        <label>Imágenes del Producto</label>
        <ImageUpload
          images={formData.images}
          onChange={onImagesChange}
        />
      </div>
    </>
  );
}

ProductDescription.propTypes = {
  formData: PropTypes.shape({
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onImagesChange: PropTypes.func.isRequired
};
