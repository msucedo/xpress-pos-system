import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/payments/paymentHelpers';

/**
 * Componente que muestra el resumen financiero con tarjetas de estadísticas
 */
const FinancialSummary = ({
  ingresosAcumuladosDia,
  efectivoDisponible,
  retirosAcumuladosDia,
  gastosAcumuladosDia,
  tarjetaContada,
  transferenciaContada,
  summary
}) => {
  return (
    <div className="cr-section">
      <div className="cr-section-header">
        <h3>💰 Resumen Financiero</h3>
        <div className="cr-period-badge">Hoy</div>
      </div>

      <div className="cr-stats-grid">
        <div className="cr-stat-card total">
          <div className="cr-stat-icon">💵</div>
          <div className="cr-stat-info">
            <div className="cr-stat-label">Total Ingresos acumulados del día</div>
            <div className="cr-stat-value">
              {formatCurrency(ingresosAcumuladosDia)}
            </div>
          </div>
        </div>

        <div className="cr-stat-card cash">
          <div className="cr-stat-icon">💵</div>
          <div className="cr-stat-info">
            <div className="cr-stat-label">Efectivo Disponible Actual</div>
            <div className="cr-stat-value">
              {formatCurrency(efectivoDisponible)}
            </div>
          </div>
        </div>

        <div className="cr-stat-card withdrawals">
          <div className="cr-stat-icon">💸</div>
          <div className="cr-stat-info">
            <div className="cr-stat-label">Total de Retiros del Día</div>
            <div className="cr-stat-value expense">{formatCurrency(retirosAcumuladosDia)}</div>
          </div>
        </div>

        <div className="cr-stat-card expenses">
          <div className="cr-stat-icon">💸</div>
          <div className="cr-stat-info">
            <div className="cr-stat-label">Total de Gastos del Día</div>
            <div className="cr-stat-value expense">{formatCurrency(gastosAcumuladosDia)}</div>
          </div>
        </div>

        <div className="cr-stat-card card">
          <div className="cr-stat-icon">💳</div>
          <div className="cr-stat-info">
            <div className="cr-stat-label">Ingresos de Tarjeta</div>
            <div className="cr-stat-value">{formatCurrency(tarjetaContada)}</div>
          </div>
        </div>

        <div className="cr-stat-card transfer">
          <div className="cr-stat-icon">🏦</div>
          <div className="cr-stat-info">
            <div className="cr-stat-label">Ingresos de Transferencia</div>
            <div className="cr-stat-value">{formatCurrency(transferenciaContada)}</div>
          </div>
        </div>

        <div className="cr-stat-card orders">
          <div className="cr-stat-icon">📦</div>
          <div className="cr-stat-info">
            <div className="cr-stat-label">Órdenes</div>
            <div className="cr-stat-value">{summary.totalOrders}</div>
          </div>
        </div>

        <div className="cr-stat-card products">
          <div className="cr-stat-icon">🛍️</div>
          <div className="cr-stat-info">
            <div className="cr-stat-label">Productos</div>
            <div className="cr-stat-value">{summary.totalProductos || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

FinancialSummary.propTypes = {
  ingresosAcumuladosDia: PropTypes.number.isRequired,
  efectivoDisponible: PropTypes.number.isRequired,
  retirosAcumuladosDia: PropTypes.number.isRequired,
  gastosAcumuladosDia: PropTypes.number.isRequired,
  tarjetaContada: PropTypes.number.isRequired,
  transferenciaContada: PropTypes.number.isRequired,
  summary: PropTypes.shape({
    totalOrders: PropTypes.number.isRequired,
    totalProductos: PropTypes.number
  }).isRequired
};

export default FinancialSummary;
