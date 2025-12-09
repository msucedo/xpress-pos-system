import PropTypes from 'prop-types';

/**
 * Sección de descuento manual del carrito
 * Incluye input validado, selector de tipo ($ / %) y badge de descuento aplicado
 */
export function CartDiscountSection({
  discountInput,
  discountTypeInput,
  discount,
  discountType,
  appliedPromotions,
  showDiscountFeedback,
  onDiscountChange,
  onDiscountKeyPress,
  onDiscountTypeChange,
  onApplyDiscount
}) {
  const hasPromotions = appliedPromotions && appliedPromotions.length > 0;

  return (
    <div className="cart-discount-compact">
      <div className="validated-input-wrapper">
        <input
          type="text"
          inputMode={discountTypeInput === 'percentage' ? 'numeric' : 'decimal'}
          className={`discount-input-compact ${showDiscountFeedback ? 'shake' : ''}`}
          placeholder={hasPromotions ? 'Promociones aplicadas' : 'Descuento'}
          value={discountInput}
          onChange={onDiscountChange}
          onKeyPress={onDiscountKeyPress}
          disabled={hasPromotions}
        />
        {showDiscountFeedback && (
          <div className="input-feedback">
            {discountTypeInput === 'percentage' ? 'Solo números enteros' : 'Solo números'}
          </div>
        )}
      </div>
      <select
        className="discount-type-compact"
        value={discountTypeInput}
        onChange={onDiscountTypeChange}
        disabled={hasPromotions}
      >
        <option value="amount">$</option>
        <option value="percentage">%</option>
      </select>
      <button
        className="discount-btn-compact"
        onClick={onApplyDiscount}
        disabled={!discountInput || hasPromotions}
      >
        Aplicar
      </button>
      {discount > 0 && !hasPromotions && (
        <span className="discount-badge">
          -{discountType === 'percentage' ? `${discount}%` : `$${discount.toFixed(2)}`}
        </span>
      )}
    </div>
  );
}

CartDiscountSection.propTypes = {
  discountInput: PropTypes.string.isRequired,
  discountTypeInput: PropTypes.string.isRequired,
  discount: PropTypes.number.isRequired,
  discountType: PropTypes.string.isRequired,
  appliedPromotions: PropTypes.array,
  showDiscountFeedback: PropTypes.bool.isRequired,
  onDiscountChange: PropTypes.func.isRequired,
  onDiscountKeyPress: PropTypes.func.isRequired,
  onDiscountTypeChange: PropTypes.func.isRequired,
  onApplyDiscount: PropTypes.func.isRequired
};
