import { getDeliverButtonText, getDeliverButtonSubtitle } from '../../utils/payments/paymentHelpers';

/**
 * Componente para botón grande de "Cobrar y Entregar" o "Entregar Orden"
 * Solo visible cuando la orden está en estado "enEntrega"
 */
export function DeliverButton({
  showDeliverButton,
  isReadOnly,
  isFullyPaid,
  remainingPayment,
  onEntregar
}) {
  if (!showDeliverButton || isReadOnly) {
    return null;
  }

  const buttonText = getDeliverButtonText(isFullyPaid);
  const subtitle = getDeliverButtonSubtitle(isFullyPaid, remainingPayment);

  return (
    <div className="order-close-section">
      <button
        className={`btn-close-order ${!isFullyPaid ? 'btn-cobrar-large' : 'btn-entregar-large'}`}
        onClick={onEntregar}
      >
        <span className="btn-close-icon">{!isFullyPaid ? '💰' : '📦'}</span>
        <div className="btn-close-content">
          <span className="btn-close-title">{buttonText}</span>
          <span className="btn-close-subtitle">{subtitle}</span>
        </div>
      </button>
    </div>
  );
}
