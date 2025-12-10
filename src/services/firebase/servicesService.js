import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== SERVICES ====================

/**
 * Get all services
 * @returns {Promise<Array>} Array of services
 */
export const getAllServices = async () => {
  try {
    const servicesRef = collection(db, 'services');
    const querySnapshot = await getDocs(servicesRef);

    const services = [];
    querySnapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });

    return services;
  } catch (error) {
    console.error('Error getting services:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time services updates
 * @param {Function} callback - Function to call when services change
 * @returns {Function} Unsubscribe function
 */
export const subscribeToServices = (callback) => {
  try {
    const servicesRef = collection(db, 'services');

    return onSnapshot(servicesRef, (snapshot) => {
      const services = [];
      snapshot.forEach((doc) => {
        services.push({ id: doc.id, ...doc.data() });
      });
      callback(services);
    }, (error) => {
      console.error('Error in services subscription:', error);
    });
  } catch (error) {
    console.error('Error subscribing to services:', error);
    throw error;
  }
};

/**
 * Add a new service
 * @param {Object} serviceData - Service data
 * @returns {Promise<string>} Document ID of the created service
 */
export const addService = async (serviceData) => {
  try {
    const servicesRef = collection(db, 'services');
    const docRef = await addDoc(servicesRef, {
      ...serviceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

/**
 * Update an existing service
 * @param {string} serviceId - Service document ID
 * @param {Object} serviceData - Updated service data
 */
export const updateService = async (serviceId, serviceData) => {
  try {
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, {
      ...serviceData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

/**
 * Check if a service can be deleted (not referenced in active orders)
 * @param {string} serviceId - Service document ID
 * @returns {Promise<{canDelete: boolean, orderCount: number}>}
 */
export const canDeleteService = async (serviceId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const activeStatuses = ['recibidos', 'proceso', 'listos', 'enEntrega'];

    // Optimized: Query only active orders
    const q = query(ordersRef, where('orderStatus', 'in', activeStatuses));
    const querySnapshot = await getDocs(q);

    let orderCount = 0;

    querySnapshot.forEach((doc) => {
      const order = doc.data();
      // Check if any service in the order references this serviceId
      const hasService = order.services?.some(service => service.serviceId === serviceId);
      if (hasService) {
        orderCount++;
      }
    });

    return {
      canDelete: orderCount === 0,
      orderCount
    };
  } catch (error) {
    console.error('Error checking if service can be deleted:', error);
    throw error;
  }
};

/**
 * Delete a service
 * @param {string} serviceId - Service document ID
 */
export const deleteService = async (serviceId) => {
  try {
    // Validate that service can be deleted
    const validation = await canDeleteService(serviceId);
    if (!validation.canDelete) {
      throw new Error(`No se puede eliminar este servicio. Está referenciado en ${validation.orderCount} orden(es) activa(s).`);
    }

    const serviceRef = doc(db, 'services', serviceId);
    await deleteDoc(serviceRef);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};
