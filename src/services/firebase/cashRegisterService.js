import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
  query,
  onSnapshot,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== CASH REGISTER ====================

/**
 * Save or update cash register draft for today
 * @param {Object} draftData - Draft data
 * @returns {Promise<void>}
 */
export const saveCashRegisterDraft = async (draftData) => {
  try {
    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const draftRef = doc(db, 'cashRegisterDrafts', today);

    await setDoc(draftRef, {
      ...draftData,
      fecha: today,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving cash register draft:', error);
    throw error;
  }
};

/**
 * Subscribe to today's cash register draft
 * @param {Function} callback - Callback function that receives draft data
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCashRegisterDraft = (callback) => {
  try {
    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const draftRef = doc(db, 'cashRegisterDrafts', today);

    return onSnapshot(draftRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Error in draft subscription:', error);
      callback(null);
    });
  } catch (error) {
    console.error('Error subscribing to cash register draft:', error);
    return () => {};
  }
};

/**
 * Delete today's cash register draft
 * @returns {Promise<void>}
 */
export const deleteCashRegisterDraft = async () => {
  try {
    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const draftRef = doc(db, 'cashRegisterDrafts', today);
    await deleteDoc(draftRef);
  } catch (error) {
    console.error('Error deleting cash register draft:', error);
    throw error;
  }
};

/**
 * Save a cash register closure (corte de caja)
 * @param {Object} closureData - Closure data
 * @returns {Promise<string>} Document ID of the created closure
 */
export const saveCashRegisterClosure = async (closureData) => {
  try {
    const closuresRef = collection(db, 'cash-register-closures');
    const docRef = await addDoc(closuresRef, {
      ...closureData,
      createdAt: new Date().toISOString(),
      // Cortes son inmutables (solo lectura)
      readonly: true
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving cash register closure:', error);
    throw error;
  }
};

/**
 * Get all cash register closures
 * @returns {Promise<Array>} Array of closures
 */
export const getAllCashRegisterClosures = async () => {
  try {
    const closuresRef = collection(db, 'cash-register-closures');
    const q = query(closuresRef, orderBy('fechaCorte', 'desc'));
    const querySnapshot = await getDocs(q);

    const closures = [];
    querySnapshot.forEach((doc) => {
      closures.push({ id: doc.id, ...doc.data() });
    });

    return closures;
  } catch (error) {
    console.error('Error getting cash register closures:', error);
    throw error;
  }
};

/**
 * Get the last cash register closure
 * @returns {Promise<Object|null>} Last closure or null if none exists
 */
export const getLastCashRegisterClosure = async () => {
  try {
    const closuresRef = collection(db, 'cash-register-closures');
    const q = query(closuresRef, orderBy('fechaCorte', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting last cash register closure:', error);
    throw error;
  }
};

/**
 * Subscribe to cash register closures real-time updates
 * @param {Function} callback - Callback function that receives closures array
 * @returns {Function} Unsubscribe function
 */
export const subscribeToCashRegisterClosures = (callback) => {
  try {
    const closuresRef = collection(db, 'cash-register-closures');
    const q = query(closuresRef, orderBy('fechaCorte', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const closures = [];
      snapshot.forEach((doc) => {
        closures.push({ id: doc.id, ...doc.data() });
      });
      callback(closures);
    }, (error) => {
      console.error('Error in cash register closures subscription:', error);
    });
  } catch (error) {
    console.error('Error subscribing to cash register closures:', error);
    throw error;
  }
};
