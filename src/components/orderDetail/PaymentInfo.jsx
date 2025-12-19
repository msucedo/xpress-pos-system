import { Icon } from '../../icons';
import { getPaymentMethodLabel } from '../../utils/payments/paymentHelpers';

/**
 * Componente para mostrar información de pago de la orden
 */
export function PaymentInfo({
  order,
  totalPrice,
  advancePayment,
  remainingPayment,
  paymentMethod,
  isFullyPaid,
  paymentStatus
}) {
  return (
    <div className="detail-card">
      <h3 className="detail-card-title"><Icon name="money" size={20} /> Información de Pago</h3>
      <div className="detail-card-content">
        {/* Si hay descuentos, mostrar subtotal */}
        {order.totalDiscount > 0 && (
          <div className="detail-row">
            <span className="detail-label">Subtotal:</span>
            <span className="detail-value">${order.subtotal}</span>
          </div>
        )}

        {/* Mostrar descuentos aplicados */}
        {order.totalDiscount > 0 && (
          <div className="detail-row">
            <span className="detail-label">
              Descuentos:
              {order.appliedPromotions?.map((promo, idx) => (
                <span key={idx} style={{display: 'block', fontSize: '12px', color: '#4ade80', fontWeight: '400', marginTop: '4px'}}>
                  {promo.emoji || '🎉'} {promo.name}
                </span>
              ))}
            </span>
            <span className="detail-value" style={{color: '#4ade80'}}>-${order.totalDiscount}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Precio Total:</span>
          <span className="detail-value price-large">${totalPrice}</span>
        </div>

        {advancePayment > 0 && (
          <>
            <div className="detail-row">
              <span className="detail-label">Anticipo:</span>
              <span className="detail-value">${advancePayment}</span>
            </div>
            <div className="detail-row highlight">
              <span className="detail-label">Restante por Cobrar:</span>
              <span className="detail-value price-highlight">${remainingPayment}</span>
            </div>
          </>
        )}

        <div className="detail-row">
          <span className="detail-label">Método de Pago:</span>
          <span className="detail-value">{getPaymentMethodLabel(paymentMethod)}</span>
        </div>

        {isFullyPaid && (
          <div className="detail-row payment-complete">
            <span className="detail-label">Estado de Pago:</span>
            <span className="detail-value payment-status-badge">✅ Pagado Completo</span>
          </div>
        )}

        {paymentStatus === 'cancelled' && (
          <div className="detail-row payment-cancelled">
            <span className="detail-label">Estado de Pago:</span>
            <span className="detail-value payment-status-badge cancelled">❌ Cancelado</span>
          </div>
        )}
      </div>
    </div>
  );
}
