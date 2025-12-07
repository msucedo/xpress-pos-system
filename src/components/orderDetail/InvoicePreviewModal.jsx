/**
 * Modal para previsualizar factura en PDF
 */
export function InvoicePreviewModal({ isOpen, invoiceData, onClose }) {
  if (!isOpen || !invoiceData) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content invoice-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Vista Previa de Factura</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <iframe
            src={invoiceData.pdfData}
            title="Vista Previa de Factura"
            style={{
              width: '100%',
              height: '70vh',
              border: 'none',
              borderRadius: '8px'
            }}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
