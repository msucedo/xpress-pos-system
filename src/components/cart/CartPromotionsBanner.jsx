import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../icons';

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
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  // Contar cuántas promociones están aplicadas
  const appliedPromotionsCount = appliedPromotions.length;

  return (
    <div className="available-promotions-banner">
      <div
        className="banner-title"
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="discount" size={20} />
          Promociones Disponibles Hoy
        </div>
        <Icon name={isCollapsed ? 'down' : 'up'} size={16} />
      </div>
      {appliedPromotionsCount > 0 && (
        <div style={{
          padding: '8px 12px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#00ff88',
          background: 'rgba(0, 255, 136, 0.1)',
          borderRadius: '4px',
          marginTop: '8px'
        }}>
          Promociones aplicadas: {appliedPromotionsCount}
        </div>
      )}
      {!isCollapsed && availablePromotions.map((promo, idx) => {
        const isApplied = appliedPromotions.some(ap => ap.id === promo.id);
        const validation = promotionValidations[promo.id];
        const isRelevant = isPromotionRelevantForCart(promo, cartItems);
        const notAppliedReason = !isApplied && validation && !validation.isValid && isRelevant
          ? validation.reason
          : null;

        return (
          <div key={idx} className={`promo-item ${isApplied ? 'applied' : ''}`}>
            <span className="promo-emoji"><Icon name={promo.emoji || 'discount'} size={18} /></span>
            <span className="promo-name">{promo.name}</span>
            {isApplied && <span className="applied-badge">APLICADA</span>}
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
