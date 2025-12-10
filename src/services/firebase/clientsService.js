import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  onSnapshot,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== CLIENTS ====================

/**
 * Get all clients
 * @returns {Promise<Array>} Array of clients
 */
export const getAllClients = async () => {
  try {
    const clientsRef = collection(db, 'clients');
    const querySnapshot = await getDocs(clientsRef);

    const clients = [];
    querySnapshot.forEach((doc) => {
      clients.push({ id: doc.id, ...doc.data() });
    });

    return clients;
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time clients updates
 * @param {Function} callback - Function to call when clients change
 * @returns {Function} Unsubscribe function
 */
export const subscribeToClients = (callback) => {
  try {
    const clientsRef = collection(db, 'clients');

    return onSnapshot(clientsRef, (snapshot) => {
      const clients = [];
      snapshot.forEach((doc) => {
        clients.push({ id: doc.id, ...doc.data() });
      });
      callback(clients);
    }, (error) => {
      console.error('Error in clients subscription:', error);
    });
  } catch (error) {
    console.error('Error subscribing to clients:', error);
    throw error;
  }
};

/**
 * Find client by phone number
 * @param {string} phone - Phone number to search
 * @returns {Promise<Object|null>} Client object if found, null otherwise
 */
export const findClientByPhone = async (phone) => {
  try {
    const clientsRef = collection(db, 'clients');
    const q = query(clientsRef, where('phone', '==', phone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error finding client by phone:', error);
    throw error;
  }
};

/**
 * Find client by name (case-insensitive)
 * @param {string} name - Client name to search
 * @returns {Promise<Object|null>} Client object if found, null otherwise
 */
export const findClientByName = async (name) => {
  try {
    const clientsRef = collection(db, 'clients');
    const querySnapshot = await getDocs(clientsRef);

    // Buscar manualmente porque Firestore no soporta búsqueda case-insensitive directa
    let foundClient = null;
    querySnapshot.forEach((doc) => {
      const clientData = doc.data();
      if (clientData.name && clientData.name.toLowerCase() === name.toLowerCase()) {
        foundClient = { id: doc.id, ...clientData };
      }
    });

    return foundClient;
  } catch (error) {
    console.error('Error finding client by name:', error);
    throw error;
  }
};

/**
 * Add a new client
 * @param {Object} clientData - Client data
 * @returns {Promise<string>} Document ID of the created client
 */
export const addClient = async (clientData) => {
  try {
    const clientsRef = collection(db, 'clients');
    const docRef = await addDoc(clientsRef, {
      ...clientData,
      orders: 0,
      debt: 0,
      isVip: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding client:', error);
    throw error;
  }
};

/**
 * Update an existing client
 * @param {string} clientId - Client document ID
 * @param {Object} clientData - Updated client data
 */
export const updateClient = async (clientId, clientData) => {
  try {
    const clientRef = doc(db, 'clients', clientId);
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

/**
 * Check if a client can be deleted (not referenced in active orders)
 * @param {string} clientId - Client document ID
 * @returns {Promise<{canDelete: boolean, orderCount: number}>}
 */
export const canDeleteClient = async (clientId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const activeStatuses = ['recibidos', 'proceso', 'listos', 'enEntrega'];

    // Optimized: Query only active orders for this specific client
    const q = query(
      ordersRef,
      where('clientId', '==', clientId),
      where('orderStatus', 'in', activeStatuses),
      limit(1) // We only need to know if at least one exists
    );
    const querySnapshot = await getDocs(q);

    const orderCount = querySnapshot.size;

    return {
      canDelete: orderCount === 0,
      orderCount
    };
  } catch (error) {
    console.error('Error checking if client can be deleted:', error);
    throw error;
  }
};

/**
 * Delete a client
 * @param {string} clientId - Client document ID
 */
export const deleteClient = async (clientId) => {
  try {
    // Validate that client can be deleted
    const validation = await canDeleteClient(clientId);
    if (!validation.canDelete) {
      throw new Error(`No se puede eliminar este cliente. Tiene ${validation.orderCount} orden(es) activa(s).`);
    }

    const clientRef = doc(db, 'clients', clientId);
    await deleteDoc(clientRef);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};
