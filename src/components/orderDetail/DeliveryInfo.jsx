import { useRef } from 'react';
import { Icon } from '../../icons';
import { formatDeliveryDateDisplay } from '../../utils/orders/orderHelpers';
import { OrderStatusSelector } from './OrderStatusSelector';

/**
 * Componente para información de entrega (fecha y estado de orden)
 */
export function DeliveryInfo({
  localDeliveryDate,
  orderStatus,
  allItemsCompletedOrCancelled,
  onDeliveryDateChange,
  onOrderStatusChange,
  isReadOnly
}) {
  const dateInputRef = useRef(null);

  return (
    <div className="detail-card">
      <h3 className="detail-card-title"><Icon name="calendar" size={20} /> Información de Entrega</h3>
      <div className="detail-card-content">
        <div className="detail-row">
          <span className="detail-label">Fecha de Entrega:</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
            <span className="detail-value">{formatDeliveryDateDisplay(localDeliveryDate)}</span>
            {!isReadOnly && (
              <div style={{ position: 'relative' }}>
                <button
                  className="btn-edit-date"
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid var(--color-gray-700)',
                    borderRadius: '4px',
                    color: 'var(--color-gray-500)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Icon name="calendar" size={16} />
                </button>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={localDeliveryDate}
                  onChange={(e) => {
                    if (e.target.value) {
                      onDeliveryDateChange(e.target.value);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <OrderStatusSelector
          orderStatus={orderStatus}
          allItemsCompletedOrCancelled={allItemsCompletedOrCancelled}
          onChange={onOrderStatusChange}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  );
}
