import ImageUpload from '../ImageUpload';
import { Icon } from '../../icons';

/**
 * Sección de carga de fotos de la orden
 * Extraído de OrderForm.jsx para reutilización
 */
export function PhotoUploadSection({ images, onChange }) {
  return (
    <div className="left-flip-back">
      <div className="form-section-header">
        <h3 className="step-title-large"><Icon name="camera" size={20} /> Fotos de la Orden</h3>
      </div>

      <div className="photo-upload-section">
        <ImageUpload
          images={images}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
