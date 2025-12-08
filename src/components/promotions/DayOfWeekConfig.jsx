import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { DaysSelector } from './DaysSelector';

/**
 * Configuración específica para promociones de tipo 'dayOfWeek'
 * Maneja descuento porcentual en días específicos de la semana
 */
export function DayOfWeekConfig({ formData, errors, onChange, onDayToggle }) {
  return (
    <>
      <div className="form-group">
        <ValidatedNumberInput
          name="discountValue"
          value={formData.discountValue}
          onChange={onChange}
          label="Porcentaje de Descuento"
          placeholder="20"
          min={1}
          max={100}
          integer={false}
          suffix="%"
          required={true}
          error={errors.discountValue}
        />
      </div>

      <DaysSelector
        selectedDays={formData.daysOfWeek}
        onToggle={onDayToggle}
        error={errors.daysOfWeek}
        label="Días de la Semana"
        required={true}
      />
    </>
  );
}

DayOfWeekConfig.propTypes = {
  formData: PropTypes.shape({
    discountValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    daysOfWeek: PropTypes.arrayOf(PropTypes.number)
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDayToggle: PropTypes.func.isRequired
};
