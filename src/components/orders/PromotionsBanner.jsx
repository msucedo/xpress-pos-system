import { Icon } from '../../icons';
import { isPromotionRelevantForCart } from '../../utils/promotions/promotionHelpers';

/**
 * Banner de promociones disponibles
 * Extraído de OrderForm.jsx para reutilización
 */
export function PromotionsBanner({
  activePromotions,
  appliedPromotions,
  promotionValidations,
  cart
}) {
  if (activePromotions.length === 0) return null;

  // Filtrar promociones por día de la semana
  const availablePromotions = activePromotions.filter(promo => {
    if (!promo.daysOfWeek || promo.daysOfWeek.length === 0) {
      return true; // Sin restricción de días, mostrar siempre
    }
    const currentDay = new Date().getDay();
    return promo.daysOfWeek.includes(currentDay);
  });

  if (availablePromotions.length === 0) return null;

  return (
    <div className="available-promotions-banner">
      <div className="banner-title">🎉 Promociones Disponibles Hoy:</div>
      {availablePromotions.map((promo, idx) => {
        const isApplied = appliedPromotions.some(ap => ap.id === promo.id);
        const validation = promotionValidations[promo.id];
        const isRelevant = isPromotionRelevantForCart(promo, cart);
        const notAppliedReason = !isApplied && validation && !validation.isValid && isRelevant
          ? validation.reason
          : null;

        return (
          <div key={idx} className={`promo-item ${isApplied ? 'applied' : ''}`}>
            <span className="promo-emoji"><Icon name={promo.emoji || 'celebration'} size={18} /></span>
            <span className="promo-name">{promo.name}</span>
            {isApplied && <span className="applied-badge">✓ APLICADA</span>}
            {notAppliedReason && <span className="not-applied-reason">{notAppliedReason}</span>}
          </div>
        );
      })}
    </div>
  );
}
