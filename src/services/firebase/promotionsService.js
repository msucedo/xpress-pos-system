import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  onSnapshot,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== PROMOTIONS ====================

/**
 * Get all promotions
 * @returns {Promise<Array>} Array of promotions
 */
export const getAllPromotions = async () => {
  try {
    const promotionsRef = collection(db, 'promotions');
    const querySnapshot = await getDocs(promotionsRef);

    const promotions = [];
    querySnapshot.forEach((doc) => {
      promotions.push({ id: doc.id, ...doc.data() });
    });

    return promotions;
  } catch (error) {
    console.error('Error getting promotions:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time promotions updates
 * @param {Function} callback - Function to call when promotions change
 * @returns {Function} Unsubscribe function
 */
export const subscribeToPromotions = (callback) => {
  try {
    const promotionsRef = collection(db, 'promotions');

    return onSnapshot(promotionsRef, (snapshot) => {
      const promotions = [];
      snapshot.forEach((doc) => {
        promotions.push({ id: doc.id, ...doc.data() });
      });
      callback(promotions);
    }, (error) => {
      console.error('Error in promotions subscription:', error);
    });
  } catch (error) {
    console.error('Error subscribing to promotions:', error);
    throw error;
  }
};

/**
 * Add a new promotion
 * @param {Object} promotionData - Promotion data
 * @returns {Promise<string>} Document ID of the created promotion
 */
export const addPromotion = async (promotionData) => {
  try {
    const promotionsRef = collection(db, 'promotions');
    const docRef = await addDoc(promotionsRef, {
      ...promotionData,
      currentUses: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding promotion:', error);
    throw error;
  }
};

/**
 * Update an existing promotion
 * @param {string} promotionId - Promotion document ID
 * @param {Object} promotionData - Updated promotion data
 */
export const updatePromotion = async (promotionId, promotionData) => {
  try {
    const promotionRef = doc(db, 'promotions', promotionId);
    await updateDoc(promotionRef, {
      ...promotionData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
};

/**
 * Delete a promotion
 * @param {string} promotionId - Promotion document ID
 */
export const deletePromotion = async (promotionId) => {
  try {
    const promotionRef = doc(db, 'promotions', promotionId);
    await deleteDoc(promotionRef);
  } catch (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
};

/**
 * Get only active promotions (filtered by date and active status)
 * @returns {Promise<Array>} Array of active promotions
 */
export const getActivePromotions = async () => {
  try {
    const promotionsRef = collection(db, 'promotions');
    const querySnapshot = await getDocs(promotionsRef);

    // Comparar solo fechas (sin hora) para evitar problemas de timezone
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const activePromotions = [];

    querySnapshot.forEach((doc) => {
      const promo = { id: doc.id, ...doc.data() };

      // Check if promotion is marked as active
      if (!promo.isActive) return;

      // Check if within date range (if dateRange is set)
      if (promo.dateRange) {
        const { startDate, endDate } = promo.dateRange;
        // Extraer solo la parte de fecha para comparación
        const promotionStartDate = startDate ? startDate.split('T')[0] : null;
        const promotionEndDate = endDate ? endDate.split('T')[0] : null;

        if (promotionStartDate && today < promotionStartDate) return;
        if (promotionEndDate && today > promotionEndDate) return;
      }

      // Check if max uses reached (if maxUses is set)
      if (promo.maxUses && promo.currentUses >= promo.maxUses) return;

      activePromotions.push(promo);
    });

    return activePromotions;
  } catch (error) {
    console.error('Error getting active promotions:', error);
    throw error;
  }
};

/**
 * Validate if a promotion can be applied to an order
 * @param {Object} promotion - Promotion object
 * @param {Object} cart - Cart items array
 * @param {string} clientPhone - Client phone number
 * @param {number} subtotal - Order subtotal before discounts
 * @returns {Promise<Object>} Validation result { isValid, reason, discountAmount }
 */
export const validatePromotion = async (promotion, cart, clientPhone, subtotal) => {
  try {
    // Comparar solo fechas (sin hora) para evitar problemas de timezone
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    // 1. Check if promotion is active
    if (!promotion.isActive) {
      return { isValid: false, reason: 'Promoción inactiva' };
    }

    // 2. Check date range
    if (promotion.dateRange) {
      const { startDate, endDate } = promotion.dateRange;
      // Extraer solo la parte de fecha para comparación
      const promotionStartDate = startDate ? startDate.split('T')[0] : null;
      const promotionEndDate = endDate ? endDate.split('T')[0] : null;

      if (promotionStartDate && today < promotionStartDate) {
        return { isValid: false, reason: 'Promoción aún no válida' };
      }
      if (promotionEndDate && today > promotionEndDate) {
        return { isValid: false, reason: 'Promoción expirada' };
      }
    }

    // 3. Check max uses
    if (promotion.maxUses && promotion.currentUses >= promotion.maxUses) {
      return { isValid: false, reason: 'Límite de usos alcanzado' };
    }

    // 4. Check minimum purchase amount
    if (promotion.minPurchaseAmount && subtotal < promotion.minPurchaseAmount) {
      return {
        isValid: false,
        reason: `Compra mínima de $${promotion.minPurchaseAmount} requerida`
      };
    }

    // 5. Check one per client restriction
    if (promotion.onePerClient && clientPhone) {
      const hasUsed = await checkPromotionUsageByClient(promotion.id, clientPhone);
      if (hasUsed) {
        return { isValid: false, reason: 'Ya usaste esta promoción' };
      }
    }

    // 6. Check new clients only restriction
    if (promotion.newClientsOnly && clientPhone) {
      // Buscar CUALQUIER orden previa del cliente (sin importar el estado)
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef,
        where('phone', '==', clientPhone),
        limit(1) // Solo necesitamos saber si existe al menos una
      );
      const orderSnapshot = await getDocs(q);

      // Si tiene al menos una orden previa, ya no es cliente nuevo
      if (!orderSnapshot.empty) {
        return { isValid: false, reason: 'Promoción solo para clientes nuevos' };
      }
    }

    // 7. Check day of week restriction (applies to all promotion types)
    if (promotion.daysOfWeek && promotion.daysOfWeek.length > 0) {
      const currentDay = new Date().getDay();
      if (!promotion.daysOfWeek.includes(currentDay)) {
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const validDays = promotion.daysOfWeek.map(d => dayNames[d]).join(', ');
        return {
          isValid: false,
          reason: `Válido solo ${validDays}`
        };
      }
    }

    // Calculate discount amount based on type
    let discountAmount = 0;

    switch (promotion.type) {
      case 'percentage':
        if (promotion.appliesTo === 'all') {
          discountAmount = subtotal * (promotion.discountValue / 100);
        } else if (promotion.appliesTo === 'services') {
          // Calculate only for services
          const servicesTotal = cart
            .filter(item => item.type === 'service')
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
          discountAmount = servicesTotal * (promotion.discountValue / 100);
        } else if (promotion.appliesTo === 'products') {
          // Calculate only for products
          const productsTotal = cart
            .filter(item => item.type === 'product')
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
          discountAmount = productsTotal * (promotion.discountValue / 100);
        } else if (promotion.appliesTo === 'specific' && promotion.specificItems) {
          // Calculate only for specific items
          const applicableTotal = cart
            .filter(item => {
              // Comparar con serviceId o productId, no con el ID temporal del carrito
              if (item.type === 'service' && item.serviceId) {
                return promotion.specificItems.includes(item.serviceId);
              }
              if (item.type === 'product' && item.productId) {
                return promotion.specificItems.includes(item.productId);
              }
              return false;
            })
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
          discountAmount = applicableTotal * (promotion.discountValue / 100);
        }
        break;

      case 'fixed':
        // Si hay items aplicables específicos, calcular solo para esos items
        if (promotion.applicableItems && promotion.applicableItems.length > 0) {
          const applicableItems = cart.filter(item => {
            if (item.type === 'service' && item.serviceId) {
              return promotion.applicableItems.includes(item.serviceId);
            }
            if (item.type === 'product' && item.productId) {
              return promotion.applicableItems.includes(item.productId);
            }
            return false;
          });

          // Calcular cantidad total de items aplicables y multiplicar por descuento fijo
          if (applicableItems.length > 0) {
            const totalQuantity = applicableItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
            discountAmount = promotion.discountValue * totalQuantity;
          }
        } else {
          // Si no hay items específicos, aplicar a cada item del carrito
          const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
          discountAmount = promotion.discountValue * totalQuantity;
        }
        break;

      case 'dayOfWeek':
        discountAmount = subtotal * (promotion.discountValue / 100);
        break;

      case 'buyXgetY':
        // For buyXgetY, discount is calculated differently (free items)
        const applicableItems = cart.filter(item => {
          // Si no hay items específicos configurados, aplicar a todos los items del carrito
          if (!promotion.applicableItems || promotion.applicableItems.length === 0) {
            return true;
          }

          // Para servicios, comparar con serviceId
          if (item.type === 'service' && item.serviceId) {
            return promotion.applicableItems.includes(item.serviceId);
          }

          // Para productos, comparar con productId
          if (item.type === 'product' && item.productId) {
            return promotion.applicableItems.includes(item.productId);
          }

          return false;
        });

        console.log('🔍 [Promo Debug - 2x1]', {
          promotionName: promotion.name,
          totalItemsInCart: cart.length,
          applicableItemsFound: applicableItems.length,
          applicableItemsDetails: applicableItems.map(i => ({
            type: i.type,
            name: i.type === 'service' ? i.serviceName : i.name,
            quantity: i.quantity,
            cartItemId: i.id,
            serviceId: i.serviceId,
            productId: i.productId
          })),
          configuredApplicableItems: promotion.applicableItems,
          buyQuantity: promotion.buyQuantity,
          getQuantity: promotion.getQuantity
        });

        if (applicableItems.length > 0) {
          const totalQty = applicableItems.reduce((sum, item) => sum + item.quantity, 0);
          const sets = Math.floor(totalQty / promotion.buyQuantity);
          const freeItems = sets * promotion.getQuantity;
          // Usar el precio más barato para regalar (beneficia al negocio)
          const itemPrice = Math.min(...applicableItems.map(i => i.price));
          discountAmount = freeItems * itemPrice;

          console.log('✅ [Promo Calculation]', {
            totalQuantity: totalQty,
            setsEarned: sets,
            freeItemsGranted: freeItems,
            itemPrice: itemPrice,
            totalDiscount: discountAmount
          });
        } else {
          console.log('❌ [Promo Not Applied]', 'No items in cart match applicableItems');
        }
        break;

      case 'buyXgetYdiscount':
        // For buyXgetYdiscount, apply percentage discount to cheapest item per set
        const applicableItemsDisc = cart.filter(item => {
          // Si no hay items específicos configurados, aplicar a todos los items del carrito
          if (!promotion.applicableItems || promotion.applicableItems.length === 0) {
            return true;
          }

          // Para servicios, comparar con serviceId
          if (item.type === 'service' && item.serviceId) {
            return promotion.applicableItems.includes(item.serviceId);
          }

          // Para productos, comparar con productId
          if (item.type === 'product' && item.productId) {
            return promotion.applicableItems.includes(item.productId);
          }

          return false;
        });

        if (applicableItemsDisc.length > 0) {
          const totalQty = applicableItemsDisc.reduce((sum, item) => sum + item.quantity, 0);
          const sets = Math.floor(totalQty / promotion.buyQuantity);

          if (sets > 0) {
            // Encontrar el precio más barato para aplicar el descuento
            const cheapestPrice = Math.min(...applicableItemsDisc.map(i => i.price));
            // Aplicar porcentaje de descuento al precio más barato
            const discountPerItem = cheapestPrice * (promotion.discountPercentage / 100);
            discountAmount = sets * discountPerItem;

            console.log('✅ [Promo BuyXgetYdiscount]', {
              totalQuantity: totalQty,
              setsEarned: sets,
              cheapestPrice: cheapestPrice,
              discountPercentage: promotion.discountPercentage,
              discountPerSet: discountPerItem,
              totalDiscount: discountAmount
            });
          }
        }
        break;

      case 'combo':
        // For combo, check if all items are in cart with sufficient quantities
        if (promotion.comboItems) {
          const hasAllItemsWithQuantity = promotion.comboItems.every(comboItem => {
            const requiredQty = comboItem.quantity || 1;

            // Buscar el item en el carrito
            const cartItem = cart.find(cartItem => {
              if (cartItem.type === 'service' && cartItem.serviceId) {
                return cartItem.serviceId === comboItem.id;
              }
              if (cartItem.type === 'product' && cartItem.productId) {
                return cartItem.productId === comboItem.id;
              }
              return false;
            });

            // Verificar que existe Y tiene suficiente cantidad
            return cartItem && (cartItem.quantity || 1) >= requiredQty;
          });

          if (hasAllItemsWithQuantity) {
            // Calcular precio normal multiplicando por cantidades
            const normalPrice = promotion.comboItems.reduce((sum, item) =>
              sum + (item.price * (item.quantity || 1)), 0
            );
            discountAmount = normalPrice - promotion.comboPrice;
          }
        }
        break;

      case 'specificPrice':
        // For specificPrice, calculate discount as difference between current price and specific price
        if (promotion.applicableItems && promotion.applicableItems.length > 0) {
          const applicableItemsPrice = cart.filter(item => {
            // Para servicios, comparar con serviceId
            if (item.type === 'service' && item.serviceId) {
              return promotion.applicableItems.includes(item.serviceId);
            }
            // Para productos, comparar con productId
            if (item.type === 'product' && item.productId) {
              return promotion.applicableItems.includes(item.productId);
            }
            return false;
          });

          if (applicableItemsPrice.length > 0) {
            // Calcular descuento como diferencia entre precio actual y precio específico
            discountAmount = applicableItemsPrice.reduce((sum, item) => {
              const currentPrice = item.price;
              const specificPrice = promotion.specificPrice;
              const discount = Math.max(0, currentPrice - specificPrice);
              return sum + (discount * item.quantity);
            }, 0);
          }
        }
        break;

      default:
        discountAmount = 0;
    }

    return {
      isValid: true,
      reason: 'Válida',
      discountAmount: Math.max(0, discountAmount)
    };

  } catch (error) {
    console.error('Error validating promotion:', error);
    return { isValid: false, reason: 'Error al validar promoción' };
  }
};

/**
 * Increment promotion usage counter
 * @param {string} promotionId - Promotion document ID
 * @param {string} clientPhone - Client phone number (for tracking)
 * @returns {Promise<void>}
 */
export const incrementPromotionUsage = async (promotionId, clientPhone) => {
  try {
    const promotionRef = doc(db, 'promotions', promotionId);
    const promotionSnap = await getDoc(promotionRef);

    if (!promotionSnap.exists()) {
      throw new Error('Promotion not found');
    }

    const currentUses = promotionSnap.data().currentUses || 0;

    // Update usage counter
    await updateDoc(promotionRef, {
      currentUses: currentUses + 1,
      updatedAt: new Date().toISOString()
    });

    // If onePerClient is enabled, track this usage
    if (promotionSnap.data().onePerClient && clientPhone) {
      const usageRef = collection(db, 'promotions', promotionId, 'clientUsage');
      await addDoc(usageRef, {
        clientPhone,
        usedAt: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Error incrementing promotion usage:', error);
    throw error;
  }
};

/**
 * Check if a client has already used a promotion
 * @param {string} promotionId - Promotion document ID
 * @param {string} clientPhone - Client phone number
 * @returns {Promise<boolean>} True if client has used this promotion
 */
export const checkPromotionUsageByClient = async (promotionId, clientPhone) => {
  try {
    const usageRef = collection(db, 'promotions', promotionId, 'clientUsage');
    const q = query(usageRef, where('clientPhone', '==', clientPhone));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking promotion usage by client:', error);
    return false;
  }
};
