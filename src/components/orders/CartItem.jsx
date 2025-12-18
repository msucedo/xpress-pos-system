import { Icon } from '../../icons';
import PromotionBadge from '../PromotionBadge';

/**
 * Componente de item individual del carrito
 * Extraído de OrderForm.jsx para reutilización
 */
export function CartItem({ item, assignedPromo, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-item-icon"><Icon name={item.icon} size={20} /></div>
      <div className="cart-item-info">
        <span className="cart-item-name">
          {item.type === 'service' ? item.serviceName : item.name}
          {item.quantity > 1 && (
            <span className="cart-item-quantity"> x{item.quantity}</span>
          )}
        </span>
        <span className="cart-item-price">
          ${item.price}
          {item.quantity > 1 && (
            <span className="cart-item-subtotal"> = ${item.price * item.quantity}</span>
          )}
        </span>
        {/* Show applied promotion for this item */}
        {assignedPromo && (
          <PromotionBadge
            promotion={assignedPromo}
            discountAmount={assignedPromo.discountAmount}
          />
        )}
      </div>
      <button
        type="button"
        className="cart-item-remove"
        onClick={() => onRemove(item.id)}
        title={item.quantity > 1 ? "Reducir cantidad" : "Eliminar"}
      >
        {item.quantity > 1 ? '−' : '✕'}
      </button>
    </div>
  );
}
