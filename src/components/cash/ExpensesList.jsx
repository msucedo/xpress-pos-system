import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/payments/paymentHelpers';
import { formatDate } from '../../utils/orders/orderHelpers';
import { getCategoryIcon, getCategoryLabel } from '../../utils/expenses/expenseHelpers';

/**
 * Componente que muestra la lista de gastos con opción de agregar y eliminar
 */
const ExpensesList = ({
  expenses,
  totalExpenses,
  onOpenModal,
  onDeleteExpense
}) => {
  return (
    <div className="cr-section">
      <div className="cr-section-header">
        <h3>📝 Gastos del Periodo</h3>
        <button
          className="cr-btn-add"
          onClick={onOpenModal}
        >
          + Agregar Gasto
        </button>
      </div>

      <div className="cr-expenses-summary">
        <div className="cr-expense-total">
          Total Gastos: <span>{formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      {expenses.length > 0 ? (
        <div className="cr-expenses-list">
          {expenses.map(expense => (
            <div key={expense.id} className="cr-expense-item">
              <div className="cr-expense-icon">{getCategoryIcon(expense.category)}</div>
              <div className="cr-expense-info">
                <div className="cr-expense-concept">{expense.concept}</div>
                <div className="cr-expense-details">
                  {getCategoryLabel(expense.category)} • {formatDate(expense.date)}
                </div>
                {expense.notes && (
                  <div className="cr-expense-notes">{expense.notes}</div>
                )}
              </div>
              <div className="cr-expense-amount">{formatCurrency(expense.amount)}</div>
              <button
                className="cr-expense-delete"
                onClick={() => onDeleteExpense(expense.id)}
                title="Eliminar gasto"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="cr-empty-state">
          <div className="cr-empty-icon">📝</div>
          <div className="cr-empty-text">No hay gastos registrados en este periodo</div>
          <button
            className="cr-btn-add-empty"
            onClick={onOpenModal}
          >
            + Agregar Primer Gasto
          </button>
        </div>
      )}
    </div>
  );
};

ExpensesList.propTypes = {
  expenses: PropTypes.array.isRequired,
  totalExpenses: PropTypes.number.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  onDeleteExpense: PropTypes.func.isRequired
};

export default ExpensesList;
