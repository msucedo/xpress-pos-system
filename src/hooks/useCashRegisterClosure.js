import { useState, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import {
  saveCashRegisterClosure,
  deleteCashRegisterDraft
} from '../services/firebaseService';
import { buildClosureData, validateClosureData } from '../utils/cash/closureHelpers';

/**
 * Hook para manejar la lógica de cierre de caja
 *
 * @param {Object} params - Parámetros necesarios para el cierre
 * @param {Array} params.employees - Array de empleados disponibles
 * @param {Array} params.orders - Array de órdenes del periodo
 * @param {Object} params.calculations - Objeto con todos los cálculos (de useCashRegisterCalculations)
 * @param {Object} params.counting - Objeto con datos de conteo (de useCashCounting)
 * @param {Array} params.expenses - Array de gastos
 * @param {Array} params.withdrawals - Array de retiros
 * @param {Function} params.onClosureSuccess - Callback a ejecutar después de cerrar exitosamente
 * @returns {Object} Estado y handlers para cierre de caja
 */
export function useCashRegisterClosure({
  employees,
  orders,
  calculations,
  counting,
  expenses,
  withdrawals,
  onClosureSuccess
}) {
  const { showSuccess, showError } = useNotification();

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [notes, setNotes] = useState('');
  const [habilitarCorteSinValidacion, setHabilitarCorteSinValidacion] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Maneja el cierre de caja
   */
  const handleCloseCashRegister = useCallback(() => {
    // Buscar empleado seleccionado
    const employee = employees.find(emp => emp.id === selectedEmployee);

    // Validar datos del cierre
    const validation = validateClosureData(
      employee,
      orders,
      calculations.diferencias.total,
      habilitarCorteSinValidacion
    );

    if (!validation.isValid) {
      showError(validation.error);
      return;
    }

    // Mostrar confirmación
    setConfirmDialog({
      isOpen: true,
      title: 'Cerrar Corte de Caja',
      message: '¿Deseas cerrar el corte de caja del día? Esta acción guardará el corte como solo lectura.',
      onConfirm: async () => {
        try {
          setIsClosing(true);

          // Construir objeto de closure
          const closureData = buildClosureData({
            employee,
            dineroInicial: parseFloat(counting.dineroInicial) || 0,
            efectivoFinal: calculations.efectivoFinal,
            billetes: counting.billetes,
            monedas: counting.monedas,
            efectivoContado: calculations.efectivoContado,
            cobrosTarjeta: counting.cobrosTarjeta,
            tarjetaContada: calculations.tarjetaContada,
            transferencias: counting.transferencias,
            transferenciaContada: calculations.transferenciaContada,
            totalConteoIngresos: calculations.totalConteoIngresos,
            dineroEnSistema: calculations.dineroEnSistema,
            diferencias: calculations.diferencias,
            expenses,
            totalExpenses: calculations.totalExpenses,
            withdrawals,
            totalWithdrawals: calculations.totalWithdrawals,
            ingresosAcumuladosDia: calculations.ingresosAcumuladosDia,
            gananciaDia: calculations.gananciaDia,
            orders,
            summary: calculations.summary,
            notes
          });

          // Guardar cierre en Firebase
          await saveCashRegisterClosure(closureData);

          // Eliminar borrador
          await deleteCashRegisterDraft();

          showSuccess('Corte de caja cerrado exitosamente');

          // Cerrar dialog de confirmación
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));

          // Llamar callback de éxito (para resetear estados en el componente padre)
          if (onClosureSuccess) {
            onClosureSuccess();
          }

          // Resetear estados locales
          setSelectedEmployee('');
          setNotes('');
          setHabilitarCorteSinValidacion(false);
        } catch (error) {
          console.error('Error closing cash register:', error);
          showError('Error al cerrar el corte de caja');
        } finally {
          setIsClosing(false);
        }
      }
    });
  }, [
    employees,
    selectedEmployee,
    orders,
    calculations,
    counting,
    expenses,
    withdrawals,
    notes,
    habilitarCorteSinValidacion,
    showSuccess,
    showError,
    onClosureSuccess
  ]);

  /**
   * Cierra el dialog de confirmación
   */
  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * Resetea los estados de cierre
   */
  const resetClosureState = useCallback(() => {
    setSelectedEmployee('');
    setNotes('');
    setHabilitarCorteSinValidacion(false);
  }, []);

  /**
   * Carga estados desde draft
   */
  const loadClosureState = useCallback((data) => {
    if (data) {
      setSelectedEmployee(data.selectedEmployee || '');
      setNotes(data.notes || '');
    }
  }, []);

  /**
   * Verifica si el botón de cierre debe estar deshabilitado
   */
  const isCloseButtonDisabled = useCallback(() => {
    if (!selectedEmployee) return true;
    if (isClosing) return true;
    if (habilitarCorteSinValidacion) return false;
    if (orders.length === 0) return true;
    if (calculations.diferencias.total !== 0) return true;
    return false;
  }, [selectedEmployee, isClosing, habilitarCorteSinValidacion, orders, calculations]);

  return {
    // Estado
    selectedEmployee,
    notes,
    habilitarCorteSinValidacion,
    confirmDialog,
    isClosing,

    // Setters
    setSelectedEmployee,
    setNotes,
    setHabilitarCorteSinValidacion,

    // Handlers
    handleCloseCashRegister,
    closeConfirmDialog,

    // Utilidades
    resetClosureState,
    loadClosureState,
    isCloseButtonDisabled: isCloseButtonDisabled()
  };
}
