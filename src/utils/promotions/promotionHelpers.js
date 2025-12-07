/**
 * Utilidades para trabajar con promociones
 * Extraído de OrderForm.jsx para reutilización
 */

/**
 * Determina si una promoción es relevante para el carrito actual
 * @param {Object} promotion - Objeto de promoción
 * @param {Array} cart - Items en el carrito
 * @returns {boolean} - true si la promoción es relevante para mostrar
 */
export const isPromotionRelevantForCart = (promotion, cart) => {
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
          if (item.type === 'service' && item.serviceId) {
            return promotion.specificItems.includes(item.serviceId);
          }
          if (item.type === 'product' && item.productId) {
            return promotion.specificItems.includes(item.productId);
          }
          return false;
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
        if (item.type === 'service' && item.serviceId) {
          return promotion.applicableItems.includes(item.serviceId);
        }
        if (item.type === 'product' && item.productId) {
          return promotion.applicableItems.includes(item.productId);
        }
        return false;
      });

    case 'buyXgetY':
    case 'buyXgetYdiscount':
      // Si no hay items específicos, aplica a todo
      if (!promotion.applicableItems || promotion.applicableItems.length === 0) {
        return true;
      }
      // Si hay items específicos, verificar que estén en el carrito
      return cart.some(item => {
        if (item.type === 'service' && item.serviceId) {
          return promotion.applicableItems.includes(item.serviceId);
        }
        if (item.type === 'product' && item.productId) {
          return promotion.applicableItems.includes(item.productId);
        }
        return false;
      });

    case 'combo':
      // Relevante si AL MENOS UN item del combo está en el carrito
      if (!promotion.comboItems || promotion.comboItems.length === 0) {
        return false;
      }
      return promotion.comboItems.some(comboItem => {
        return cart.some(cartItem => {
          if (cartItem.type === 'service' && cartItem.serviceId) {
            return cartItem.serviceId === comboItem.id;
          }
          if (cartItem.type === 'product' && cartItem.productId) {
            return cartItem.productId === comboItem.id;
          }
          return false;
        });
      });

    case 'specificPrice':
      // Si no hay items específicos, no es relevante
      if (!promotion.applicableItems || promotion.applicableItems.length === 0) {
        return false;
      }
      // Verificar que al menos un item esté en el carrito
      return cart.some(item => {
        if (item.type === 'service' && item.serviceId) {
          return promotion.applicableItems.includes(item.serviceId);
        }
        if (item.type === 'product' && item.productId) {
          return promotion.applicableItems.includes(item.productId);
        }
        return false;
      });

    case 'dayOfWeek':
      // Aplica a cualquier compra en ese día
      return true;

    default:
      return false;
  }
};

/**
 * Determina la prioridad de una promoción
 * @param {Object} promo - Objeto de promoción
 * @returns {number} - Prioridad (1 = alta, 3 = baja)
 */
export const getPromotionPriority = (promo) => {
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
};

/**
 * Determina qué items del carrito deben mostrar badge para buyXgetY y buyXgetYdiscount
 * @param {Object} promotion - Promoción a evaluar
 * @param {Array} cart - Items en el carrito
 * @param {Map} itemPromotionMap - Mapa de items ya asignados a promociones
 * @returns {Array} - IDs de items que deben mostrar badge
 */
export const getItemsWithPromoBadge = (promotion, cart, itemPromotionMap = new Map()) => {
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
    const itemId = item.type === 'service' ? item.serviceId : item.productId;
    return promotion.applicableItems.includes(itemId);
  });

  if (promotion.type === 'buyXgetY') {
    // Calcular cuántos items son gratis
    const totalQty = applicableItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
    const sets = Math.floor(totalQty / promotion.buyQuantity);
    const freeItemsCount = sets * promotion.getQuantity;

    if (freeItemsCount === 0) return [];

    // Ordenar por precio (menor a mayor) para encontrar los más baratos
    const sorted = [...applicableItems].sort((a, b) => a.price - b.price);
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

    const sorted = [...applicableItems].sort((a, b) => a.price - b.price);
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
};
