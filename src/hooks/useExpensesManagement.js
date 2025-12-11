import { useState, useCallback } from 'react';
import { useNotification } from './useNotification';
import { generateTransactionId } from '../utils/expenses/expenseHelpers';

/**
 * Hook genérico y reutilizable para manejar gastos
 * Incluye estado de gastos, modal, confirmDialog y handlers
 *
 * @returns {Object} Estado y handlers para gestión de gastos
 */
export function useExpensesManagement() {
  const { showSuccess, showError } = useNotification();

  const [expenses, setExpenses] = useState([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  /**
   * Agrega un nuevo gasto
   */
  const handleAddExpense = useCallback((expenseData) => {
    try {
      const newExpense = {
        ...expenseData,
        id: generateTransactionId('exp')
      };
      setExpenses(prev => [...prev, newExpense]);
      showSuccess('Gasto agregado exitosamente');
      setIsExpenseModalOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      showError('Error al agregar el gasto');
    }
  }, [showSuccess, showError]);

  /**
   * Elimina un gasto (con confirmación)
   */
  const handleDeleteExpense = useCallback((expenseId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Gasto',
      message: '¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.',
      onConfirm: () => {
        try {
          setExpenses(prev => prev.filter(exp => exp.id !== expenseId));
          showSuccess('Gasto eliminado');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting expense:', error);
          showError('Error al eliminar el gasto');
        }
      }
    });
  }, [showSuccess, showError]);

  /**
   * Cierra el dialog de confirmación
   */
  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * Abre el modal de agregar gasto
   */
  const openExpenseModal = useCallback(() => {
    setIsExpenseModalOpen(true);
  }, []);

  /**
   * Cierra el modal de agregar gasto
   */
  const closeExpenseModal = useCallback(() => {
    setIsExpenseModalOpen(false);
  }, []);

  /**
   * Resetea los gastos (útil después de cerrar caja)
   */
  const resetExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  /**
   * Carga gastos desde datos guardados (útil para draft)
   */
  const loadExpenses = useCallback((expensesData) => {
    if (expensesData && Array.isArray(expensesData)) {
      setExpenses(expensesData);
    }
  }, []);

  return {
    // Estado
    expenses,
    isExpenseModalOpen,
    confirmDialog,

    // Handlers principales
    handleAddExpense,
    handleDeleteExpense,

    // Handlers de UI
    openExpenseModal,
    closeExpenseModal,
    closeConfirmDialog,

    // Utilidades
    resetExpenses,
    loadExpenses
  };
}
