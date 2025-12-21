import PropTypes from 'prop-types';
import { Icon } from '../../icons';

/**
 * Encabezado del carrito
 * Muestra título con contador de items y botón de cierre
 */
export function CartHeader({ itemCount, onClose }) {
  return (
    <div className="cart-header">
      <div className="cart-header-top">
        <h2 className="cart-title">
          Carrito {itemCount > 0 && `(${itemCount})`}
        </h2>
        <button className="cart-close-btn" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
      </div>
    </div>
  );
}

CartHeader.propTypes = {
  itemCount: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
};
