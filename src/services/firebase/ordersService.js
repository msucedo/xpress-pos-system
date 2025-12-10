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
  runTransaction
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { sendDeliveryNotification, sendOrderReceivedNotification } from '../whatsappService';
import { generateTrackingToken } from './trackingService';

// ==================== ORDERS ====================

/**
 * Get all orders organized by status
 * @returns {Promise<Object>} Orders organized by status columns
 */
export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);

    const orders = {
      recibidos: [],
      proceso: [],
      listos: [],
      enEntrega: [],
      completados: [],
      cancelado: []
    };

    querySnapshot.forEach((doc) => {
      const orderData = { id: doc.id, ...doc.data() };
      const status = orderData.orderStatus || 'recibidos';

      if (orders[status]) {
        orders[status].push(orderData);
      }
    });

    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time orders updates
 * @param {Function} callback - Function to call when orders change
 * @returns {Function} Unsubscribe function
 */
export const subscribeToOrders = (callback) => {
  try {
    const ordersRef = collection(db, 'orders');

    return onSnapshot(ordersRef, (snapshot) => {
      const orders = {
        recibidos: [],
        proceso: [],
        listos: [],
        enEntrega: [],
        completados: [],
        cancelado: []
      };

      snapshot.forEach((doc) => {
        const orderData = { id: doc.id, ...doc.data() };
        const status = orderData.orderStatus || 'recibidos';

        if (orders[status]) {
          orders[status].push(orderData);
        }
      });

      callback(orders);
    }, (error) => {
      console.error('Error in orders subscription:', error);
    });
  } catch (error) {
    console.error('Error subscribing to orders:', error);
    throw error;
  }
};

/**
 * Add a new order
 * @param {Object} orderData - Order data
 * @returns {Promise<string>} Document ID of the created order
 */
