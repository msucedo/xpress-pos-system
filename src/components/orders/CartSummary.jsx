import { CartItem } from './CartItem';
import { PromotionsBanner } from './PromotionsBanner';
import { EmployeeAssignment } from './EmployeeAssignment';
import { calculateTotalItems } from '../../utils/promotions/promotionCalculations';

/**
 * Resumen del carrito con items, promociones y asignación de empleado
 * Extraído de OrderForm.jsx para reutilización
 */
export function CartSummary({
  cart,
  onRemoveFromCart,
  appliedPromotions,
  promotionValidations,
  activePromotions,
  itemPromotionMap,
  subtotal,
  totalDiscount,
  totalPrice,
  employees,
  selectedEmployee,
  onSelectEmployee,
  allOrders,
  onCancel,
  onShowPayment
}) {
  const totalItems = calculateTotalItems(cart);

  return (
    <div className="cart-flip-front">
      <div className="cart-header">
        <h3>🛒 Carrito</h3>
        <span className="cart-count">{totalItems} items</span>
      </div>

      {/* Banner de promociones disponibles */}
      <PromotionsBanner
        activePromotions={activePromotions}
        appliedPromotions={appliedPromotions}
        promotionValidations={promotionValidations}
        cart={cart}
      />

      {/* Lista de items del carrito */}
      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-icon">🛒</span>
            <p>No hay items agregados</p>
            <p className="empty-hint">Presiona los iconos de servicios o productos para agregarlos</p>
          </div>
        ) : (
          cart.map((item) => {
            const assignedPromo = itemPromotionMap.get(item.id);
            return (
              <CartItem
                key={item.id}
                item={item}
                assignedPromo={assignedPromo}
                onRemove={onRemoveFromCart}
              />
            );
          })
        )}
      </div>

      {/* Resumen de precios */}
      <div className="cart-summary">
        {appliedPromotions.length > 0 ? (
          <>
            <div className="cart-subtotal">
              <span className="subtotal-label">Subtotal:</span>
              <span className="subtotal-value">${subtotal}</span>
            </div>
            <div className="cart-discounts">
              <span className="discount-label">Descuentos:</span>
              <span className="discount-value">-${totalDiscount.toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span className="total-label">Total:</span>
              <span className="total-value">${totalPrice.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="cart-total">
            <span className="total-label">Total:</span>
            <span className="total-value">${totalPrice}</span>
          </div>
        )}
      </div>

      {/* Sección de asignación de empleado */}
      <EmployeeAssignment
        employees={employees}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={onSelectEmployee}
        allOrders={allOrders}
      />

      {/* Acciones del carrito */}
      <div className="cart-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="button" className="btn-primary" onClick={onShowPayment}>
          💳 Cobrar
        </button>
      </div>
    </div>
  );
}
