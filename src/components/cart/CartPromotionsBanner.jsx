import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../icons';
import { transitions } from '../../animations/transitions';

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
      <motion.div
        className="banner-title"
        onClick={() => setIsCollapsed(!isCollapsed)}
        whileTap={{
          scale: 0.98,
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}
        transition={{ duration: 0.1, ease: [0.32, 0.72, 0, 1] }}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'space-between',
          borderRadius: '4px',
          padding: '4px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="discount" size={20} />
          Promociones Disponibles Hoy
        </div>
        <Icon name={isCollapsed ? 'down' : 'up'} size={16} />
      </motion.div>
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
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0, y: -10 }}
            animate={{ maxHeight: 500, opacity: 1, y: 0 }}
            exit={{ maxHeight: 0, opacity: 0, y: -10 }}
            transition={transitions.slow}
            style={{ overflow: 'hidden' }}
          >
            {availablePromotions.map((promo, idx) => {
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
          </motion.div>
        )}
      </AnimatePresence>
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
