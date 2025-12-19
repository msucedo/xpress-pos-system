import { Icon } from '../../icons';
import { getOrderStatusOptions } from '../../utils/orders/statusHelpers';
import OrderStatusDropdown from './OrderStatusDropdown';

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
        <OrderStatusDropdown
          value={orderStatus}
          onChange={(e) => onChange(e.target.value)}
          options={orderStatuses}
          disabled={isReadOnly}
        />
      </div>
      {!allItemsCompletedOrCancelled && (
        <div className="detail-row" style={{ marginTop: '8px' }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '12px',
            color: '#f59e0b',
            fontStyle: 'italic'
          }}>
            <Icon name="warning" size={16} /> Para mover a "En Entrega", todos los servicios deben estar completados o cancelados
          </span>
        </div>
      )}
    </>
  );
}
