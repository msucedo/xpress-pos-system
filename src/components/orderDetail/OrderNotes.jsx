import { Icon } from '../../icons';

/**
 * Componente para mostrar y editar notas generales de la orden
 */
export function OrderNotes({ generalNotes, onChange, isReadOnly }) {
  return (
    <div className="order-details-grid">
      <div className="detail-card">
        <h3 className="detail-card-title"><Icon name="notes" size={20} /> Notas Generales</h3>
        <div className="detail-card-content">
          <textarea
            className="form-input form-textarea"
            placeholder="Escribe notas generales de la orden..."
            rows="4"
            value={generalNotes}
            onChange={onChange}
            disabled={isReadOnly}
            style={{
              width: '100%',
              resize: 'vertical',
              fontFamily: 'inherit',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--color-gray-800)',
              borderRadius: '10px',
              color: 'var(--color-white)',
              fontSize: '15px',
              lineHeight: '1.6',
              opacity: isReadOnly ? 0.6 : 1,
              cursor: isReadOnly ? 'not-allowed' : 'text'
            }}
          />
        </div>
      </div>
    </div>
  );
}
