import ImageUpload from '../ImageUpload';
import { Icon } from '../../icons';

/**
 * Componente para galería de imágenes de la orden
 */
export function OrderImages({ images, onChange, isReadOnly }) {
  return (
    <div className="order-gallery-section">
      <h3 className="section-title"><Icon name="camera" size={20} /> Galería de Imágenes de la Orden</h3>
      <ImageUpload
        images={images}
        onChange={isReadOnly ? undefined : onChange}
        readOnly={isReadOnly}
      />
    </div>
  );
}
