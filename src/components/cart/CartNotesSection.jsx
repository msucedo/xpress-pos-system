import PropTypes from 'prop-types';

/**
 * Sección de notas del carrito
 * Textarea compacto para agregar notas a la venta
 */
export function CartNotesSection({ notes, onChange }) {
  return (
    <div className="cart-notes-compact">
      <textarea
        className="cart-notes-input-compact"
        placeholder="Notas..."
        value={notes}
        onChange={onChange}
        rows={1}
      />
    </div>
  );
}

CartNotesSection.propTypes = {
  notes: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
