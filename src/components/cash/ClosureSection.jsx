import PropTypes from 'prop-types';

/**
 * Componente para la sección de cierre de caja
 * Incluye: selector de empleado, notas, checkbox de habilitación y botón de cierre
 */
const ClosureSection = ({
  employees,
  selectedEmployee,
  setSelectedEmployee,
  notes,
  setNotes,
  habilitarCorteSinValidacion,
  setHabilitarCorteSinValidacion,
  isDisabled,
  onClose
}) => {
  return (
    <div className="cr-section">
      <div className="cr-section-header">
        <h3>📝 Notas y Cierre del Corte</h3>
      </div>

      {/* Employee Selector */}
      <div className="cr-employee-selector">
        <label className="cr-employee-label">
          <span className="cr-required">* </span>
          Empleado que realiza el corte:
        </label>
        <select
          className="cr-employee-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          required
        >
          <option value="">Selecciona un empleado...</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="cr-notes-textarea"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Agrega notas u observaciones sobre este corte de caja..."
        rows={4}
        maxLength={500}
      />
      <div className="cr-char-counter">{notes.length}/500</div>

      {/* Checkbox para habilitar corte sin validaciones */}
      <div className="cr-flexible-closure-checkbox">
        <label className="cr-checkbox-label">
          <input
            type="checkbox"
            checked={habilitarCorteSinValidacion}
            onChange={(e) => setHabilitarCorteSinValidacion(e.target.checked)}
          />
          <span className="cr-checkbox-text">
            Habilitar corte sin órdenes y con diferencias de dinero en el sistema
          </span>
        </label>
      </div>

      <button
        className="cr-btn-close"
        onClick={onClose}
        disabled={isDisabled}
      >
        🔒 Cerrar Corte de Caja
      </button>
    </div>
  );
};

ClosureSection.propTypes = {
  employees: PropTypes.array.isRequired,
  selectedEmployee: PropTypes.string.isRequired,
  setSelectedEmployee: PropTypes.func.isRequired,
  notes: PropTypes.string.isRequired,
  setNotes: PropTypes.func.isRequired,
  habilitarCorteSinValidacion: PropTypes.bool.isRequired,
  setHabilitarCorteSinValidacion: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ClosureSection;
