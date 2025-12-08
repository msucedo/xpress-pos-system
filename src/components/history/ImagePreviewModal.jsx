/**
 * Modal para preview de imagen en OrderHistory
 * Usa un approach simple con click outside para cerrar
 */
export function ImagePreviewModal({ image, onClose }) {
  if (!image) return null;

  return (
    <div className="oh-preview-modal" onClick={onClose}>
      <div className="oh-preview-content" onClick={(e) => e.stopPropagation()}>
        <button className="oh-preview-close" onClick={onClose}>✕</button>
        <img src={image} alt="Preview" className="oh-preview-image" />
      </div>
    </div>
  );
}
