import PropTypes from 'prop-types';
import PromotionBadge from '../PromotionBadge';
import { Icon } from '../../icons';

/**
 * Lista de items del carrito en formato tabla compacta
 * Incluye controles de cantidad y badge de promoción por item
 */
export function CartItemsList({
  cartItems,
  itemPromotionMap,
  onIncrement,
  onDecrement,
  onRemove
}) {
  return (
    <div className="cart-items-compact">
      {cartItems.map((item) => {
        // Obtener la promoción asignada a este item
        const assignedPromo = itemPromotionMap ? itemPromotionMap.get(item.id) : null;

        return (
          <div key={item.id} className="cart-item-row-wrapper">
            <div className="cart-item-row">
              <span className="item-emoji"><Icon name={item.emoji} size={18} /></span>
              <span className="item-name">{item.name}</span>
              <span className="item-price">${item.salePrice.toFixed(2)}</span>
              <div className="item-qty-controls">
                <button
                  className="qty-btn-compact"
                  onClick={() => onDecrement(item.id)}
                >
                  −
                </button>
                <span className="qty-num">{item.quantity}</span>
                <button
                  className="qty-btn-compact"
                  onClick={() => onIncrement(item.id)}
                >
                  +
                </button>
              </div>
              <span className="item-subtotal">
                ${(item.salePrice * item.quantity).toFixed(2)}
              </span>
              <button
                className="item-remove-btn"
                onClick={() => onRemove(item.id)}
                title="Eliminar"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            {/* Mostrar badge de promoción si aplica */}
            {assignedPromo && (
              <div className="cart-item-promotion">
                <PromotionBadge
                  promotion={assignedPromo}
                  discountAmount={assignedPromo.discountAmount}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

CartItemsList.propTypes = {
  cartItems: PropTypes.array.isRequired,
  itemPromotionMap: PropTypes.instanceOf(Map),
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};
