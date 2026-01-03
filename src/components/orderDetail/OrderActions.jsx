import { hasPrintRecord } from '../../services/firebaseService';
import { Icon } from '../../icons';

/**
 * Componente para botones de acción de la orden (imprimir, factura, WhatsApp)
 */
export function OrderActions({
  order,
  isPrinting,
  isGeneratingInvoice,
  localInvoice,
  onPrint,
  onGenerateInvoice,
  onViewSavedInvoice,
  onDownloadInvoice,
  isReadOnly
}) {
  if (isReadOnly) {
    return null;
  }

  return (
    <div className="order-actions-footer">
      <div className="action-buttons-grid">
        {/* Botón imprimir recibo */}
        <button
          className="action-btn btn-print"
          onClick={() => onPrint('receipt')}
          disabled={isPrinting}
        >
          <span className="action-icon"><Icon name="print" size={20} /></span>
          <span className="action-text">
            Imprimir Recibo
            {hasPrintRecord(order, 'receipt') && (
              <span style={{ marginLeft: '5px', color: '#4caf50', fontWeight: 'bold' }}><Icon name="checkmark" size={16} /></span>
            )}
          </span>
        </button>

        {/* Botón imprimir comprobante - solo si orden completada */}
        {(order.orderStatus === 'completados' || order.orderStatus === 'enEntrega') && (
          <button
            className="action-btn btn-print"
            onClick={() => onPrint('delivery')}
            disabled={isPrinting}
          >
            <span className="action-icon"><Icon name="print" size={20} /></span>
            <span className="action-text">
              Imprimir Entrega
              {hasPrintRecord(order, 'delivery') && (
                <span style={{ marginLeft: '5px', color: '#4caf50', fontWeight: 'bold' }}><Icon name="checkmark" size={16} /></span>
              )}
            </span>
          </button>
        )}

        {/* Botón generar factura - solo si no existe */}
        {!localInvoice && (
          <button
            className="action-btn btn-invoice"
            onClick={onGenerateInvoice}
            disabled={isGeneratingInvoice}
          >
            <span className="action-icon"><Icon name="file" size={20} /></span>
            <span className="action-text">
              {isGeneratingInvoice ? 'Generando...' : 'Generar Factura'}
            </span>
          </button>
        )}

        {/* Botón ver factura - solo si existe */}
        {localInvoice && (
          <button
            className="action-btn btn-invoice"
            onClick={onViewSavedInvoice}
          >
            <span className="action-icon"><Icon name="file" size={20} /></span>
            <span className="action-text">Ver Factura</span>
          </button>
        )}

        {/* Botón descargar factura - solo si existe */}
        {localInvoice && (
          <button
            className="action-btn btn-download"
            onClick={onDownloadInvoice}
          >
            <span className="action-icon"><Icon name="download" size={20} /></span>
            <span className="action-text">Descargar Factura</span>
          </button>
        )}
      </div>
    </div>
  );
}
