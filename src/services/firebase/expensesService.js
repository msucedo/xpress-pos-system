import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

// ==================== EXPENSES ====================

/**
 * Get all expenses
 * @returns {Promise<Array>} Array of expenses
 */
export const getAllExpenses = async () => {
  try {
    const expensesRef = collection(db, 'expenses');
    const querySnapshot = await getDocs(expensesRef);

    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });

    return expenses;
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};
