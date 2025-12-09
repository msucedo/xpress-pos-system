import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Barra de búsqueda del carrito para escanear códigos de barras
 * Incluye validación de input y feedback visual
 */
export const CartSearchBar = forwardRef(({ value, onChange, onKeyPress, showFeedback }, ref) => {
  return (
    <div className="cart-search-bar">
      <div className="validated-input-wrapper">
        <input
          ref={ref}
          type="text"
          className={`cart-search-input ${showFeedback ? 'shake' : ''}`}
          placeholder="Escanear código de barras..."
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
        {showFeedback && (
          <div className="input-feedback">Carácter no permitido</div>
        )}
      </div>
    </div>
  );
});

CartSearchBar.displayName = 'CartSearchBar';

CartSearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  showFeedback: PropTypes.bool.isRequired
};
