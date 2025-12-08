import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { DaysSelector } from './DaysSelector';

/**
 * Sección de restricciones del formulario de promoción
 * Maneja todas las restricciones opcionales: fechas, clientes, usos, compra mínima, días
 */
export function RestrictionsSection({ formData, errors, onChange, onDayToggle }) {
  return (
    <div className="form-section">
      <h3>Restricciones (Opcional)</h3>

      {/* Rango de fechas */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="hasDateRange"
            checked={formData.hasDateRange}
            onChange={onChange}
          />
          <span>Rango de fechas</span>
        </label>
      </div>

      {formData.hasDateRange && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={onChange}
                className={errors.dateRange ? 'error' : ''}
              />
            </div>

            <div className="form-group">
              <label>Fecha Fin</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={onChange}
                className={errors.dateRange ? 'error' : ''}
              />
            </div>
          </div>
          {errors.dateRange && (
            <span className="error-message" style={{ marginTop: '-8px', display: 'block' }}>
              {errors.dateRange}
            </span>
          )}
        </>
      )}

      {/* Un uso por cliente */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="onePerClient"
            checked={formData.onePerClient}
            onChange={onChange}
          />
          <span>Un uso por cliente</span>
        </label>
      </div>

      {/* Solo clientes nuevos */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="newClientsOnly"
            checked={formData.newClientsOnly}
            onChange={onChange}
          />
          <span>Solo clientes nuevos</span>
        </label>
      </div>

      {/* Límite de usos totales */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="hasMaxUses"
            checked={formData.hasMaxUses}
            onChange={onChange}
          />
          <span>Límite de usos totales</span>
        </label>
      </div>

      {formData.hasMaxUses && (
        <div className="form-group">
          <ValidatedNumberInput
            name="maxUses"
            value={formData.maxUses}
            onChange={onChange}
            label="Número Máximo de Usos"
            placeholder="100"
            min={1}
            max={999999}
            integer={true}
            required={true}
            error={errors.maxUses}
          />
        </div>
      )}

      {/* Monto mínimo de compra */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="hasMinPurchase"
            checked={formData.hasMinPurchase}
            onChange={onChange}
          />
          <span>Monto mínimo de compra</span>
        </label>
      </div>

      {formData.hasMinPurchase && (
        <div className="form-group">
          <ValidatedNumberInput
            name="minPurchaseAmount"
            value={formData.minPurchaseAmount}
            onChange={onChange}
            label="Monto Mínimo"
            placeholder="500"
            min={0}
            max={999999}
            integer={false}
            prefix="$"
            required={true}
            error={errors.minPurchaseAmount}
          />
        </div>
      )}

      {/* Solo en días específicos */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="hasDayRestriction"
            checked={formData.hasDayRestriction}
            onChange={onChange}
          />
          <span>Solo en días específicos</span>
        </label>
      </div>

      {formData.hasDayRestriction && (
        <DaysSelector
          selectedDays={formData.daysOfWeek}
          onToggle={onDayToggle}
          error={formData.hasDayRestriction ? errors.daysOfWeek : null}
          label="Días Válidos:"
          required={true}
        />
      )}
    </div>
  );
}

RestrictionsSection.propTypes = {
  formData: PropTypes.shape({
    hasDateRange: PropTypes.bool,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    onePerClient: PropTypes.bool,
    newClientsOnly: PropTypes.bool,
    hasMaxUses: PropTypes.bool,
    maxUses: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hasMinPurchase: PropTypes.bool,
    minPurchaseAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hasDayRestriction: PropTypes.bool,
    daysOfWeek: PropTypes.arrayOf(PropTypes.number)
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDayToggle: PropTypes.func.isRequired
};
