import { getOrderStatusOptions } from '../../utils/orders/statusHelpers';

/**
 * Componente para selector de estado de orden con validaciones
 */
export function OrderStatusSelector({
  orderStatus,
  allItemsCompletedOrCancelled,
  onChange,
  isReadOnly
}) {
  const orderStatuses = getOrderStatusOptions();

  return (
    <>
      <div className="detail-row">
        <span className="detail-label">Estado de la Orden:</span>
        <select
          className={`order-status-select status-${orderStatus}`}
          value={orderStatus}
          onChange={(e) => onChange(e.target.value)}
          disabled={isReadOnly}
          style={{
            opacity: isReadOnly ? 0.6 : 1,
            cursor: isReadOnly ? 'not-allowed' : 'pointer'
          }}
        >
          {orderStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
      {!allItemsCompletedOrCancelled && (
        <div className="detail-row" style={{ marginTop: '8px' }}>
          <span style={{
            fontSize: '12px',
            color: '#f59e0b',
            fontStyle: 'italic'
          }}>
            ⚠️ Para mover a "En Entrega", todos los servicios deben estar completados o cancelados
          </span>
        </div>
      )}
    </>
  );
}