export const addOrder = async (orderData) => {
  try {
    // DETERMINAR ESTADO INICIAL DINÁMICAMENTE
    const hasServices = orderData.services && orderData.services.length > 0;
    const isWithoutServices = orderData.isOrderWithoutServices === true;
    const isPaid = orderData.paymentStatus === 'paid';

    let initialStatus = 'recibidos';  // Por defecto

    // REGLA: Solo órdenes SIN servicios Y pagadas completas van a "completados"
    if (!hasServices && isWithoutServices && isPaid) {
      initialStatus = 'completados';
    }

    // Limpiar flag temporal antes de guardar
    const { isOrderWithoutServices, ...cleanOrderData } = orderData;

    // Si hay productos en la orden, usar transacción para garantizar atomicidad
    if (orderData.products && orderData.products.length > 0) {
      const orderId = await runTransaction(db, async (transaction) => {
        // 1. Verificar stock disponible para todos los productos
        const productRefs = [];
        const productDocs = [];

        for (const product of orderData.products) {
          const productRef = doc(db, 'inventory', product.productId);
          const productDoc = await transaction.get(productRef);

          if (!productDoc.exists()) {
            throw new Error(`Producto ${product.name} no encontrado en inventario`);
          }

          const currentStock = productDoc.data().stock || 0;
          if (currentStock < product.quantity) {
            throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${currentStock}, Solicitado: ${product.quantity}`);
          }

          productRefs.push(productRef);
          productDocs.push(productDoc);
        }

        // 2. Crear la orden
        const ordersRef = collection(db, 'orders');
        const orderRef = doc(ordersRef);
        const trackingToken = generateTrackingToken();
        transaction.set(orderRef, {
          ...cleanOrderData,
          orderStatus: initialStatus,
          trackingToken: trackingToken,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // 2.5 Agregar id y completedDate al documento
        const updateData = { id: orderRef.id };
        if (initialStatus === 'completados') {
          updateData.completedDate = new Date().toISOString();
        }
        transaction.update(orderRef, updateData);

        // 3. Descontar stock de todos los productos
        orderData.products.forEach((product, index) => {
          const currentStock = productDocs[index].data().stock;
          const newStock = currentStock - product.quantity;

          transaction.update(productRefs[index], {
            stock: newStock,
            updatedAt: new Date().toISOString()
          });
        });

        return orderRef.id;
      });

      // ==================== WHATSAPP: ORDEN RECIBIDA CON FOTO ====================
      // Enviar notificación WhatsApp si la orden tiene fotos Y servicios (después de la transacción)
      const orderImages = cleanOrderData.orderImages;
      const whatsappPhone = cleanOrderData.phone;
      const hasServices = cleanOrderData.services && cleanOrderData.services.length > 0;

      if (hasServices && orderImages && orderImages.length > 0 && whatsappPhone) {
        // Necesitamos obtener el trackingToken que se generó en la transacción
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        const orderDataFromDb = orderDoc.data();

        const newOrderWithId = {
          id: orderId,
          ...orderDataFromDb
        };

        try {
          const orderReceivedResult = await sendOrderReceivedNotification(newOrderWithId);

          // Actualizar documento con historial de WhatsApp
          if (orderReceivedResult.success) {
            console.log('✅ [Firebase] Notificación orden recibida enviada exitosamente');

            const newNotifications = [];

            // Agregar mensaje 1: Template
            newNotifications.push({
              type: 'template_order_received',
              sentAt: orderReceivedResult.timestamp,
              status: orderReceivedResult.status,
              messageId: orderReceivedResult.messageId,
              message: orderReceivedResult.message
            });

            // Agregar mensaje 2: Imagen (si se envió exitosamente)
            if (orderReceivedResult.imageResult && orderReceivedResult.imageResult.success) {
              newNotifications.push({
                type: 'image_order_received',
                sentAt: orderReceivedResult.imageResult.timestamp,
                status: orderReceivedResult.imageResult.status,
                messageId: orderReceivedResult.imageResult.messageId,
                message: '📸 Foto de su orden'
              });
            }

            await updateDoc(doc(db, 'orders', orderId), {
              whatsappNotifications: newNotifications
            });
          } else if (!orderReceivedResult.skipped) {
            console.error('❌ [Firebase] Error enviando notificación orden recibida:', orderReceivedResult.error);

            // Registrar error en historial
            const failedNotifications = [{
              type: 'template_order_received',
              sentAt: orderReceivedResult.timestamp,
              status: 'failed',
              error: orderReceivedResult.error,
              errorCode: orderReceivedResult.errorCode
            }];

            // Agregar resultado de imagen (exitosa o fallida)
            if (orderReceivedResult.imageResult) {
              if (orderReceivedResult.imageResult.success) {
                failedNotifications.push({
                  type: 'image_order_received',
                  sentAt: orderReceivedResult.imageResult.timestamp,
                  status: orderReceivedResult.imageResult.status,
                  messageId: orderReceivedResult.imageResult.messageId,
                  message: '📸 Foto de su orden'
                });
              } else {
                failedNotifications.push({
                  type: 'image_order_received',
                  sentAt: orderReceivedResult.imageResult.timestamp,
                  status: 'failed',
                  error: orderReceivedResult.imageResult.error,
                  errorCode: orderReceivedResult.imageResult.errorCode
                });
              }
            }

            await updateDoc(doc(db, 'orders', orderId), {
              whatsappNotifications: failedNotifications
            });
          }
        } catch (error) {
          console.error('❌ [Firebase] Error inesperado enviando notificación WhatsApp:', error);
          // No bloquear la creación de la orden si falla WhatsApp
        }
      }

      return orderId;
    } else {
      // Si no hay productos, crear orden normalmente
      const ordersRef = collection(db, 'orders');
      const trackingToken = generateTrackingToken();
      const docRef = await addDoc(ordersRef, {
        ...cleanOrderData,
        orderStatus: initialStatus,
        trackingToken: trackingToken,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Agregar id al documento
      await updateDoc(docRef, {
        id: docRef.id
      });

      // ==================== WHATSAPP: ORDEN RECIBIDA CON FOTO ====================
      // Enviar notificación WhatsApp si la orden tiene fotos Y servicios
      const orderImages = cleanOrderData.orderImages;
      const whatsappPhone = cleanOrderData.phone;
      const hasServices = cleanOrderData.services && cleanOrderData.services.length > 0;

      if (hasServices && orderImages && orderImages.length > 0 && whatsappPhone) {
        // Construir objeto completo de la orden para WhatsApp
        const newOrderWithId = {
          id: docRef.id,
          ...cleanOrderData,
          orderStatus: initialStatus,
          trackingToken: trackingToken
        };

        try {
          const orderReceivedResult = await sendOrderReceivedNotification(newOrderWithId);

          // Actualizar documento con historial de WhatsApp
          if (orderReceivedResult.success) {
            console.log('✅ [Firebase] Notificación orden recibida enviada exitosamente');

            const newNotifications = [];

            // Agregar mensaje 1: Template
            newNotifications.push({
              type: 'template_order_received',
              sentAt: orderReceivedResult.timestamp,
              status: orderReceivedResult.status,
              messageId: orderReceivedResult.messageId,
              message: orderReceivedResult.message
            });

            // Agregar mensaje 2: Imagen (si se envió exitosamente)
            if (orderReceivedResult.imageResult && orderReceivedResult.imageResult.success) {
              newNotifications.push({
                type: 'image_order_received',
                sentAt: orderReceivedResult.imageResult.timestamp,
                status: orderReceivedResult.imageResult.status,
                messageId: orderReceivedResult.imageResult.messageId,
                message: '📸 Foto de su orden'
              });
            }

            await updateDoc(docRef, {
              whatsappNotifications: newNotifications
            });
          } else if (!orderReceivedResult.skipped) {
            console.error('❌ [Firebase] Error enviando notificación orden recibida:', orderReceivedResult.error);

            // Registrar error en historial
            const failedNotifications = [{
              type: 'template_order_received',
              sentAt: orderReceivedResult.timestamp,
              status: 'failed',
              error: orderReceivedResult.error,
              errorCode: orderReceivedResult.errorCode
            }];

            // Agregar resultado de imagen (exitosa o fallida)
            if (orderReceivedResult.imageResult) {
              if (orderReceivedResult.imageResult.success) {
                failedNotifications.push({
                  type: 'image_order_received',
                  sentAt: orderReceivedResult.imageResult.timestamp,
                  status: orderReceivedResult.imageResult.status,
                  messageId: orderReceivedResult.imageResult.messageId,
                  message: '📸 Foto de su orden'
                });
              } else {
                failedNotifications.push({
                  type: 'image_order_received',
                  sentAt: orderReceivedResult.imageResult.timestamp,
                  status: 'failed',
                  error: orderReceivedResult.imageResult.error,
                  errorCode: orderReceivedResult.imageResult.errorCode
                });
              }
            }

            await updateDoc(docRef, {
              whatsappNotifications: failedNotifications
            });
          }
        } catch (error) {
          console.error('❌ [Firebase] Error inesperado enviando notificación WhatsApp:', error);
          // No bloquear la creación de la orden si falla WhatsApp
        }
      }

      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

/**
 * Update an existing order
 * Automatically sends WhatsApp notification when status changes to "enEntrega"
 * @param {string} orderId - Order document ID
 * @param {Object} orderData - Updated order data
 * @returns {Promise<Object>} Result object with whatsapp info if status changed to enEntrega
 */
export const updateOrder = async (orderId, orderData) => {
  try {
    const orderRef = doc(db, 'orders', orderId);

    // Get current order data to check if status changed
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    const currentOrderData = orderDoc.data();
    const currentStatus = currentOrderData.orderStatus;
    const newStatus = orderData.orderStatus;

    // Check if status is changing to "enEntrega"
    const statusChangingToEntrega = newStatus === 'enEntrega' && currentStatus !== 'enEntrega';

    // Check if status is changing to "cancelado"
    const statusChangingToCancelado = newStatus === 'cancelado' && currentStatus !== 'cancelado';

    let whatsappResult = null;
    let updateData = {
      ...orderData,
      updatedAt: new Date().toISOString()
    };

    // If cancelling order with pending payment, update payment status
    if (statusChangingToCancelado && currentOrderData.paymentStatus === 'pending') {
      updateData.paymentStatus = 'cancelled';
    }

    if (statusChangingToEntrega) {
      // Prepare complete order data for WhatsApp notification
      const completeOrderData = {
        id: orderId,
        ...currentOrderData,
        ...orderData
      };

      console.log('📱 [Firebase] Status changing to enEntrega, sending WhatsApp notification...');
      whatsappResult = await sendDeliveryNotification(completeOrderData);

      // Add WhatsApp notification to the notifications array
      if (whatsappResult.success) {
        console.log('✅ [Firebase] WhatsApp notification sent successfully');

        const existingNotifications = currentOrderData.whatsappNotifications || [];

        updateData.whatsappNotifications = [
          ...existingNotifications,
          {
            sentAt: whatsappResult.timestamp,
            status: whatsappResult.status,
            messageId: whatsappResult.messageId,
            message: whatsappResult.message
          }
        ];
      } else if (!whatsappResult.skipped) {
        // Only log errors if it wasn't skipped due to configuration
        console.error('❌ [Firebase] WhatsApp notification failed:', whatsappResult.error);

        const existingNotifications = currentOrderData.whatsappNotifications || [];

        updateData.whatsappNotifications = [
          ...existingNotifications,
          {
            sentAt: whatsappResult.timestamp,
            status: 'failed',
            error: whatsappResult.error,
            errorCode: whatsappResult.errorCode,
            errorType: whatsappResult.errorType
          }
        ];
      }
    }

    // ==================== WHATSAPP: DETECTAR PRIMERA FOTO AGREGADA ====================
    // Detectar si se agregó la primera foto a una orden existente
    const oldImages = currentOrderData.orderImages || [];
    const newImages = orderData.orderImages || [];
    const isFirstImageAdded = oldImages.length === 0 && newImages.length > 0;

    let orderReceivedResult = null;

    // Solo enviar si tiene servicios Y es primera foto agregada
    const completeOrderData = {
      id: orderId,
      ...currentOrderData,
      ...orderData
    };
    const hasServices = completeOrderData.services && completeOrderData.services.length > 0;

    if (isFirstImageAdded && hasServices) {
      console.log('📱 [Firebase] Primera foto agregada, enviando notificación orden recibida...');
      orderReceivedResult = await sendOrderReceivedNotification(completeOrderData);

      // Add WhatsApp notifications to the notifications array
      if (orderReceivedResult.success) {
        console.log('✅ [Firebase] Notificación orden recibida enviada exitosamente');

        const existingNotifications = currentOrderData.whatsappNotifications || [];
        const newNotifications = [...existingNotifications];

        // Agregar mensaje 1: Template
        newNotifications.push({
          type: 'template_order_received',
          sentAt: orderReceivedResult.timestamp,
          status: orderReceivedResult.status,
          messageId: orderReceivedResult.messageId,
          message: orderReceivedResult.message
        });

        // Agregar mensaje 2: Imagen (si se envió exitosamente)
        if (orderReceivedResult.imageResult && orderReceivedResult.imageResult.success) {
          newNotifications.push({
            type: 'image_order_received',
            sentAt: orderReceivedResult.imageResult.timestamp,
            status: orderReceivedResult.imageResult.status,
            messageId: orderReceivedResult.imageResult.messageId,
            message: '📸 Foto de su orden'
          });
        }

        updateData.whatsappNotifications = newNotifications;

      } else if (!orderReceivedResult.skipped) {
        // Only log errors if it wasn't skipped due to configuration
        console.error('❌ [Firebase] Notificación orden recibida falló:', orderReceivedResult.error);

        const existingNotifications = currentOrderData.whatsappNotifications || [];
        const failedNotifications = [
          {
            type: 'template_order_received',
            sentAt: orderReceivedResult.timestamp,
            status: 'failed',
            error: orderReceivedResult.error,
            errorCode: orderReceivedResult.errorCode
          }
        ];

        // Agregar resultado de imagen (exitosa o fallida)
        if (orderReceivedResult.imageResult) {
          if (orderReceivedResult.imageResult.success) {
            failedNotifications.push({
              type: 'image_order_received',
              sentAt: orderReceivedResult.imageResult.timestamp,
              status: orderReceivedResult.imageResult.status,
              messageId: orderReceivedResult.imageResult.messageId,
              message: '📸 Foto de su orden'
            });
          } else {
            failedNotifications.push({
              type: 'image_order_received',
              sentAt: orderReceivedResult.imageResult.timestamp,
              status: 'failed',
              error: orderReceivedResult.imageResult.error,
              errorCode: orderReceivedResult.imageResult.errorCode
            });
          }
        }

        updateData.whatsappNotifications = [
          ...existingNotifications,
          ...failedNotifications
        ];
      }
    }

    // Update the order
    await updateDoc(orderRef, updateData);

    // Return result with WhatsApp info if applicable
    return {
      success: true,
      whatsappResult: whatsappResult,
      orderReceivedResult: orderReceivedResult
    };

  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/**
 * Delete an order
 * @param {string} orderId - Order document ID
 */
export const deleteOrder = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

/**
 * Get order by ID
 * @param {string} orderId - Order document ID
 * @returns {Promise<Object|null>} Full order data or null if not found
 */
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.warn('Order not found:', orderId);
      return null;
    }

    return {
      id: orderSnap.id,
      ...orderSnap.data()
    };
  } catch (error) {
    console.error('Error getting order by ID:', error);
    return null;
  }
};

/**
 * Get order by tracking token (PUBLIC - no authentication required)
 * Used for public order tracking page
 * @param {string} token - Tracking token
 * @returns {Promise<Object|null>} Order data with only public fields, or null if not found
 */
export const getOrderByTrackingToken = async (token) => {
  try {
    // Validate token format
    if (!token || typeof token !== 'string') {
      console.error('[OrderTracking] Invalid token type:', typeof token);
      return null;
    }

    // Token should be 12 characters: 8 random + 4 timestamp
    if (token.length < 8 || token.length > 15) {
      console.error('[OrderTracking] Invalid token length:', token.length);
      return null;
    }

    // Token should only contain alphanumeric characters
    if (!/^[a-z0-9]+$/i.test(token)) {
      console.error('[OrderTracking] Invalid token format - contains invalid characters');
      return null;
    }

    console.log('[OrderTracking] Querying order with token:', token);

    // Create query with timeout
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('trackingToken', '==', token));

    // Race between query and timeout (10 seconds)
    const queryPromise = getDocs(q);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), 10000)
    );

    const querySnapshot = await Promise.race([queryPromise, timeoutPromise]);

    if (querySnapshot.empty) {
      console.log('[OrderTracking] No order found with token:', token);
      return null;
    }

    // Get first matching order (tokens should be unique)
    const orderDoc = querySnapshot.docs[0];
    const orderData = { id: orderDoc.id, ...orderDoc.data() };

    console.log('[OrderTracking] Order found:', orderData.orderNumber);

    // Return only public-safe fields (filter out sensitive info)
    return {
      id: orderData.id,
      orderNumber: orderData.orderNumber,
      client: orderData.client,
      phone: orderData.phone,
      orderStatus: orderData.orderStatus,
      deliveryDate: orderData.deliveryDate,
      services: orderData.services,
      shoePairs: orderData.shoePairs,
      otherItems: orderData.otherItems,
      products: orderData.products,
      photos: orderData.photos,
      totalPrice: orderData.totalPrice,
      advancePayment: orderData.advancePayment,
      paymentStatus: orderData.paymentStatus,
      paymentMethod: orderData.paymentMethod,
      priority: orderData.priority,
      createdAt: orderData.createdAt,
      updatedAt: orderData.updatedAt,
      // Exclude sensitive fields like: employee notes, internal costs, etc.
    };
  } catch (error) {
    console.error('Error getting order by tracking token:', error);
    throw error;
  }
};
