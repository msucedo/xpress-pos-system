import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import ExpenseForm from './ExpenseForm';
import WithdrawalForm from './WithdrawalForm';
import { ConfirmDialog } from './animated';
import { Icon } from '../icons';
import { subscribeToCashRegisterDraft } from '../services/firebaseService';
import { useCashRegisterDraft } from '../hooks/useCashRegisterDraft';
import { useCashRegisterData } from '../hooks/useCashRegisterData';
import { useCashCounting } from '../hooks/useCashCounting';
import { useExpensesManagement } from '../hooks/useExpensesManagement';
import { useWithdrawalsManagement } from '../hooks/useWithdrawalsManagement';
import { useCashRegisterCalculations } from '../hooks/useCashRegisterCalculations';
import { useCashRegisterClosure } from '../hooks/useCashRegisterClosure';
import FinancialSummary from './cash/FinancialSummary';
import IncomeCounting from './cash/IncomeCounting';
import SystemComparison from './cash/SystemComparison';
import ResultsPanel from './cash/ResultsPanel';
import WithdrawalsList from './cash/WithdrawalsList';
import ExpensesList from './cash/ExpensesList';
import ClosureSection from './cash/ClosureSection';
import './CashRegister.css';

// eslint-disable-next-line no-unused-vars
const CashRegister = ({ orders, dateFilter }) => {
  // ===== HOOKS DE DATOS =====
  const { employees, closures } = useCashRegisterData();

  // ===== HOOKS DE ESTADO =====
  const counting = useCashCounting();
  const expensesManager = useExpensesManagement();
  const withdrawalsManager = useWithdrawalsManagement();

  // ===== AUTO-SAVE (Draft) =====
  const draftData = {
    dineroInicial: counting.dineroInicial,
    billetes: counting.billetes,
    monedas: counting.monedas,
    cobrosTarjeta: counting.cobrosTarjeta,
    transferencias: counting.transferencias,
    gastos: expensesManager.expenses,
    retiros: withdrawalsManager.withdrawals,
    notes: '', // Se manejará en closure hook
    selectedEmployee: '' // Se manejará en closure hook
  };

  const { isPending: isSaving, isError: hasSaveError, isSuccess, debouncedSave } = useCashRegisterDraft(draftData);

  // Trigger debounced save when data changes
  useEffect(() => {
    debouncedSave(draftData);
  }, [
    counting.dineroInicial,
    counting.billetes,
    counting.monedas,
    counting.cobrosTarjeta,
    counting.transferencias,
    expensesManager.expenses,
    withdrawalsManager.withdrawals,
    debouncedSave
  ]);

  // ===== CÁLCULOS DERIVADOS =====
  const calculations = useCashRegisterCalculations({
    orders,
    closures,
    billetes: counting.billetes,
    monedas: counting.monedas,
    cobrosTarjeta: counting.cobrosTarjeta,
    transferencias: counting.transferencias,
    dineroInicial: counting.dineroInicial,
    expenses: expensesManager.expenses,
    withdrawals: withdrawalsManager.withdrawals
  });

  // ===== LÓGICA DE CIERRE =====
  const handleClosureSuccess = useCallback(() => {
    // Resetear todos los estados después de un cierre exitoso
    counting.resetCounting();
    expensesManager.resetExpenses();
    withdrawalsManager.resetWithdrawals();
  }, [counting, expensesManager, withdrawalsManager]);

  const closure = useCashRegisterClosure({
    employees,
    orders,
    calculations,
    counting,
    expenses: expensesManager.expenses,
    withdrawals: withdrawalsManager.withdrawals,
    onClosureSuccess: handleClosureSuccess
  });

  // ===== SUBSCRIBE TO DRAFT ON MOUNT =====
  useEffect(() => {
    const unsubscribe = subscribeToCashRegisterDraft((draftData) => {
      if (draftData) {
        // Load counting data
        counting.loadCountingData(draftData);
        // Load expenses and withdrawals
        expensesManager.loadExpenses(draftData.gastos);
        withdrawalsManager.loadWithdrawals(draftData.retiros);
        // Load closure state
        closure.loadClosureState(draftData);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cash-register">
      {/* Financial Summary Section */}
      <FinancialSummary
        ingresosAcumuladosDia={calculations.ingresosAcumuladosDia}
        efectivoDisponible={calculations.efectivoDisponible}
        retirosAcumuladosDia={calculations.retirosAcumuladosDia}
        gastosAcumuladosDia={calculations.gastosAcumuladosDia}
        tarjetaContada={calculations.tarjetaContada}
        transferenciaContada={calculations.transferenciaContada}
        summary={calculations.summary}
      />

      {/* Income Counting Section */}
      <IncomeCounting
        dineroInicial={counting.dineroInicial}
        setDineroInicial={counting.setDineroInicial}
        billetes={counting.billetes}
        incrementarBillete={counting.incrementarBillete}
        decrementarBillete={counting.decrementarBillete}
        monedas={counting.monedas}
        incrementarMoneda={counting.incrementarMoneda}
        decrementarMoneda={counting.decrementarMoneda}
        cobrosTarjeta={counting.cobrosTarjeta}
        handleCobroTarjetaChange={counting.handleCobroTarjetaChange}
        handleTipoTarjetaChange={counting.handleTipoTarjetaChange}
        agregarCobroTarjeta={counting.agregarCobroTarjeta}
        eliminarCobroTarjeta={counting.eliminarCobroTarjeta}
        transferencias={counting.transferencias}
        handleTransferenciaChange={counting.handleTransferenciaChange}
        agregarTransferencia={counting.agregarTransferencia}
        eliminarTransferencia={counting.eliminarTransferencia}
        efectivoContado={calculations.efectivoContado}
        tarjetaContada={calculations.tarjetaContada}
        transferenciaContada={calculations.transferenciaContada}
        totalConteoIngresos={calculations.totalConteoIngresos}
      />

      {/* System Comparison Section */}
      <SystemComparison
        dineroEnSistema={calculations.dineroEnSistema}
        diferencias={calculations.diferencias}
      />

      {/* Results Section */}
      <ResultsPanel
        ingresosAcumuladosDia={calculations.ingresosAcumuladosDia}
        totalExpenses={calculations.totalExpenses}
        gananciaDia={calculations.gananciaDia}
        lastClosureToday={calculations.lastClosureToday}
        expensesCount={expensesManager.expenses.length}
      />

      {/* Withdrawals Section */}
      <WithdrawalsList
        withdrawals={withdrawalsManager.withdrawals}
        totalWithdrawals={calculations.totalWithdrawals}
        onOpenModal={withdrawalsManager.openWithdrawalModal}
        onDeleteWithdrawal={withdrawalsManager.handleDeleteWithdrawal}
      />

      {/* Expenses Section */}
      <ExpensesList
        expenses={expensesManager.expenses}
        totalExpenses={calculations.totalExpenses}
        onOpenModal={expensesManager.openExpenseModal}
        onDeleteExpense={expensesManager.handleDeleteExpense}
      />

      {/* Closure Section */}
      <ClosureSection
        employees={employees}
        selectedEmployee={closure.selectedEmployee}
        setSelectedEmployee={closure.setSelectedEmployee}
        notes={closure.notes}
        setNotes={closure.setNotes}
        habilitarCorteSinValidacion={closure.habilitarCorteSinValidacion}
        setHabilitarCorteSinValidacion={closure.setHabilitarCorteSinValidacion}
        isDisabled={closure.isCloseButtonDisabled}
        onClose={closure.handleCloseCashRegister}
      />

      {/* Expense Modal */}
      {expensesManager.isExpenseModalOpen && (
        <Modal
          isOpen={expensesManager.isExpenseModalOpen}
          onClose={expensesManager.closeExpenseModal}
          title="Nuevo Gasto"
        >
          <ExpenseForm
            onSave={expensesManager.handleAddExpense}
            onCancel={expensesManager.closeExpenseModal}
          />
        </Modal>
      )}

      {/* Withdrawal Modal */}
      {withdrawalsManager.isWithdrawalModalOpen && (
        <Modal
          isOpen={withdrawalsManager.isWithdrawalModalOpen}
          onClose={withdrawalsManager.closeWithdrawalModal}
          title="Nuevo Retiro"
        >
          <WithdrawalForm
            efectivoDisponible={calculations.efectivoDisponible}
            onSave={withdrawalsManager.handleAddWithdrawal}
            onCancel={withdrawalsManager.closeWithdrawalModal}
          />
        </Modal>
      )}

      {/* Confirm Dialogs */}
      {expensesManager.confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={expensesManager.confirmDialog.isOpen}
          title={expensesManager.confirmDialog.title}
          message={expensesManager.confirmDialog.message}
          onConfirm={expensesManager.confirmDialog.onConfirm}
          onCancel={expensesManager.closeConfirmDialog}
        />
      )}

      {withdrawalsManager.confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={withdrawalsManager.confirmDialog.isOpen}
          title={withdrawalsManager.confirmDialog.title}
          message={withdrawalsManager.confirmDialog.message}
          onConfirm={withdrawalsManager.confirmDialog.onConfirm}
          onCancel={withdrawalsManager.closeConfirmDialog}
        />
      )}

      {closure.confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={closure.confirmDialog.isOpen}
          title={closure.confirmDialog.title}
          message={closure.confirmDialog.message}
          onConfirm={closure.confirmDialog.onConfirm}
          onCancel={closure.closeConfirmDialog}
        />
      )}

      {/* Auto-save Status Indicator */}
      {(isSaving || isSuccess || hasSaveError) && (
        <div className={`cr-autosave-indicator ${
          hasSaveError ? 'error' :
          isSuccess && !isSaving ? 'saving fade-out' :
          'saving'
        }`}>
          {(isSaving || isSuccess) && (
            <>
              <span className="cr-autosave-spinner"></span>
              <span>Guardando borrador...</span>
            </>
          )}
          {hasSaveError && (
            <>
              <span className="cr-autosave-icon"><Icon name="warning" size={14} /></span>
              <span>Error al guardar</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

CashRegister.propTypes = {
  orders: PropTypes.array.isRequired,
  dateFilter: PropTypes.string.isRequired
};

export default CashRegister;
