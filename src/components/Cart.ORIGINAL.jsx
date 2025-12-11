import { useState, useEffect, useRef } from 'react';
import { useCart } from '../hooks/useCart';
import { useInventory } from '../hooks/useInventory';
import { useInputValidation } from '../hooks/useInputValidation';
import CartPayment from './CartPayment';
import PromotionBadge from './PromotionBadge';
import { createSale, addSalePrintRecord } from '../services/salesService';
import { printTicket } from '../services/printService';
import { addPrintJob } from '../services/printQueueService';
import { getPrinterMethodPreference, PRINTER_METHODS } from '../utils/printerConfig';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
  const { showSuccess, showError, showWarning } = useNotification();
  const { user, employee } = useAuth();
  const { data: products = [] } = useInventory();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    notes,
    setNotes,
    discount,
    discountType,
    applyDiscount,
    removeProduct,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    subtotal,
    discountAmount,
    total,
    itemCount,
    canCheckout,
    selectedClient,
    setSelectedClient,
    addProductWithValidation,
    // Estados de promociones
    activePromotions,
    appliedPromotions,
    promotionValidations,
    isPromotionRelevantForCart,
    itemPromotionMap
  } = useCart();

  const [showPayment, setShowPayment] = useState(false);
  const [paymentAnimating, setPaymentAnimating] = useState(false);
  const [discountTypeInput, setDiscountTypeInput] = useState('amount');
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref para el search bar del carrito
  const cartSearchInputRef = useRef(null);

  // Ref para prevenir impresiones duplicadas
  const isPrintingRef = useRef(false);

  // Ref para guardar el timeout del payment cancel
  const paymentCancelTimeoutRef = useRef(null);

  // Input validado para descuento
  const {
    value: discountInput,
    setValue: setDiscountInput,
    onChange: handleDiscountChange,
    onKeyPress: handleDiscountKeyPress,
    showFeedback: showDiscountFeedback,
  } = useInputValidation('', discountTypeInput === 'percentage' ? 'INTEGER' : 'NUMBER');

  // Input validado para búsqueda por código de barras
  const {
    value: barcodeSearch,
    setValue: setBarcodeSearch,
    onChange: handleBarcodeChange,
    onKeyPress: handleBarcodeKeyPress,
    showFeedback: showBarcodeFeedback,
  } = useInputValidation('', 'ALPHANUMERIC');

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleApplyDiscount = () => {
    const value = parseFloat(discountInput) || 0;

    // Validar límites según tipo de descuento
    const maxDiscount = discountTypeInput === 'percentage' ? 100 : subtotal;

    if (value > maxDiscount) {
      showWarning(
        `Descuento máximo: ${discountTypeInput === 'percentage' ? '100%' : `$${subtotal.toFixed(2)}`}`
      );
      return;
    }

    if (value < 0) {
      showWarning('El descuento no puede ser negativo');
      return;
    }

    applyDiscount(value, discountTypeInput);
    showSuccess('Descuento aplicado');
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleProceedToPayment = () => {
    const validation = canCheckout();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    // Ocultar carrito y mostrar payment
    setShowPayment(true); // Cart se oculta con payment-active
    setPaymentAnimating(true); // Payment aparece con visible
  };

  const handlePaymentConfirm = async (paymentData) => {
    setIsProcessing(true);
    try {
      // Preparar datos de la venta
      const saleData = {
        items: cartItems,
        subtotal: subtotal,
        discount: discount,
        discountType: discountType,
        discountAmount: discountAmount,
        total: total,
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: paymentData.paymentStatus || 'paid',
        amountReceived: paymentData.amountReceived || total,
        change: paymentData.change || 0,
        clientId: selectedClient?.id || null,
        clientName: selectedClient?.name || null,
        notes: notes,
        createdAt: new Date().toISOString(),
        createdBy: employee?.name || user?.email || 'system',
        // Incluir promociones aplicadas (copiado de OrderForm)
        appliedPromotions: appliedPromotions && appliedPromotions.length > 0
          ? appliedPromotions.map(promo => ({
              id: promo.id,
              name: promo.name,
              type: promo.type,
              discountAmount: promo.discountAmount
            }))
          : []
      };

      // Crear la venta en Firebase (esto también actualiza el inventario)
      const saleId = await createSale(saleData);

      // Incrementar uso de promociones (copiado de OrderForm)
      if (appliedPromotions && appliedPromotions.length > 0) {
        const { incrementPromotionUsage } = await import('../services/firebaseService');
        for (const promo of appliedPromotions) {
          try {
            await incrementPromotionUsage(promo.id, selectedClient?.phone || '');
          } catch (error) {
            console.error('Error incrementing promotion usage:', error);
          }
        }
      }

      showSuccess(`Venta completada exitosamente. ID: ${saleId.substring(0, 8)}`);

      // ========== IMPRESIÓN ==========
      // Obtener preferencia del usuario
      const userPreference = getPrinterMethodPreference();
      const shouldUseQueue = userPreference === PRINTER_METHODS.QUEUE || userPreference === 'queue';
      const shouldAutoprint = userPreference === PRINTER_METHODS.BLUETOOTH || userPreference === 'bluetooth';

      // FLUJO 1: Si usuario eligió "Impresión Remota en Cola": enviar automáticamente
      if (shouldUseQueue) {
        try {
          await addPrintJob(saleId, saleId.substring(0, 8), 'sale');
          console.log('✅ Ticket de venta enviado a cola de impresión');
        } catch (error) {
          console.error('Error al enviar ticket de venta a cola:', error);
          // No bloquear el flujo si falla el envío a cola
        }
      }

      // FLUJO 2: Si método es Bluetooth: auto-imprimir (silencioso, reconexión automática)
      if (shouldAutoprint && !isPrintingRef.current) {
        isPrintingRef.current = true;
        try {
          const printResult = await printTicket(saleData, 'sale', {
            method: 'bluetooth',
            allowFallback: false
          });

          if (printResult.success) {
            console.log('✅ Ticket de venta auto-impreso:', printResult.deviceName);

            // Registrar en historial de impresiones
            try {
              const printData = {
                type: 'sale',
                printedAt: new Date().toISOString(),
                printedBy: 'auto',
                deviceInfo: printResult.method === 'bluetooth'
                  ? `Bluetooth (${printResult.deviceName || 'Impresora'})`
                  : 'Desktop'
              };
              await addSalePrintRecord(saleId, printData);
            } catch (recordError) {
              console.warn('⚠️ Error al registrar impresión:', recordError.message);
            }
          } else if (!printResult.cancelled) {
            showWarning('⚠️ No se pudo imprimir el ticket automáticamente. Puedes imprimirlo desde el historial.');
            console.warn('Auto-impresión falló:', printResult.error);
          }
        } catch (error) {
          showWarning('⚠️ Error al imprimir ticket. Puedes imprimirlo desde el historial.');
          console.warn('Error en auto-impresión:', error.message);
        } finally {
          isPrintingRef.current = false;
        }
      }

      // Limpiar el carrito y cerrar
      clearCart();
      setShowPayment(false);
      setPaymentAnimating(false);
      setIsCartOpen(false);
    } catch (error) {
      console.error('Error al procesar la venta:', error);

      // Parsear el mensaje de error para mostrar info más específica
      let errorMessage = 'Error al procesar la venta. Por favor intenta de nuevo.';

      if (error.message && error.message.includes('Stock insuficiente')) {
        // Extraer el nombre del producto del mensaje de error
        const match = error.message.match(/Stock insuficiente para (.+?)\./);
        if (match) {
          errorMessage = `⚠️ No hay suficiente stock de "${match[1]}". Por favor verifica el inventario.`;
        } else {
          errorMessage = '⚠️ Stock insuficiente para completar la venta. Verifica las cantidades.';
        }
      } else if (error.message && error.message.includes('no encontrado')) {
        errorMessage = '⚠️ Uno o más productos ya no están disponibles en el inventario.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);

      // Resetear estados de pago para que usuario pueda volver al carrito
      setShowPayment(false);
      setPaymentAnimating(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentCancel = () => {
    // Iniciar animación de salida del payment
    setPaymentAnimating(false);

    // Limpiar timeout previo si existe
    if (paymentCancelTimeoutRef.current) {
      clearTimeout(paymentCancelTimeoutRef.current);
    }

    // Esperar a que termine la animación del payment (1s) antes de mostrar el carrito
    paymentCancelTimeoutRef.current = setTimeout(() => {
      setShowPayment(false);
    }, 1000); // duración completa de la animación del CartPayment
  };

  // Cleanup del timeout cuando se desmonta el componente
  useEffect(() => {
    return () => {
      if (paymentCancelTimeoutRef.current) {
        clearTimeout(paymentCancelTimeoutRef.current);
      }
    };
  }, []);

  // Focus automático en search bar del carrito después de agregar productos
  useEffect(() => {
    if (isCartOpen && cartItems.length > 0 && cartSearchInputRef.current) {
      // Pequeño delay para que la animación de apertura termine
      setTimeout(() => {
        cartSearchInputRef.current?.focus();
      }, 300);
    }
  }, [isCartOpen, cartItems.length]);

  // Detectar tecla ESC para cerrar el carrito
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isCartOpen && !showPayment) {
        event.preventDefault();
        handleEscapePress();
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isCartOpen, cartItems.length, showPayment]);

  // Manejar presión de tecla ESC
  const handleEscapePress = () => {
    // Solo cerrar el carrito, mantener productos
    setIsCartOpen(false);
  };

  // Buscar y agregar producto por código de barras desde el carrito
  const handleBarcodeSearch = (e) => {
    if (e.key === 'Enter' && barcodeSearch.trim()) {
      // Buscar producto por código de barras
      const productByBarcode = products.find(
        p => p.barcode && p.barcode.toLowerCase() === barcodeSearch.trim().toLowerCase()
      );

      if (productByBarcode) {
        // Agregar al carrito
        const success = addProductWithValidation(productByBarcode, 1);
        if (success) {
          setBarcodeSearch(''); // Limpiar el campo de búsqueda
        }
      } else {
        showError('No se encontró ningún producto con ese código');
      }
    }
  };

  return (
    <>
      {/* Overlay oscuro */}
      {isCartOpen && <div className="cart-overlay" onClick={handleClose}></div>}

      {/* Drawer del carrito */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''} ${paymentAnimating ? 'payment-active' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-top">
            <h2 className="cart-title">
              Carrito {itemCount > 0 && `(${itemCount})`}
            </h2>
            <button className="cart-close-btn" onClick={handleClose}>
              ✕
            </button>
          </div>

          {/* Search bar para escanear productos - Con validación */}
          <div className="cart-search-bar">
            <div className="validated-input-wrapper">
              <input
                ref={cartSearchInputRef}
                type="text"
                className={`cart-search-input ${showBarcodeFeedback ? 'shake' : ''}`}
                placeholder="Escanear código de barras..."
                value={barcodeSearch}
                onChange={handleBarcodeChange}
                onKeyPress={(e) => {
                  handleBarcodeKeyPress(e);
                  handleBarcodeSearch(e);
                }}
              />
              {showBarcodeFeedback && (
                <div className="input-feedback">Carácter no permitido</div>
              )}
            </div>
          </div>
        </div>

        {/* Banner de promociones disponibles hoy (copiado de OrderForm) */}
        {activePromotions && activePromotions.length > 0 && (
          <div className="available-promotions-banner">
            <div className="banner-title">🎉 Promociones Disponibles Hoy:</div>
            {activePromotions
              .filter(promo => {
                // Filtrar promociones por día de la semana
                if (!promo.daysOfWeek || promo.daysOfWeek.length === 0) {
                  return true; // Sin restricción de días, mostrar siempre
                }
                const currentDay = new Date().getDay();
                return promo.daysOfWeek.includes(currentDay);
              })
              .map((promo, idx) => {
                const isApplied = appliedPromotions.some(ap => ap.id === promo.id);
                const validation = promotionValidations[promo.id];
                const isRelevant = isPromotionRelevantForCart(promo, cartItems);
                const notAppliedReason = !isApplied && validation && !validation.isValid && isRelevant ? validation.reason : null;

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
        )}

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
              {/* Lista de productos - Tabla Compacta */}
              <div className="cart-items-compact">
                {cartItems.map((item) => {
                  // Obtener la promoción asignada a este item (copiado de OrderForm)
                  const assignedPromo = itemPromotionMap ? itemPromotionMap.get(item.id) : null;

                  return (
                    <div key={item.id} className="cart-item-row-wrapper">
                      <div className="cart-item-row">
                        <span className="item-emoji">{item.emoji}</span>
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">${item.salePrice.toFixed(2)}</span>
                        <div className="item-qty-controls">
                          <button
                            className="qty-btn-compact"
                            onClick={() => decrementQuantity(item.id)}
                          >
                            −
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            className="qty-btn-compact"
                            onClick={() => incrementQuantity(item.id)}
                          >
                            +
                          </button>
                        </div>
                        <span className="item-subtotal">${(item.salePrice * item.quantity).toFixed(2)}</span>
                        <button
                          className="item-remove-btn"
                          onClick={() => removeProduct(item.id)}
                          title="Eliminar"
                        >
                          ✕
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

              {/* Sección de descuento - Compacta con validación */}
              <div className="cart-discount-compact">
                <div className="validated-input-wrapper">
                  <input
                    type="text"
                    inputMode={discountTypeInput === 'percentage' ? 'numeric' : 'decimal'}
                    className={`discount-input-compact ${showDiscountFeedback ? 'shake' : ''}`}
                    placeholder={appliedPromotions && appliedPromotions.length > 0 ? 'Promociones aplicadas' : 'Descuento'}
                    value={discountInput}
                    onChange={handleDiscountChange}
                    onKeyPress={handleDiscountKeyPress}
                    disabled={appliedPromotions && appliedPromotions.length > 0}
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
                  onChange={(e) => {
                    setDiscountTypeInput(e.target.value);
                    setDiscountInput(''); // Limpiar al cambiar tipo
                  }}
                  disabled={appliedPromotions && appliedPromotions.length > 0}
                >
                  <option value="amount">$</option>
                  <option value="percentage">%</option>
                </select>
                <button
                  className="discount-btn-compact"
                  onClick={handleApplyDiscount}
                  disabled={!discountInput || (appliedPromotions && appliedPromotions.length > 0)}
                >
                  Aplicar
                </button>
                {discount > 0 && (!appliedPromotions || appliedPromotions.length === 0) && (
                  <span className="discount-badge">
                    -{discountType === 'percentage' ? `${discount}%` : `$${discount.toFixed(2)}`}
                  </span>
                )}
              </div>

              {/* Sección de notas - Compacta */}
              <div className="cart-notes-compact">
                <textarea
                  className="cart-notes-input-compact"
                  placeholder="Notas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={1}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer con totales y botones */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              {appliedPromotions && appliedPromotions.length > 0 ? (
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
                onClick={handleClearCart}
                disabled={isProcessing}
              >
                Vaciar Carrito
              </button>
              <button
                className="btn-checkout"
                onClick={handleProceedToPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : 'Proceder al Pago'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cart Payment Screen - Slide desde la derecha */}
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
