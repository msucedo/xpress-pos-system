import { useEffect, useRef } from 'react';

/**
 * Hook para manejar eventos de teclado del carrito
 * - ESC: Cierra el carrito
 * - Auto-focus: Enfoca search bar al abrir carrito con items
 *
 * @param {boolean} isCartOpen - Estado de apertura del carrito
 * @param {boolean} showPayment - Estado de pantalla de pago
 * @param {Function} setIsCartOpen - Función para abrir/cerrar carrito
 * @param {Array} cartItems - Items del carrito
 * @returns {Object} Ref para search bar y handler de ESC
 */
export function useCartKeyboard(isCartOpen, showPayment, setIsCartOpen, cartItems) {
  const cartSearchInputRef = useRef(null);

  /**
   * Maneja la presión de la tecla ESC
   * Solo cierra el carrito, mantiene los productos
   */
  const handleEscapePress = () => {
    setIsCartOpen(false);
  };

  // Listener de tecla ESC para cerrar el carrito
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
  }, [isCartOpen, showPayment, setIsCartOpen]);

  // Auto-focus en search bar después de agregar productos
  useEffect(() => {
    if (isCartOpen && cartItems.length > 0 && cartSearchInputRef.current) {
      // Pequeño delay para que la animación de apertura termine
      setTimeout(() => {
        cartSearchInputRef.current?.focus();
      }, 300);
    }
  }, [isCartOpen, cartItems.length]);

  return {
    cartSearchInputRef,
    handleEscapePress
  };
}
