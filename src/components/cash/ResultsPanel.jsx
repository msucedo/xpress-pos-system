import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/payments/paymentHelpers';

/**
 * Componente que muestra los resultados finales del corte
 */
const ResultsPanel = ({
  ingresosAcumuladosDia,
  totalExpenses,
  gananciaDia,
  lastClosureToday,
  expensesCount
}) => {
  return (
    <div className="cr-section">
      <div className="cr-section-header">
        <h3>📈 Resultados</h3>
      </div>

      <div className="cr-results-grid">
        <div className="cr-result-card">
          <div className="cr-result-icon">💰</div>
          <div className="cr-result-info">
            <div className="cr-result-label">Total Ingresos del Día</div>
            <div className="cr-result-sublabel">
              {lastClosureToday ? 'Acumulado de todos los cortes' : 'Efectivo + Tarjeta + Transferencia'}
            </div>
            <div className="cr-result-value">{formatCurrency(ingresosAcumuladosDia)}</div>
          </div>
        </div>

        <div className="cr-result-card">
          <div className="cr-result-icon">📝</div>
          <div className="cr-result-info">
            <div className="cr-result-label">Gastos Totales</div>
            <div className="cr-result-sublabel">{expensesCount} gastos</div>
            <div className="cr-result-value expense">{formatCurrency(totalExpenses)}</div>
          </div>
        </div>

        <div className="cr-result-card highlight">
          <div className="cr-result-icon">🎯</div>
          <div className="cr-result-info">
            <div className="cr-result-label">Ganancia del Día</div>
            <div className="cr-result-sublabel">Total Ingresos - Gastos</div>
            <div className={`cr-result-value ${gananciaDia >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(gananciaDia)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ResultsPanel.propTypes = {
  ingresosAcumuladosDia: PropTypes.number.isRequired,
  totalExpenses: PropTypes.number.isRequired,
  gananciaDia: PropTypes.number.isRequired,
  lastClosureToday: PropTypes.object,
  expensesCount: PropTypes.number.isRequired
};

export default ResultsPanel;
