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

// ==================== EMPLOYEES ====================

/**
 * Get all employees
 * @returns {Promise<Array>} Array of employees
 */
export const getAllEmployees = async () => {
  try {
    const employeesRef = collection(db, 'employees');
    const querySnapshot = await getDocs(employeesRef);

    const employees = [];
    querySnapshot.forEach((doc) => {
      employees.push({ id: doc.id, ...doc.data() });
    });

    return employees;
  } catch (error) {
    console.error('Error getting employees:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time employees updates
 * @param {Function} callback - Function to call when employees change
 * @returns {Function} Unsubscribe function
 */
export const subscribeToEmployees = (callback) => {
  try {
    const employeesRef = collection(db, 'employees');

    return onSnapshot(employeesRef, (snapshot) => {
      const employees = [];
      snapshot.forEach((doc) => {
        employees.push({ id: doc.id, ...doc.data() });
      });
      callback(employees);
    }, (error) => {
      console.error('Error in employees subscription:', error);
    });
  } catch (error) {
    console.error('Error subscribing to employees:', error);
    throw error;
  }
};

/**
 * Get count of active admin employees
 * @returns {Promise<number>} Count of active admins
 */
export const getAdminCount = async () => {
  try {
    const employeesRef = collection(db, 'employees');
    const q = query(
      employeesRef,
      where('isAdmin', '==', true),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting admin count:', error);
    throw error;
  }
};

/**
 * Get employee by email
 * @param {string} email - Employee email
 * @returns {Promise<Object|null>} Employee data or null if not found
 */
export const getEmployeeByEmail = async (email) => {
  try {
    const employeesRef = collection(db, 'employees');
    const q = query(employeesRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // Return first matching employee (should be unique)
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting employee by email:', error);
    throw error;
  }
};

/**
 * Add a new employee
 * @param {Object} employeeData - Employee data
 * @returns {Promise<string>} Document ID of the created employee
 */
export const addEmployee = async (employeeData) => {
  try {
    const employeesRef = collection(db, 'employees');

    // Check if this is the first employee
    const querySnapshot = await getDocs(employeesRef);
    const isFirstEmployee = querySnapshot.empty;

    const docRef = await addDoc(employeesRef, {
      ...employeeData,
      // First employee is automatically admin
      isAdmin: isFirstEmployee ? true : (employeeData.isAdmin || false),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ [EMPLOYEE] Empleado creado - isAdmin: ${isFirstEmployee ? true : (employeeData.isAdmin || false)}`);

    return docRef.id;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

/**
 * Update an existing employee
 * @param {string} employeeId - Employee document ID
 * @param {Object} employeeData - Updated employee data
 */
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    // Get current employee data
    const employeeRef = doc(db, 'employees', employeeId);
    const employeeSnap = await getDoc(employeeRef);

    if (!employeeSnap.exists()) {
      throw new Error('Empleado no encontrado');
    }

    const currentData = employeeSnap.data();

    // VALIDACIÓN: Si intenta quitar admin y es el único admin activo
    if (
      currentData.isAdmin === true &&
      currentData.status === 'active' &&
      (employeeData.isAdmin === false || employeeData.status === 'inactive')
    ) {
      const adminCount = await getAdminCount();

      if (adminCount <= 1) {
        throw new Error('No se puede desactivar el último administrador. Debe haber al menos un administrador activo en el sistema.');
      }
    }

    await updateDoc(employeeRef, {
      ...employeeData,
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ [EMPLOYEE] Empleado actualizado: ${employeeId}`);
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

/**
 * Check if an employee can be deleted (not assigned to active orders)
 * @param {string} employeeId - Employee document ID
 * @returns {Promise<{canDelete: boolean, orderCount: number}>}
 */
export const canDeleteEmployee = async (employeeId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const activeStatuses = ['recibidos', 'proceso', 'listos', 'enEntrega'];

    // Optimized: Query only active orders for this specific employee
    const q = query(
      ordersRef,
      where('authorId', '==', employeeId),
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
    console.error('Error checking if employee can be deleted:', error);
    throw error;
  }
};

/**
 * Delete an employee
 * @param {string} employeeId - Employee document ID
 */
export const deleteEmployee = async (employeeId) => {
  try {
    // VALIDACIÓN 1: Check if employee has active orders assigned
    const validation = await canDeleteEmployee(employeeId);
    if (!validation.canDelete) {
      throw new Error(`No se puede eliminar este empleado. Tiene ${validation.orderCount} orden(es) asignada(s).`);
    }

    // Get current employee data
    const employeeRef = doc(db, 'employees', employeeId);
    const employeeSnap = await getDoc(employeeRef);

    if (!employeeSnap.exists()) {
      throw new Error('Empleado no encontrado');
    }

    const currentData = employeeSnap.data();

    // VALIDACIÓN 2: No se puede eliminar al último admin activo
    if (currentData.isAdmin === true && currentData.status === 'active') {
      const adminCount = await getAdminCount();

      if (adminCount <= 1) {
        throw new Error('No se puede eliminar el último administrador. Debe haber al menos un administrador activo en el sistema.');
      }
    }

    await deleteDoc(employeeRef);
    console.log(`✅ [EMPLOYEE] Empleado eliminado: ${employeeId}`);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};
