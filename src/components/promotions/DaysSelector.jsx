import PropTypes from 'prop-types';

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Componente reutilizable para seleccionar días de la semana
 * Muestra botones toggle para cada día
 */
export function DaysSelector({
  selectedDays,
  onToggle,
  error,
  label = 'Días de la Semana',
  required = false
}) {
  return (
    <div className="form-group">
      <label>{label} {required && '*'}</label>
      <div className="days-selector">
        {DAY_NAMES.map((day, index) => (
          <button
            key={index}
            type="button"
            className={`day-button ${selectedDays.includes(index) ? 'selected' : ''}`}
            onClick={() => onToggle(index)}
          >
            {day}
          </button>
        ))}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

DaysSelector.propTypes = {
  selectedDays: PropTypes.arrayOf(PropTypes.number).isRequired,
  onToggle: PropTypes.func.isRequired,
  error: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool
};
