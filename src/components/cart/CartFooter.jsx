import PropTypes from 'prop-types';

/**
 * Footer del carrito con resumen de totales y botones de acción
 * Muestra subtotal, descuentos y total con botones para vaciar o proceder al pago
 */
export function CartFooter({
  subtotal,
  discountAmount,
  total,
  appliedPromotions,
  isProcessing,
  onClearCart,
  onCheckout
}) {
  const hasPromotions = appliedPromotions && appliedPromotions.length > 0;

  return (
    <div className="cart-footer">
      <div className="cart-summary">
        {hasPromotions ? (
          <>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row discount-row">
              <span>Descuentos:</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-row discount-row">
                <span>Descuento:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total-row">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      <div className="cart-actions">
        <button
          className="btn-clear-cart"
          onClick={onClearCart}
          disabled={isProcessing}
        >
          Vaciar Carrito
        </button>
        <button
          className="btn-checkout"
          onClick={onCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? 'Procesando...' : 'Proceder al Pago'}
        </button>
      </div>
    </div>
  );
}

CartFooter.propTypes = {
  subtotal: PropTypes.number.isRequired,
  discountAmount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  appliedPromotions: PropTypes.array,
  isProcessing: PropTypes.bool.isRequired,
  onClearCart: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired
};
