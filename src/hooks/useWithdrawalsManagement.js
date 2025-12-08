import { useState, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { generateTransactionId } from '../utils/expenses/expenseHelpers';

/**
 * Hook genérico y reutilizable para manejar retiros
 * Incluye estado de retiros, modal, confirmDialog y handlers
 *
 * @returns {Object} Estado y handlers para gestión de retiros
 */
export function useWithdrawalsManagement() {
  const { showSuccess, showError } = useNotification();

  const [withdrawals, setWithdrawals] = useState([]);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  /**
   * Agrega un nuevo retiro
   */
  const handleAddWithdrawal = useCallback((withdrawalData) => {
    try {
      const newWithdrawal = {
        ...withdrawalData,
        id: generateTransactionId('wit')
      };
      setWithdrawals(prev => [...prev, newWithdrawal]);
      showSuccess('Retiro agregado exitosamente');
      setIsWithdrawalModalOpen(false);
    } catch (error) {
      console.error('Error adding withdrawal:', error);
      showError('Error al agregar el retiro');
    }
  }, [showSuccess, showError]);

  /**
   * Elimina un retiro (con confirmación)
   */
  const handleDeleteWithdrawal = useCallback((withdrawalId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Retiro',
      message: '¿Estás seguro de que deseas eliminar este retiro? Esta acción no se puede deshacer.',
      onConfirm: () => {
        try {
          setWithdrawals(prev => prev.filter(wit => wit.id !== withdrawalId));
          showSuccess('Retiro eliminado');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting withdrawal:', error);
          showError('Error al eliminar el retiro');
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
   * Abre el modal de agregar retiro
   */
  const openWithdrawalModal = useCallback(() => {
    setIsWithdrawalModalOpen(true);
  }, []);

  /**
   * Cierra el modal de agregar retiro
   */
  const closeWithdrawalModal = useCallback(() => {
    setIsWithdrawalModalOpen(false);
  }, []);

  /**
   * Resetea los retiros (útil después de cerrar caja)
   */
  const resetWithdrawals = useCallback(() => {
    setWithdrawals([]);
  }, []);

  /**
   * Carga retiros desde datos guardados (útil para draft)
   */
  const loadWithdrawals = useCallback((withdrawalsData) => {
    if (withdrawalsData && Array.isArray(withdrawalsData)) {
      setWithdrawals(withdrawalsData);
    }
  }, []);

  return {
    // Estado
    withdrawals,
    isWithdrawalModalOpen,
    confirmDialog,

    // Handlers principales
    handleAddWithdrawal,
    handleDeleteWithdrawal,

    // Handlers de UI
    openWithdrawalModal,
    closeWithdrawalModal,
    closeConfirmDialog,

    // Utilidades
    resetWithdrawals,
    loadWithdrawals
  };
}
