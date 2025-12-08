import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/payments/paymentHelpers';

/**
 * Componente que muestra la comparación entre dinero contado y dinero en sistema
 */
const SystemComparison = ({ dineroEnSistema, diferencias }) => {
  return (
    <div className="cr-section">
      <div className="cr-section-header">
        <h3>💻 Dinero en Caja (Sistema)</h3>
      </div>

      <div className="cr-comparison-grid">
        <div className="cr-comparison-row">
          <span className="cr-comp-label">💵 Efectivo en Sistema(caja inicial + órdenes):</span>
          <span className="cr-comp-amount">{formatCurrency(dineroEnSistema.efectivo)}</span>
          <span className={`cr-comp-diff ${diferencias.efectivo >= 0 ? 'positive' : 'negative'}`}>
            {diferencias.efectivo >= 0 ? '+' : ''}{formatCurrency(diferencias.efectivo)}
          </span>
        </div>
        <div className="cr-comparison-row">
          <span className="cr-comp-label">💳 Tarjeta en Sistema:</span>
          <span className="cr-comp-amount">{formatCurrency(dineroEnSistema.tarjeta)}</span>
          <span className={`cr-comp-diff ${diferencias.tarjeta >= 0 ? 'positive' : 'negative'}`}>
            {diferencias.tarjeta >= 0 ? '+' : ''}{formatCurrency(diferencias.tarjeta)}
          </span>
        </div>
        <div className="cr-comparison-row">
          <span className="cr-comp-label">🏦 Transferencia en Sistema:</span>
          <span className="cr-comp-amount">{formatCurrency(dineroEnSistema.transferencia)}</span>
          <span className={`cr-comp-diff ${diferencias.transferencia >= 0 ? 'positive' : 'negative'}`}>
            {diferencias.transferencia >= 0 ? '+' : ''}{formatCurrency(diferencias.transferencia)}
          </span>
        </div>
        <div className="cr-comparison-row total">
          <span className="cr-comp-label">💰 Total en Sistema:</span>
          <span className="cr-comp-amount">{formatCurrency(dineroEnSistema.total)}</span>
          <span className={`cr-comp-diff ${diferencias.total >= 0 ? 'positive' : 'negative'}`}>
            {diferencias.total >= 0 ? '+' : ''}{formatCurrency(diferencias.total)}
          </span>
        </div>
      </div>

      {diferencias.total !== 0 && (
        <div className={`cr-alert ${diferencias.total >= 0 ? 'info' : 'warning'}`}>
          {diferencias.total > 0 ? '✅' : '⚠️'} Diferencia total: {diferencias.total > 0 ? 'Sobrante' : 'Faltante'} de {formatCurrency(Math.abs(diferencias.total))}
        </div>
      )}
    </div>
  );
};

SystemComparison.propTypes = {
  dineroEnSistema: PropTypes.shape({
    efectivo: PropTypes.number.isRequired,
    tarjeta: PropTypes.number.isRequired,
    transferencia: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired,
  diferencias: PropTypes.shape({
    efectivo: PropTypes.number.isRequired,
    tarjeta: PropTypes.number.isRequired,
    transferencia: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired
};

export default SystemComparison;
