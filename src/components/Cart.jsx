import { useCart } from '../hooks/useCart';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../contexts/AuthContext';
import { useCartPaymentFlow } from '../hooks/useCartPaymentFlow';
import { useSaleProcessing } from '../hooks/useSaleProcessing';
import { useCartBarcodeSearch } from '../hooks/useCartBarcodeSearch';
import { useCartDiscount } from '../hooks/useCartDiscount';
import { useCartKeyboard } from '../hooks/useCartKeyboard';
import CartPayment from './CartPayment';
import { CartHeader } from './cart/CartHeader';
import { CartSearchBar } from './cart/CartSearchBar';
import { CartPromotionsBanner } from './cart/CartPromotionsBanner';
import { CartItemsList } from './cart/CartItemsList';
import { CartDiscountSection } from './cart/CartDiscountSection';
import { CartNotesSection } from './cart/CartNotesSection';
import { CartFooter } from './cart/CartFooter';
import './Cart.css';

/**
 * Componente principal del carrito de compras
 * Arquitectura modular: 7 componentes UI + 5 hooks + 3 utilidades
 *
 * COMPONENTES UI:
 * - CartHeader: Título y botón cerrar
 * - CartSearchBar: Búsqueda por código de barras
 * - CartPromotionsBanner: Banner de promociones disponibles
 * - CartItemsList: Lista de productos con cantidades
 * - CartDiscountSection: Descuento manual
 * - CartNotesSection: Notas de la venta
 * - CartFooter: Totales y botones de acción
 *
 * HOOKS:
 * - useCartPaymentFlow: Transiciones carrito ↔ pago
 * - useSaleProcessing: Procesamiento de venta completo (venta + promociones + impresión)
 * - useCartBarcodeSearch: Búsqueda y agregado por barcode
 * - useCartDiscount: Descuentos manuales
 * - useCartKeyboard: ESC y auto-focus
 *
 * UTILIDADES:
 * - saleDataBuilder: Preparación de datos de venta
 * - printingHelpers: Manejo de impresión (cola + Bluetooth)
 * - errorHandlers: Parseo de errores user-friendly
 */
const Cart = () => {
  // Contexts
  const { user, employee } = useAuth();
  const { data: products = [] } = useInventory();

  // Hook principal del carrito (ya existente, parcialmente refactorizado)
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    notes,
    setNotes,
    discount,
    discountType,
    discountAmount,
    subtotal,
    total,
    itemCount,
    removeProduct,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    selectedClient,
    addProductWithValidation,
    canCheckout,
    applyDiscount,
    // Estados de promociones
    activePromotions,
    appliedPromotions,
    promotionValidations,
    isPromotionRelevantForCart,
    itemPromotionMap
  } = useCart();

  // Hooks personalizados de Cart
  const {
    showPayment,
    setShowPayment,
    paymentAnimating,
    setPaymentAnimating,
    handleProceedToPayment,
    handlePaymentCancel
  } = useCartPaymentFlow(canCheckout);

  const { handlePaymentConfirm, isProcessing } = useSaleProcessing({
    cartItems,
    subtotal,
    discount,
    discountType,
    discountAmount,
    total,
    selectedClient,
    notes,
    employee,
    user,
    appliedPromotions,
    clearCart,
    setShowPayment,
    setPaymentAnimating,
    setIsCartOpen
  });

  const {
    barcodeSearch,
    handleBarcodeChange,
    handleBarcodeKeyPress,
    handleBarcodeSearch,
    showBarcodeFeedback
  } = useCartBarcodeSearch(products, addProductWithValidation);

  const {
    discountInput,
    setDiscountInput,
    discountTypeInput,
    setDiscountTypeInput,
    handleDiscountChange,
    handleDiscountKeyPress,
    handleApplyDiscount,
    showDiscountFeedback
  } = useCartDiscount(subtotal, applyDiscount, appliedPromotions);

  const { cartSearchInputRef } = useCartKeyboard(
    isCartOpen,
    showPayment,
    setIsCartOpen,
    cartItems
  );

  // Handlers simples
  const handleClose = () => setIsCartOpen(false);
  const handleClearCart = () => clearCart();

  return (
    <>
      {/* Overlay oscuro */}
      {isCartOpen && <div className="cart-overlay" onClick={handleClose}></div>}

      {/* Drawer del carrito */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''} ${paymentAnimating ? 'payment-active' : ''}`}>
        {/* Header */}
        <CartHeader itemCount={itemCount} onClose={handleClose} />

        {/* Search bar para escanear productos */}
        <CartSearchBar
          ref={cartSearchInputRef}
          value={barcodeSearch}
          onChange={handleBarcodeChange}
          onKeyPress={(e) => {
            handleBarcodeKeyPress(e);
            handleBarcodeSearch(e);
          }}
          showFeedback={showBarcodeFeedback}
        />

        {/* Banner de promociones disponibles */}
        <CartPromotionsBanner
          activePromotions={activePromotions}
          appliedPromotions={appliedPromotions}
          promotionValidations={promotionValidations}
          isPromotionRelevantForCart={isPromotionRelevantForCart}
          cartItems={cartItems}
        />

        {/* Contenido del carrito */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>El carrito está vacío</p>
              <p className="cart-empty-hint">Escanea un código de barras para agregar productos</p>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <CartItemsList
                cartItems={cartItems}
                itemPromotionMap={itemPromotionMap}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                onRemove={removeProduct}
              />

              {/* Sección de descuento */}
              <CartDiscountSection
                discountInput={discountInput}
                discountTypeInput={discountTypeInput}
                discount={discount}
                discountType={discountType}
                appliedPromotions={appliedPromotions}
                showDiscountFeedback={showDiscountFeedback}
                onDiscountChange={handleDiscountChange}
                onDiscountKeyPress={handleDiscountKeyPress}
                onDiscountTypeChange={(e) => {
                  setDiscountTypeInput(e.target.value);
                  setDiscountInput('');
                }}
                onApplyDiscount={handleApplyDiscount}
              />

              {/* Sección de notas */}
              <CartNotesSection
                notes={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Footer con totales y botones */}
        {cartItems.length > 0 && (
          <CartFooter
            subtotal={subtotal}
            discountAmount={discountAmount}
            total={total}
            appliedPromotions={appliedPromotions}
            isProcessing={isProcessing}
            onClearCart={handleClearCart}
            onCheckout={handleProceedToPayment}
          />
        )}
      </div>

      {/* Cart Payment Screen */}
      <CartPayment
        className={paymentAnimating ? 'visible' : ''}
        isVisible={paymentAnimating}
        cartItems={cartItems}
        subtotal={subtotal}
        discountAmount={discountAmount}
        total={total}
        onConfirm={handlePaymentConfirm}
        onCancel={handlePaymentCancel}
      />
    </>
  );
};

export default Cart;
