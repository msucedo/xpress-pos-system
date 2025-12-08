import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/payments/paymentHelpers';
import { formatDate } from '../../utils/orders/orderHelpers';

/**
 * Componente que muestra la lista de retiros con opción de agregar y eliminar
 */
const WithdrawalsList = ({
  withdrawals,
  totalWithdrawals,
  onOpenModal,
  onDeleteWithdrawal
}) => {
  return (
    <div className="cr-section">
      <div className="cr-section-header">
        <h3>💸 Retiros del Periodo</h3>
        <button
          className="cr-btn-add"
          onClick={onOpenModal}
        >
          + Agregar Retiro
        </button>
      </div>

      <div className="cr-expenses-summary">
        <div className="cr-expense-total">
          Total Retiros: <span>{formatCurrency(totalWithdrawals)}</span>
        </div>
      </div>

      {withdrawals.length > 0 ? (
        <div className="cr-expenses-list">
          {withdrawals.map(withdrawal => (
            <div key={withdrawal.id} className="cr-expense-item">
              <div className="cr-expense-icon">💸</div>
              <div className="cr-expense-info">
                <div className="cr-expense-concept">{withdrawal.concept}</div>
                <div className="cr-expense-details">
                  {formatDate(withdrawal.date)}
                </div>
                {withdrawal.notes && (
                  <div className="cr-expense-notes">{withdrawal.notes}</div>
                )}
              </div>
              <div className="cr-expense-amount">{formatCurrency(withdrawal.amount)}</div>
              <button
                className="cr-expense-delete"
                onClick={() => onDeleteWithdrawal(withdrawal.id)}
                title="Eliminar retiro"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="cr-empty-state">
          <div className="cr-empty-icon">💸</div>
          <div className="cr-empty-text">No hay retiros registrados en este periodo</div>
          <button
            className="cr-btn-add-empty"
            onClick={onOpenModal}
          >
            + Agregar Primer Retiro
          </button>
        </div>
      )}
    </div>
  );
};

WithdrawalsList.propTypes = {
  withdrawals: PropTypes.array.isRequired,
  totalWithdrawals: PropTypes.number.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  onDeleteWithdrawal: PropTypes.func.isRequired
};

export default WithdrawalsList;
