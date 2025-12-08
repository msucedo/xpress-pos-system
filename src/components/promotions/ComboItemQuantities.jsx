import PropTypes from 'prop-types';

/**
 * Componente reutilizable para gestionar cantidades de items en combos
 * Muestra inputs numéricos para cada item seleccionado
 */
export function ComboItemQuantities({ comboItems, onQuantityChange }) {
  if (!comboItems || comboItems.length === 0) {
    return null;
  }

  return (
    <div style={{
      marginTop: '16px',
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    }}>
      <strong style={{ display: 'block', marginBottom: '8px' }}>
        Cantidades por item:
      </strong>
      {comboItems.map((comboItem) => (
        <div
          key={comboItem.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}
        >
          <span style={{ flex: 1 }}>{comboItem.name}</span>
          <input
            type="number"
            min="1"
            value={comboItem.quantity || 1}
            onChange={(e) => onQuantityChange(comboItem.id, e.target.value)}
            style={{
              width: '70px',
              padding: '4px 8px',
              textAlign: 'center'
            }}
          />
          <span style={{ width: '30px', textAlign: 'right' }}>x</span>
        </div>
      ))}
    </div>
  );
}

ComboItemQuantities.propTypes = {
  comboItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number
  })).isRequired,
  onQuantityChange: PropTypes.func.isRequired
};
