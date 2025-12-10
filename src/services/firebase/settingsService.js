import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== BUSINESS PROFILE & SETTINGS ====================

/**
 * Save business profile to Firestore
 * @param {Object} profileData - Business profile data
 * @returns {Promise<Object>} Saved profile data
 */
export const saveBusinessProfile = async (profileData) => {
  try {
    // Prepare profile data
    const profile = {
      businessName: profileData.businessName || '',
      phone: profileData.phone || '',
      address: profileData.address || '',
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore (document with fixed ID)
    const profileRef = doc(db, 'settings', 'business-profile');
    await setDoc(profileRef, profile, { merge: true });

    return profile;
  } catch (error) {
    console.error('Error saving business profile:', error);
    throw error;
  }
};

/**
 * Get business profile from Firestore
 * @returns {Promise<Object>} Business profile data
 */
export const getBusinessProfile = async () => {
  try {
    const profileRef = doc(db, 'settings', 'business-profile');
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      return profileSnap.data();
    } else {
      // Return default profile if doesn't exist
      return {
        businessName: 'Clean Master Shoes',
        phone: '',
        address: ''
      };
    }
  } catch (error) {
    console.error('Error getting business profile:', error);
    throw error;
  }
};

/**
 * Save WhatsApp configuration to Firestore
 * @param {Object} configData - WhatsApp configuration data
 * @returns {Promise<Object>} Saved configuration
 */
export const saveWhatsAppConfig = async (configData) => {
  try {
    // Prepare config data
    const config = {
      enableOrderReceived: configData.enableOrderReceived ?? true,
      enableDeliveryReady: configData.enableDeliveryReady ?? true,
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore (document with fixed ID)
    const configRef = doc(db, 'settings', 'whatsapp-config');
    await setDoc(configRef, config, { merge: true });

    return config;
  } catch (error) {
    console.error('Error saving WhatsApp config:', error);
    throw error;
  }
};

/**
 * Get WhatsApp configuration from Firestore
 * @returns {Promise<Object>} WhatsApp configuration data
 */
export const getWhatsAppConfig = async () => {
  try {
    const configRef = doc(db, 'settings', 'whatsapp-config');
    const configSnap = await getDoc(configRef);

    if (configSnap.exists()) {
      return configSnap.data();
    } else {
      // Return default config if doesn't exist
      return {
        enableOrderReceived: true,
        enableDeliveryReady: true
      };
    }
  } catch (error) {
    console.error('Error getting WhatsApp config:', error);
    throw error;
  }
};

/**
 * Get all settings documents from Firestore
 * @returns {Promise<Array>} All settings documents
 */
export const getAllSettings = async () => {
  try {
    const settingsRef = collection(db, 'settings');
    const querySnapshot = await getDocs(settingsRef);

    const settings = [];
    querySnapshot.forEach((doc) => {
      settings.push({ id: doc.id, ...doc.data() });
    });

    return settings;
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
};
