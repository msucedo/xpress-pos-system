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
  where
} from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== INVENTORY ====================

/**
 * Get all inventory products
 * @returns {Promise<Array>} Array of products
 */
export const getAllInventory = async () => {
  try {
    const inventoryRef = collection(db, 'inventory');
    const querySnapshot = await getDocs(inventoryRef);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (error) {
    console.error('Error getting inventory:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time inventory updates
 * @param {Function} callback - Function to call when inventory changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToInventory = (callback) => {
  try {
    const inventoryRef = collection(db, 'inventory');

    return onSnapshot(inventoryRef, (snapshot) => {
      const products = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      callback(products);
    }, (error) => {
      console.error('Error in inventory subscription:', error);
    });
  } catch (error) {
    console.error('Error subscribing to inventory:', error);
    throw error;
  }
};

/**
 * Check if a barcode already exists in inventory
 * @param {string} barcode - Barcode to check
 * @param {string} excludeProductId - Product ID to exclude from check (for updates)
 * @returns {Promise<boolean>} True if barcode exists
 */
export const checkBarcodeExists = async (barcode, excludeProductId = null) => {
  try {
    // Si el código de barras está vacío, no validar (es opcional)
    if (!barcode || barcode.trim() === '') {
      return false;
    }

    const inventoryRef = collection(db, 'inventory');
    const q = query(inventoryRef, where('barcode', '==', barcode.trim()));
    const querySnapshot = await getDocs(q);

    // Si no encontramos ningún producto con ese código, está disponible
    if (querySnapshot.empty) {
      return false;
    }

    // Si estamos actualizando un producto, excluir el producto actual del check
    if (excludeProductId) {
      // Verificar si el único producto con ese código es el que estamos editando
      const otherProducts = querySnapshot.docs.filter(doc => doc.id !== excludeProductId);
      return otherProducts.length > 0;
    }

    // Si llegamos aquí, el código ya existe
    return true;
  } catch (error) {
    console.error('Error checking barcode:', error);
    throw error;
  }
};

/**
 * Add a new product to inventory
 * @param {Object} productData - Product data
 * @returns {Promise<string>} Document ID of the created product
 */
export const addProduct = async (productData) => {
  try {
    // Validar que el código de barras no exista (si se proporcionó uno)
    if (productData.barcode && productData.barcode.trim() !== '') {
      const barcodeExists = await checkBarcodeExists(productData.barcode);
      if (barcodeExists) {
        throw new Error('Este código de barras ya está registrado en otro producto');
      }
    }

    const inventoryRef = collection(db, 'inventory');
    const docRef = await addDoc(inventoryRef, {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update an existing product in inventory
 * @param {string} productId - Product document ID
 * @param {Object} productData - Updated product data
 */
export const updateProduct = async (productId, productData) => {
  try {
    // Validar que el código de barras no exista en otros productos (si se proporcionó uno)
    if (productData.barcode && productData.barcode.trim() !== '') {
      const barcodeExists = await checkBarcodeExists(productData.barcode, productId);
      if (barcodeExists) {
        throw new Error('Este código de barras ya está registrado en otro producto');
      }
    }

    const productRef = doc(db, 'inventory', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product from inventory
 * @param {string} productId - Product document ID
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'inventory', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Decrease product stock in inventory
 * @param {string} productId - Product document ID
 * @param {number} quantity - Quantity to decrease
 */
export const decreaseProductStock = async (productId, quantity) => {
  try {
    const productRef = doc(db, 'inventory', productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      throw new Error(`Product ${productId} not found`);
    }

    const currentStock = productDoc.data().stock || 0;
    const newStock = currentStock - quantity;

    if (newStock < 0) {
      throw new Error(`Insufficient stock for product ${productId}. Available: ${currentStock}, Requested: ${quantity}`);
    }

    await updateDoc(productRef, {
      stock: newStock,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error decreasing product stock:', error);
    throw error;
  }
};
