import { useState, useEffect } from 'react';
import {
  addServiceToCart as addServiceHelper,
  addProductToCart as addProductHelper,
  removeFromCart as removeFromCartHelper
} from '../utils/cart/cartHelpers';

/**
 * Hook para manejar el estado y operaciones del carrito
 *
 * @param {Object} initialData - Datos iniciales (para cargar servicios existentes en edición)
 * @returns {Object} - { cart, setCart, handleAddToCart, handleRemoveFromCart }
 */
export function useCartManagement(initialData = null) {
  const [cart, setCart] = useState([]);

  // Cargar servicios al carrito si existen (modo edición)
  useEffect(() => {
    if (initialData && initialData.services && initialData.services.length > 0) {
      setCart(initialData.services);
    }
  }, [initialData]);

  // Agregar servicio o producto al carrito
  const handleAddToCart = (item, type = 'service') => {
    if (type === 'service') {
      setCart(prev => addServiceHelper(prev, item));
    } else if (type === 'product') {
      const result = addProductHelper(cart, item);
      if (result.error) {
        alert(result.error);
      } else {
        setCart(result.cart);
      }
    }
  };

  // Eliminar o decrementar item del carrito
  const handleRemoveFromCart = (itemId) => {
    setCart(prev => removeFromCartHelper(prev, itemId));
  };

  return {
    cart,
    setCart,
    handleAddToCart,
    handleRemoveFromCart
  };
}
