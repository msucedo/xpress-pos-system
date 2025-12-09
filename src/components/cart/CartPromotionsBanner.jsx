import PropTypes from 'prop-types';

/**
 * Banner de promociones disponibles en el carrito
 * Muestra promociones filtradas por día de semana con estados applied/not applied
 */
export function CartPromotionsBanner({
  activePromotions,
  appliedPromotions,
  promotionValidations,
  isPromotionRelevantForCart,
  cartItems
}) {
  if (!activePromotions || activePromotions.length === 0) {
    return null;
  }

  // Filtrar promociones por día de la semana
  const currentDay = new Date().getDay();
  const availablePromotions = activePromotions.filter(promo => {
    if (!promo.daysOfWeek || promo.daysOfWeek.length === 0) {
      return true; // Sin restricción de días
    }
    return promo.daysOfWeek.includes(currentDay);
  });

  if (availablePromotions.length === 0) {
    return null;
  }

  return (
    <div className="available-promotions-banner">
      <div className="banner-title">🎉 Promociones Disponibles Hoy:</div>
      {availablePromotions.map((promo, idx) => {
        const isApplied = appliedPromotions.some(ap => ap.id === promo.id);
        const validation = promotionValidations[promo.id];
        const isRelevant = isPromotionRelevantForCart(promo, cartItems);
        const notAppliedReason = !isApplied && validation && !validation.isValid && isRelevant
          ? validation.reason
          : null;

        return (
          <div key={idx} className={`promo-item ${isApplied ? 'applied' : ''}`}>
            <span className="promo-emoji">{promo.emoji || '🎉'}</span>
            <span className="promo-name">{promo.name}</span>
            {isApplied && <span className="applied-badge">✓ APLICADA</span>}
            {notAppliedReason && <span className="not-applied-reason">{notAppliedReason}</span>}
          </div>
        );
      })}
    </div>
  );
}

CartPromotionsBanner.propTypes = {
  activePromotions: PropTypes.array,
  appliedPromotions: PropTypes.array.isRequired,
  promotionValidations: PropTypes.object.isRequired,
  isPromotionRelevantForCart: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired
};
