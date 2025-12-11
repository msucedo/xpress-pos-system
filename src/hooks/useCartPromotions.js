import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Hook para manejar toda la lógica de promociones del carrito
 * Separa la lógica de negocio de promociones del CartContext
 *
 * @param {Array} cartItems - Items en el carrito
 * @param {Array} allPromotions - Todas las promociones disponibles
 * @param {Object} selectedClient - Cliente seleccionado (para validación)
 * @returns {Object} Estados, funciones y memoizados de promociones
 */
export const useCartPromotions = (cartItems, allPromotions, selectedClient) => {
  // Estados de promociones
  const [appliedPromotions, setAppliedPromotions] = useState([]);
  const [promotionValidations, setPromotionValidations] = useState({});

  // ========== FUNCIONES DE PROMOCIONES ==========

  // Determinar si una promoción es relevante para el carrito actual
  const isPromotionRelevantForCart = useCallback((promotion, cart) => {
    if (cart.length === 0) return false;

    switch (promotion.type) {
      case 'percentage':
        if (promotion.appliesTo === 'all') {
          return true; // Aplica a todo
        } else if (promotion.appliesTo === 'services') {
          return cart.some(item => item.type === 'service');
        } else if (promotion.appliesTo === 'products') {
          return cart.some(item => item.type === 'product');
        } else if (promotion.appliesTo === 'specific' && promotion.specificItems) {
          return cart.some(item => {
            // En carrito de inventario, los items son productos con productId = id
            const itemId = item.id;
            return promotion.specificItems.includes(itemId);
          });
        }
        return false;

      case 'fixed':
        // Si no hay items específicos, aplica a todo
        if (!promotion.applicableItems || promotion.applicableItems.length === 0) {
          return true;
        }
        // Si hay items específicos, verificar que estén en el carrito
        return cart.some(item => {
          const itemId = item.id;
          return promotion.applicableItems.includes(itemId);
        });

      case 'buyXgetY':
      case 'buyXgetYdiscount':
        // Si no hay items específicos, aplica a todo
        if (!promotion.applicableItems || promotion.applicableItems.length === 0) {
          return true;
        }
        // Si hay items específicos, verificar que estén en el carrito
        return cart.some(item => {
          const itemId = item.id;
          return promotion.applicableItems.includes(itemId);
        });

      case 'combo':
        // Relevante si AL MENOS UN item del combo está en el carrito
        if (!promotion.comboItems || promotion.comboItems.length === 0) {
          return false;
        }
        return promotion.comboItems.some(comboItem => {
          return cart.some(cartItem => {
            return cartItem.id === comboItem.id;
          });
        });

      case 'specificPrice':
        // Si no hay items específicos, no es relevante
        if (!promotion.applicableItems || promotion.applicableItems.length === 0) {
          return false;
        }
        // Verificar que al menos un item esté en el carrito
        return cart.some(item => {
          const itemId = item.id;
          return promotion.applicableItems.includes(itemId);
        });

      case 'dayOfWeek':
        // Aplica a cualquier compra en ese día
        return true;

      default:
        return false;
    }
  }, []);

  // Determinar la prioridad de una promoción (1 = alta, 3 = baja)
  const getPromotionPriority = useCallback((promo) => {
    // Prioridad ALTA (específicas): 1
    if (promo.type === 'percentage' && promo.appliesTo === 'specific') return 1;
    if (promo.type === 'fixed' && promo.applicableItems?.length > 0) return 1;
    if (promo.type === 'buyXgetY' && promo.applicableItems?.length > 0) return 1;
    if (promo.type === 'buyXgetYdiscount' && promo.applicableItems?.length > 0) return 1;
    if (promo.type === 'combo') return 1;
    if (promo.type === 'specificPrice' && promo.applicableItems?.length > 0) return 1;

    // Prioridad MEDIA (por tipo): 2
    if (promo.type === 'percentage' && promo.appliesTo === 'services') return 2;
    if (promo.type === 'percentage' && promo.appliesTo === 'products') return 2;

    // Prioridad BAJA (generales): 3
    return 3;
  }, []);

  // Determinar qué items del carrito deben mostrar badge para buyXgetY y buyXgetYdiscount
  const getItemsWithPromoBadge = useCallback((promotion, cart, itemPromotionMap = new Map()) => {
    // Filtrar items aplicables según la configuración de la promoción
    const applicableItems = cart.filter(item => {
      // Si el item ya tiene una promo asignada diferente, excluirlo
      const assignedPromo = itemPromotionMap.get(item.id);
      if (assignedPromo && assignedPromo.id !== promotion.id) {
        return false;
      }

      // Verificar si la promo aplica a este item
      if (!promotion.applicableItems || promotion.applicableItems.length === 0) {
        return true; // Aplica a todos los items
      }
      const itemId = item.id;
      return promotion.applicableItems.includes(itemId);
    });

    if (promotion.type === 'buyXgetY') {
      // Calcular cuántos items son gratis
      const totalQty = applicableItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
      const sets = Math.floor(totalQty / promotion.buyQuantity);
      const freeItemsCount = sets * promotion.getQuantity;

      if (freeItemsCount === 0) return [];

      // Ordenar por precio (menor a mayor) para encontrar los más baratos
      const sorted = [...applicableItems].sort((a, b) => a.salePrice - b.salePrice);
      const freeItemIds = [];
      let remaining = freeItemsCount;

      for (const item of sorted) {
        if (remaining <= 0) break;
        const itemQty = item.quantity || 1;
        const qtyToMark = Math.min(itemQty, remaining);

        // Si el item completo (todas sus cantidades) es gratis, agregarlo
        if (qtyToMark === itemQty) {
          freeItemIds.push(item.id);
        }
        remaining -= qtyToMark;
      }

      return freeItemIds;
    }

    if (promotion.type === 'buyXgetYdiscount') {
      // Calcular cuántos items reciben descuento (los más baratos)
      const totalQty = applicableItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
      const sets = Math.floor(totalQty / promotion.buyQuantity);

      if (sets === 0) return [];

      const sorted = [...applicableItems].sort((a, b) => a.salePrice - b.salePrice);
      const discountedItemIds = [];
      let remaining = sets;

      for (const item of sorted) {
        if (remaining <= 0) break;
        const itemQty = item.quantity || 1;
        const qtyToMark = Math.min(itemQty, remaining);

        // Si el item completo recibe descuento, agregarlo
        if (qtyToMark === itemQty) {
          discountedItemIds.push(item.id);
        }
        remaining -= qtyToMark;
      }

      return discountedItemIds;
    }

    return [];
  }, []);

  // ========== MEMOIZADOS ==========

  // Filtrar solo promociones activas
  const activePromotions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];

    return allPromotions.filter(promo => {
      // Verificar isActive
      if (!promo.isActive) return false;

      // Verificar rango de fechas
      if (promo.dateRange) {
        const startDate = promo.dateRange.startDate?.split('T')[0];
        const endDate = promo.dateRange.endDate?.split('T')[0];
        if (startDate && today < startDate) return false;
        if (endDate && today > endDate) return false;
      }

      // Verificar máximo de usos
      if (promo.maxUses && promo.currentUses >= promo.maxUses) return false;

      return true;
    });
  }, [allPromotions]);

  // Calcular subtotal
  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
  }, [cartItems]);

  // Calcular total de descuentos de promociones
  const calculatePromotionDiscount = useCallback(() => {
    return appliedPromotions.reduce((total, promo) => total + (promo.discountAmount || 0), 0);
  }, [appliedPromotions]);

  // Validar y calcular promociones aplicables
  const checkApplicablePromotions = useCallback(async () => {
    if (cartItems.length === 0 || activePromotions.length === 0) {
      // Solo limpiar si NO están vacíos (prevenir setState innecesarios)
      if (appliedPromotions.length > 0) setAppliedPromotions([]);
      if (Object.keys(promotionValidations).length > 0) setPromotionValidations({});
      return;
    }

    const { validatePromotion } = await import('../services/firebaseService');
    const subtotal = calculateSubtotal();
    const clientPhone = selectedClient?.phone || '';

    const validPromotions = [];
    const validations = {};

    for (const promotion of activePromotions) {
      // Adaptar cart items para validatePromotion (necesita type: 'product')
      const adaptedCart = cartItems.map(item => ({
        ...item,
        type: 'product',
        productId: item.id,
        price: item.salePrice
      }));

      const result = await validatePromotion(promotion, adaptedCart, clientPhone, subtotal);

      // Guardar resultado de validación para mostrar razón si no aplica
      validations[promotion.id] = {
        isValid: result.isValid,
        reason: result.reason || '',
        discountAmount: result.discountAmount || 0
      };

      if (result.isValid && result.discountAmount > 0) {
        validPromotions.push({
          ...promotion,
          discountAmount: result.discountAmount
        });
      }
    }

    // Solo actualizar si los valores realmente cambiaron (prevenir re-renders innecesarios)
    if (JSON.stringify(validPromotions) !== JSON.stringify(appliedPromotions)) {
      setAppliedPromotions(validPromotions);
    }
    if (JSON.stringify(validations) !== JSON.stringify(promotionValidations)) {
      setPromotionValidations(validations);
    }
  }, [cartItems, activePromotions, selectedClient, calculateSubtotal, appliedPromotions, promotionValidations]);

  // Memoizar el mapa de items -> promoción asignada para optimizar performance
  const itemPromotionMap = useMemo(() => {
    const map = new Map();

    // Ordenar promociones por prioridad (específicas primero)
    const sortedPromotions = [...(appliedPromotions || [])].sort((a, b) =>
      getPromotionPriority(a) - getPromotionPriority(b)
    );

    // Asignar promociones a items según prioridad
    sortedPromotions.forEach(promo => {
      cartItems.forEach(item => {
        if (map.has(item.id)) return; // Ya tiene promo asignada

        // Verificar si esta promo aplica a este item
        let applies = false;

        switch (promo.type) {
          case 'percentage':
            if (promo.appliesTo === 'all') applies = true;
            else if (promo.appliesTo === 'products') applies = true;
            else if (promo.appliesTo === 'specific' && promo.specificItems) {
              applies = promo.specificItems.includes(item.id);
            }
            break;

          case 'fixed':
            if (!promo.applicableItems || promo.applicableItems.length === 0) {
              applies = true;
            } else {
              applies = promo.applicableItems.includes(item.id);
            }
            break;

          case 'buyXgetY':
          case 'buyXgetYdiscount':
            const itemsWithBadge = getItemsWithPromoBadge(promo, cartItems, map);
            applies = itemsWithBadge.includes(item.id);
            break;

          case 'combo':
            if (promo.comboItems) {
              applies = promo.comboItems.some(comboItem => comboItem.id === item.id);
            }
            break;

          case 'specificPrice':
            if (promo.applicableItems && promo.applicableItems.length > 0) {
              applies = promo.applicableItems.includes(item.id);
            }
            break;

          case 'dayOfWeek':
            applies = true;
            break;
        }

        if (applies) {
          map.set(item.id, promo);
        }
      });
    });

    return map;
  }, [appliedPromotions, cartItems, getPromotionPriority, getItemsWithPromoBadge]);

  // ========== USEEFFECTS ==========

  // Recalcular promociones cuando cambie el carrito o el cliente
  useEffect(() => {
    checkApplicablePromotions();
  }, [checkApplicablePromotions]);

  // ========== RETORNAR API DEL HOOK ==========

  return {
    // Estados
    appliedPromotions,
    promotionValidations,

    // Funciones
    isPromotionRelevantForCart,
    getPromotionPriority,
    getItemsWithPromoBadge,
    checkApplicablePromotions,
    calculatePromotionDiscount,

    // Memoizados
    activePromotions,
    itemPromotionMap,

    // Función para limpiar promociones (llamada desde clearCart)
    clearPromotions: () => {
      setAppliedPromotions([]);
      setPromotionValidations({});
    }
  };
};
