import PropTypes from 'prop-types';

/**
 * Componente reutilizable para seleccionar items (servicios/productos)
 * Muestra checkboxes en un grid para seleccionar múltiples items
 */
export function ItemsSelector({
  items,
  selectedIds,
  onToggle,
  error,
  label = 'Selecciona Items',
  helpText = null
}) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      {helpText && <span className="field-hint">{helpText}</span>}
      <div className={`items-selector ${error ? 'error' : ''}`}>
        {items.map(item => (
          <label key={item.id} className="item-checkbox">
            <input
              type="checkbox"
              checked={selectedIds.includes(item.id)}
              onChange={() => onToggle(item.id)}
            />
            <span>{item.name}</span>
          </label>
        ))}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

ItemsSelector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  error: PropTypes.string,
  label: PropTypes.string,
  helpText: PropTypes.string
};
