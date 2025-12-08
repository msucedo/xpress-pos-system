import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/payments/paymentHelpers';
import { DENOMINACIONES_BILLETES, DENOMINACIONES_MONEDAS } from '../../utils/cash/denominationHelpers';

/**
 * Componente completo para el conteo de ingresos
 * Incluye: dinero inicial, billetes, monedas, tarjeta, transferencia
 */
const IncomeCounting = ({
  dineroInicial,
  setDineroInicial,
  billetes,
  incrementarBillete,
  decrementarBillete,
  monedas,
  incrementarMoneda,
  decrementarMoneda,
  cobrosTarjeta,
  handleCobroTarjetaChange,
  handleTipoTarjetaChange,
  agregarCobroTarjeta,
  eliminarCobroTarjeta,
  transferencias,
  handleTransferenciaChange,
  agregarTransferencia,
  eliminarTransferencia,
  efectivoContado,
  tarjetaContada,
  transferenciaContada,
  totalConteoIngresos
}) => {
  return (
    <div className="cr-section">
      <div className="cr-section-header">
        <h3>📊 Conteo de Ingresos</h3>
      </div>

      {/* Dinero Inicial */}
      <div className="cr-subsection">
        <h4 className="cr-subsection-title">💰 Dinero Inicial en Caja</h4>
        <div className="cr-inicial-input">
          <input
            type="number"
            className="cr-input"
            value={dineroInicial}
            onChange={(e) => setDineroInicial(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      {/* Efectivo - Billetes y Monedas */}
      <div className="cr-subsection">
        <h4 className="cr-subsection-title">💵 Efectivo</h4>
        <div className='cr-subsection-conteoBilletesMonedas'>
          {/* Billetes */}
          <div className="cr-denomination-group">
            <h5 className="cr-group-label">Billetes</h5>
            <div className="cr-bill-grid">
              {DENOMINACIONES_BILLETES.map(denominacion => (
                <div key={denominacion} className="cr-bill-row">
                  <span className="cr-bill-label">${denominacion}</span>
                  <button
                    className="cr-bill-btn-decrement"
                    onClick={() => decrementarBillete(denominacion)}
                    type="button"
                  >
                    ⬇️
                  </button>
                  <input
                    type="number"
                    className="cr-bill-input"
                    value={billetes[denominacion]!=0?billetes[denominacion]:""}
                    readOnly
                    placeholder="0"
                  />
                  <button
                    className="cr-bill-btn-increment"
                    onClick={() => incrementarBillete(denominacion)}
                    type="button"
                  >
                    ⬆️
                  </button>
                  <span className="cr-bill-equal">=</span>
                  <span className="cr-bill-total">
                    {formatCurrency(denominacion * billetes[denominacion])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monedas */}
          <div className="cr-denomination-group">
            <h5 className="cr-group-label">Monedas</h5>
            <div className="cr-bill-grid">
              {DENOMINACIONES_MONEDAS.map(denominacion => (
                <div key={denominacion} className="cr-bill-row">
                  <span className="cr-bill-label">${denominacion}</span>
                  <button
                    className="cr-bill-btn-decrement"
                    onClick={() => decrementarMoneda(denominacion)}
                    type="button"
                  >
                    ⬇️
                  </button>
                  <input
                    type="number"
                    className="cr-bill-input"
                    value={monedas[denominacion]!=0?monedas[denominacion]:""}
                    readOnly
                    placeholder="0"
                  />
                  <button
                    className="cr-bill-btn-increment"
                    onClick={() => incrementarMoneda(denominacion)}
                    type="button"
                  >
                    ⬆️
                  </button>
                  <span className="cr-bill-equal">=</span>
                  <span className="cr-bill-total">
                    {formatCurrency(denominacion * monedas[denominacion])}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Total Efectivo */}
          <div className="cr-subtotal-row">
            <span>Total Efectivo Contado:</span>
            <span className="cr-subtotal-amount">{formatCurrency(efectivoContado)}</span>
          </div>
        </div>
      </div>

      <div className='cr-subsection nocash'>
        {/* Tarjeta */}
        <div className="cr-subsection">
          <h4 className="cr-subsection-title">💳 Tarjeta (Terminal/TPV)</h4>
          <div className="cr-payments-list">
            {cobrosTarjeta.map((cobro, index) => (
              <div key={index} className="cr-payment-row">
                <span className="cr-payment-label">Cobro #{index + 1}:</span>
                <input
                  type="number"
                  className="cr-payment-input"
                  value={cobro.monto}
                  onChange={(e) => handleCobroTarjetaChange(index, e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <select
                  className="cr-tipo-tarjeta-select"
                  value={cobro.tipo}
                  onChange={(e) => handleTipoTarjetaChange(index, e.target.value)}
                >
                  <option value="debito">Débito</option>
                  <option value="credito">Crédito</option>
                </select>
                {cobrosTarjeta.length > 1 && (
                  <button
                    className="cr-payment-delete"
                    onClick={() => eliminarCobroTarjeta(index)}
                    title="Eliminar cobro"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button className="cr-add-payment-btn" onClick={agregarCobroTarjeta}>
              + Agregar otro cobro
            </button>
          </div>
          <div className="cr-subtotal-row">
            <span>Total Tarjeta:</span>
            <span className="cr-subtotal-amount">{formatCurrency(tarjetaContada)}</span>
          </div>
        </div>

        {/* Transferencia */}
        <div className="cr-subsection">
          <h4 className="cr-subsection-title">🏦 Transferencia (Banco/App)</h4>
          <div className="cr-payments-list">
            {transferencias.map((trans, index) => (
              <div key={index} className="cr-payment-row">
                <span className="cr-payment-label">Transferencia #{index + 1}:</span>
                <input
                  type="number"
                  className="cr-payment-input"
                  value={trans.monto}
                  onChange={(e) => handleTransferenciaChange(index, e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {transferencias.length > 1 && (
                  <button
                    className="cr-payment-delete"
                    onClick={() => eliminarTransferencia(index)}
                    title="Eliminar transferencia"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button className="cr-add-payment-btn" onClick={agregarTransferencia}>
              + Agregar otra transferencia
            </button>
          </div>
          <div className="cr-subtotal-row">
            <span>Total Transferencia:</span>
            <span className="cr-subtotal-amount">{formatCurrency(transferenciaContada)}</span>
          </div>
        </div>
      </div>

      {/* Total General del Conteo */}
      <div className="cr-total-row">
        <span>💰 TOTAL CONTEO DE INGRESOS:</span>
        <span className="cr-total-amount">{formatCurrency(totalConteoIngresos)}</span>
      </div>
    </div>
  );
};

IncomeCounting.propTypes = {
  dineroInicial: PropTypes.string.isRequired,
  setDineroInicial: PropTypes.func.isRequired,
  billetes: PropTypes.object.isRequired,
  incrementarBillete: PropTypes.func.isRequired,
  decrementarBillete: PropTypes.func.isRequired,
  monedas: PropTypes.object.isRequired,
  incrementarMoneda: PropTypes.func.isRequired,
  decrementarMoneda: PropTypes.func.isRequired,
  cobrosTarjeta: PropTypes.array.isRequired,
  handleCobroTarjetaChange: PropTypes.func.isRequired,
  handleTipoTarjetaChange: PropTypes.func.isRequired,
  agregarCobroTarjeta: PropTypes.func.isRequired,
  eliminarCobroTarjeta: PropTypes.func.isRequired,
  transferencias: PropTypes.array.isRequired,
  handleTransferenciaChange: PropTypes.func.isRequired,
  agregarTransferencia: PropTypes.func.isRequired,
  eliminarTransferencia: PropTypes.func.isRequired,
  efectivoContado: PropTypes.number.isRequired,
  tarjetaContada: PropTypes.number.isRequired,
  transferenciaContada: PropTypes.number.isRequired,
  totalConteoIngresos: PropTypes.number.isRequired
};

export default IncomeCounting;
